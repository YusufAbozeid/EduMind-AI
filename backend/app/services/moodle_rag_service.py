import os
import re
import json
from typing import Any, Dict, List, Optional, Tuple

BASE_VECTOR_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage", "vectors"))
os.makedirs(BASE_VECTOR_DIR, exist_ok=True)

# Global embeddings singleton to avoid reloading model on every request
_embeddings_instance = None

def get_embeddings():
    global _embeddings_instance
    if _embeddings_instance is None:
        try:
            from langchain_huggingface import HuggingFaceEmbeddings
            _embeddings_instance = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        except Exception as e:
            print(f"[MoodleRAG] HuggingFaceEmbeddings loading warning: {e}. Attempting sentence-transformers fallback...")
            try:
                from sentence_transformers import SentenceTransformer
                class MiniLMEmbeddingsFallback:
                    def __init__(self):
                        self.model = SentenceTransformer("all-MiniLM-L6-v2")
                    def embed_documents(self, texts: List[str]) -> List[List[float]]:
                        return self.model.encode(texts).tolist()
                    def embed_query(self, text: str) -> List[float]:
                        return self.model.encode([text])[0].tolist()
                _embeddings_instance = MiniLMEmbeddingsFallback()
            except Exception as e2:
                print(f"[MoodleRAG] Fallback failed: {e2}")
                _embeddings_instance = None
    return _embeddings_instance

