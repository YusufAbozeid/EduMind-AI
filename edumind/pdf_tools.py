import os
import hashlib
from typing import Generator, List, Union
import streamlit as st
import fitz  # PyMuPDF
from pydantic import BaseModel, Field

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq

SUGGESTED_PROMPTS = [
    "Summarize this file",
    "Quiz me on this file",
    "Explain the key formula",
]


# --- Structured Output Schemas ---
class QuizItem(BaseModel):
    question: str = Field(description="The quiz question generated strictly from the context.")
    answer: str = Field(description="The correct concise answer based strictly on the context.")

class QuizSchema(BaseModel):
    questions: List[QuizItem]


def get_groq_llm(streaming: bool = False, temperature: float = 0.2) -> ChatGroq:
    """Instantiates ChatGroq with explicit key validation and clean fail-fast check."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key and hasattr(st, "secrets"):
        api_key = st.secrets.get("GROQ_API_KEY")

    if not api_key:
        st.error("GROQ_API_KEY is missing! Please configure it in Streamlit Secrets or Environment Variables.")
        st.stop()

    groq_model = os.getenv("GROQ_MODEL")
    if not groq_model and hasattr(st, "secrets"):
        groq_model = st.secrets.get("GROQ_MODEL", "llama-3.1-8b-instant")
    elif not groq_model:
        groq_model = "llama-3.1-8b-instant"

    safe_temp = max(0.0, min(float(temperature), 2.0))
    return ChatGroq(
        groq_api_key=api_key,
        model_name=groq_model,
        streaming=streaming,
        temperature=safe_temp
    )


@st.cache_resource
def get_embeddings():
    """Loads multilingual embedding model supporting Arabic and English seamlessly."""
    return HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


def _hash_bytes(file_bytes: bytes) -> str:
    return hashlib.md5(file_bytes).hexdigest()


@st.cache_resource(hash_funcs={bytes: _hash_bytes})
def process_pdf_to_vectorstore(file_input: Union[bytes, object]) -> FAISS:
    """Robust PDF text extraction using PyMuPDF (fitz) with deterministic MD5 byte caching."""
    if hasattr(file_input, "getvalue"):
        file_bytes = file_input.getvalue()
    elif isinstance(file_input, bytes):
        file_bytes = file_input
    else:
        raise ValueError("Invalid file input type. Expected bytes or UploadedFile.")

    if not file_bytes:
        raise ValueError("Uploaded PDF file is empty.")

    doc = fitz.open(stream=file_bytes, filetype="pdf")
    documents = []

    for page_num, page in enumerate(doc, start=1):
        extracted = page.get_text("text")
        if extracted and extracted.strip():
            documents.append(
                Document(
                    page_content=extracted.strip(),
                    metadata={"page": page_num}
                )
            )

    if not documents:
        raise ValueError("No extractable text found in PDF. The file might be scanned or image-based.")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    embeddings = get_embeddings()
    return FAISS.from_documents(chunks, embedding=embeddings)


def _extract_args(arg1, arg2):
    """Auto-detects vectorstore and query order safely."""
    if hasattr(arg1, "similarity_search"):
        return arg1, str(arg2)
    elif hasattr(arg2, "similarity_search"):
        return arg2, str(arg1)
    return None, str(arg1 or arg2)


def get_rag_response(
    vectorstore, 
    query: str, 
    history: list = None, 
    streaming: bool = True
):
    """Unified RAG pipeline supporting both Streaming and Synchronous responses."""
    if not hasattr(vectorstore, "similarity_search"):
        vectorstore, query = _extract_args(vectorstore, query)

    if not vectorstore:
        msg = "Error: Vectorstore not initialized. Please re-upload your PDF file."
        return (chunk for chunk in [msg]) if streaming else msg

    docs = vectorstore.similarity_search(query, k=4)
    context = "\n\n".join([f"[Page {doc.metadata.get('page', '?')}]: {doc.page_content}" for doc in docs])

    messages = [
        ("system", "You are an AI technical assistant. Answer strictly based on the provided PDF context. "
                   "Always respond in the EXACT same language as the user's question (Arabic or English).")
    ]

    if history:
        for item in history[-6:]:
            if isinstance(item, dict):
                messages.append((item.get("role", "user"), item.get("content", "")))

    prompt = f"Context from PDF:\n{context}\n\nUser Question:\n{query}"
    messages.append(("user", prompt))

    llm = get_groq_llm(streaming=streaming, temperature=0.2)

    if streaming:
        def stream_generator():
            for chunk in llm.stream(messages):
                if chunk.content:
                    yield chunk.content
        return stream_generator()
    else:
        return llm.invoke(messages).content


def get_formula_response(question: str, vectorstore, history=None, **kwargs) -> str:
    """Extracts mathematical formulas strictly preserving special symbols."""
    if not hasattr(vectorstore, "similarity_search"):
        vectorstore, question = _extract_args(question, vectorstore)

    if not vectorstore:
        return "Error: Vectorstore not initialized."

    search_query = f"formula equation mathematical expression {question}"
    docs = vectorstore.similarity_search(search_query, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])

    if not context or len(context) < 30:
        return "I couldn't find any formula-related content in the PDF."

    prompt = f"""You are a precise AI assistant. Extract the formula or equation strictly from the PDF CONTENT below.
    
PDF CONTENT:
{context}

User Question: {question}

IMPORTANT: Preserve all math symbols (∑, ∫, √, π, θ, α, β) and explain the terms based strictly on the text."""

    messages = [
        ("system", "You are a strict assistant that ONLY uses provided PDF context."),
        ("user", prompt)
    ]

    llm = get_groq_llm(temperature=0.1)
    return llm.invoke(messages).content.strip()


def generate_quiz_questions(vectorstore, num_questions: int = 5, **kwargs) -> list[dict]:
    """Generates quiz questions via Pydantic Structured Output to eliminate Regex parsing failures."""
    if not hasattr(vectorstore, "similarity_search"):
        return [{"question": "Error: Invalid vectorstore object.", "answer": "Re-upload PDF."}]

    search_query = "key concepts definitions core principles summary main ideas"
    docs = vectorstore.similarity_search(search_query, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])[:4000]

    llm = get_groq_llm(temperature=0.2)
    structured_llm = llm.with_structured_output(QuizSchema)

    prompt = f"Generate exactly {num_questions} quiz questions and concise correct answers based ONLY on this context:\n\n{context}"

    try:
        result: QuizSchema = structured_llm.invoke(prompt)
        return [q.model_dump() for q in result.questions]
    except Exception as e:
        return [{
            "question": "What is the primary focus of this document?",
            "answer": context[:150] if context else "No content available."
        }]


def check_answer(user_answer: str, correct_answer: str, question: str = "") -> bool:
    """Semantic answer verification via LLM-as-a-Judge."""
    if user_answer.strip().lower() == correct_answer.strip().lower():
        return True

    llm = get_groq_llm(temperature=0.0)
    prompt = f"""Question: {question}
Expected Answer: {correct_answer}
User Answer: {user_answer}

Evaluate if the User Answer is semantically correct relative to the Expected Answer.
Respond ONLY with 'CORRECT' or 'INCORRECT' followed by a short explanation.
Format: [CORRECT/INCORRECT] - Reason
"""
    try:
        res = llm.invoke(prompt).content.strip()
        return res.startswith("CORRECT")
    except Exception:
        u_words = set(user_answer.lower().split())
        c_words = set(correct_answer.lower().split())
        return len(u_words.intersection(c_words)) / max(len(c_words), 1) >= 0.5