class MoodleRagService:
    @classmethod
    def extract_text_by_pages(cls, pdf_path: str) -> List[Tuple[int, str]]:
        """
        Extracts text from PDF page by page.
        Returns list of tuples: (page_number_1_indexed, page_text)
        """
        pages_text = []

        # Try PyMuPDF first (fastest, most accurate)
        try:
            import pymupdf
            doc = pymupdf.open(pdf_path)
            for page_idx in range(len(doc)):
                text = doc[page_idx].get_text()
                if text and text.strip():
                    pages_text.append((page_idx + 1, text.strip()))
            doc.close()
            if pages_text:
                return pages_text
        except Exception as e:
            print(f"[MoodleRAG] pymupdf extraction notice on {pdf_path}: {e}")

        # Fallback to PyPDF2
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(pdf_path)
            for page_idx, page in enumerate(reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    pages_text.append((page_idx + 1, text.strip()))
            if pages_text:
                return pages_text
        except Exception as e:
            print(f"[MoodleRAG] PyPDF2 extraction failed on {pdf_path}: {e}")

        return pages_text

    @classmethod
    def chunk_document(
        cls,
        pages_text: List[Tuple[int, str]],
        metadata_base: Dict[str, Any],
        chunk_size: int = 800,
        chunk_overlap: int = 150
    ) -> List[Dict[str, Any]]:
        """
        Splits page text into chunks while binding exact course, file, and page metadata.
        """
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        chunks = []

        for page_num, page_content in pages_text:
            splits = text_splitter.split_text(page_content)
            for idx, split in enumerate(splits):
                chunk_meta = dict(metadata_base)
                chunk_meta["page_number"] = page_num
                chunk_meta["chunk_id"] = f"{metadata_base.get('moodle_file_id', 'f')}_p{page_num}_c{idx}"
                chunks.append({
                    "text": split,
                    "metadata": chunk_meta
                })

        return chunks

    @classmethod
    def get_user_vector_dir(cls, user_id: str) -> str:
        safe_user_id = re.sub(r'[^a-zA-Z0-9_\-]', '_', user_id.strip())
        path = os.path.join(BASE_VECTOR_DIR, safe_user_id)
        os.makedirs(path, exist_ok=True)
        return path

    @classmethod
    def index_chunks_into_user_store(cls, user_id: str, chunks: List[Dict[str, Any]]):
        """
        Embeds chunks and saves/merges them into user-isolated FAISS vector store.
        """
        if not chunks:
            return

        texts = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]

        vector_dir = cls.get_user_vector_dir(user_id)
        index_file = os.path.join(vector_dir, "index.faiss")

        # Maintain JSON index backup for fast metadata retrieval and fallback matching
        meta_file = os.path.join(vector_dir, "metadata_store.json")
        existing_store = []
        if os.path.exists(meta_file):
            try:
                with open(meta_file, "r", encoding="utf-8") as f:
                    existing_store = json.load(f)
            except Exception:
                existing_store = []

        new_chunk_ids = {m.get("chunk_id") for m in metadatas}
        filtered_store = [item for item in existing_store if item.get("metadata", {}).get("chunk_id") not in new_chunk_ids]
        for c in chunks:
            filtered_store.append(c)

        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(filtered_store, f, ensure_ascii=False, indent=2)

        # FAISS Index update
        try:
            from langchain_community.vectorstores import FAISS
            embeddings = get_embeddings()
            if embeddings is not None:
                if os.path.exists(index_file):
                    vectorstore = FAISS.load_local(vector_dir, embeddings, allow_dangerous_deserialization=True)
                    vectorstore.add_texts(texts=texts, metadatas=metadatas)
                else:
                    vectorstore = FAISS.from_texts(texts=texts, embedding=embeddings, metadatas=metadatas)
                vectorstore.save_local(vector_dir)
        except Exception as e:
            print(f"[MoodleRAG] FAISS indexing warning: {e}")

    @classmethod
    def query_user_knowledge_base(
        cls,
        user_id: str,
        query: str,
        course_id: Optional[int] = None,
        top_k: int = 5,
        language: str = "ar"
    ) -> Dict[str, Any]:
        """
        Retrieves top relevant chunks strictly isolated to user_id, optionally filtered by course_id,
        and generates an accurate answer with exact citations.
        """
        vector_dir = cls.get_user_vector_dir(user_id)
        meta_file = os.path.join(vector_dir, "metadata_store.json")
        matched_chunks = []

        # 1. Primary retrieval via FAISS
        faiss_succeeded = False
        try:
            from langchain_community.vectorstores import FAISS
            embeddings = get_embeddings()
            if embeddings is not None and os.path.exists(os.path.join(vector_dir, "index.faiss")):
                vectorstore = FAISS.load_local(vector_dir, embeddings, allow_dangerous_deserialization=True)
                docs = vectorstore.similarity_search(query, k=top_k * 2)
                for doc in docs:
                    meta = doc.metadata or {}
                    if course_id and str(meta.get("course_id")) != str(course_id):
                        continue
                    matched_chunks.append({
                        "text": doc.page_content,
                        "metadata": meta
                    })
                    if len(matched_chunks) >= top_k:
                        break
                faiss_succeeded = len(matched_chunks) > 0
        except Exception as e:
            print(f"[MoodleRAG] FAISS query notice: {e}")

        # 2. Fallback search via metadata store if FAISS not ready or empty
        if not faiss_succeeded and os.path.exists(meta_file):
            try:
                with open(meta_file, "r", encoding="utf-8") as f:
                    all_chunks = json.load(f)

                query_terms = [t.lower() for t in query.split() if len(t) > 2]
                scored_chunks = []

                for item in all_chunks:
                    meta = item.get("metadata", {})
                    if course_id and str(meta.get("course_id")) != str(course_id):
                        continue
                    text_lower = item.get("text", "").lower()
                    score = sum(1 for term in query_terms if term in text_lower)
                    if score > 0 or not query_terms:
                        scored_chunks.append((score, item))

                scored_chunks.sort(key=lambda x: x[0], reverse=True)
                matched_chunks = [c[1] for c in scored_chunks[:top_k]]
            except Exception as e:
                print(f"[MoodleRAG] Fallback retrieval notice: {e}")

        # 3. Extract unique citations
        citations = []
        seen_citations = set()
        for c in matched_chunks:
            meta = c.get("metadata", {})
            course_name = meta.get("course_name", "Moodle Course")
            filename = meta.get("filename", "Material.pdf")
            page_num = meta.get("page_number", 1)
            section = meta.get("section_name", "")
            preview = c.get("text", "")[:120].strip().replace("\n", " ") + "..."

            cit_key = (course_name, filename, page_num)
            if cit_key not in seen_citations:
                seen_citations.add(cit_key)
                citations.append({
                    "course_name": course_name,
                    "filename": filename,
                    "section_name": section,
                    "page_number": page_num,
                    "source_chunk_preview": preview
                })

        # 4. Synthesize answer with Groq/LLM or structured synthesis
        answer = cls._generate_answer(query, matched_chunks, citations, language=language)

        return {
            "answer": answer,
            "citations": citations,
            "course_filtered": str(course_id) if course_id else "all",
            "chunks_found": len(matched_chunks)
        }

    @classmethod
    def _generate_answer(
        cls, 
        query: str, 
        chunks: List[Dict[str, Any]], 
        citations: List[Dict[str, Any]], 
        language: str = "ar"
    ) -> str:
        if not chunks:
            if language == "ar":
                return "لم يتم العثور على مراجع مطابقة في مقررات Moodle المفعلة حالياً. تأكد من تفعيل المقرر ومزامنة ملفات الـ PDF الخاصة به."
            return "No matching content was found in your activated Moodle course materials. Please ensure the course is activated and synced."

        context_str = "\n\n---\n\n".join([
            f"[المقرر: {c['metadata'].get('course_name')} | الملف: {c['metadata'].get('filename')} | صفحة: {c['metadata'].get('page_number')}]\n{c['text']}"
            for c in chunks
        ])

        citations_summary = "\n".join([
            f"- [{c['course_name']}, {c['filename']}, Page {c['page_number']}]"
            for c in citations
        ])

        # Groq LLM integration
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                from langchain_groq import ChatGroq
                llm = ChatGroq(
                    groq_api_key=groq_key,
                    model_name=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                    temperature=0.2
                )
                system_prompt = (
                    "You are an expert academic AI tutor for university students using SHAGHOOF AI.\n"
                    "Answer the student's question strictly and accurately based on the provided Moodle course documents.\n"
                    "CRITICAL CITATION RULES:\n"
                    "1. Respond in the exact language requested by the student (Arabic or English).\n"
                    "2. At the end of your explanation, provide a 'المصادر المرجعية' or 'Sources' section citing the exact Course, File, and Page Number as provided in the context.\n"
                    "3. Highlight key academic concepts using bold text.\n"
                    "4. Never invent information or page numbers outside the context."
                )
                user_prompt = f"Moodle Course Context:\n{context_str}\n\nStudent Question:\n{query}"
                response = llm.invoke([("system", system_prompt), ("user", user_prompt)])
                return response.content.strip()
            except Exception as e:
                print(f"[MoodleRAG] LLM generation notice: {e}. Using structured contextual synthesis.")

        # High-clarity academic contextual synthesis
        is_ar = language == "ar"
        primary_chunk = chunks[0]["text"]
        
        if is_ar:
            answer = (
                f"بناءً على المادة العلمية المعتمدة في مقرراتك على Moodle:\n\n"
                f"{primary_chunk}\n\n"
                f"📌 **المصادر المعتمدة:**\n{citations_summary}"
            )
        else:
            answer = (
                f"Based on your official Moodle course materials:\n\n"
                f"{primary_chunk}\n\n"
                f"📌 **Referenced Sources:**\n{citations_summary}"
            )

        return answer
