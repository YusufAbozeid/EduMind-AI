import re
from threading import Thread
from typing import Any, Generator
import streamlit as st
import torch
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer

try:
    from PyPDF2 import PdfReader
except Exception:
    PdfReader = None

SUGGESTED_PROMPTS = [
    "Summarize this file",
    "Quiz me on this file",
    "Explain the key formula",
]

@st.cache_resource
def load_model():
    MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"
    device = "cuda" if torch.cuda.is_available() else "cpu"

    try:
        from transformers import BitsAndBytesConfig
        quantization_config = BitsAndBytesConfig(load_in_8bit=True)
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            quantization_config=quantization_config,
            device_map="auto"
        )
    except Exception:
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        model.to(device)
        
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    return tokenizer, model, device


tokenizer, model, device = load_model()

@st.cache_resource
def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
@st.cache_resource    
def process_pdf_to_vectorstore(pdf_file):
    if isinstance(pdf_file, str):
        text = pdf_file
    else:
        if PdfReader is None:
            raise ImportError("PyPDF2 is required to process PDF files.")
        pdf_reader = PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_text(text)
    embeddings = get_embeddings()

    return FAISS.from_texts(texts=chunks, embedding=embeddings)


def get_qwen_response(query, vectorstore, history=None) -> Generator[str, None, None]:
    docs = vectorstore.similarity_search(query, k=3)
    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""
You are an AI assistant.

Context from PDF:
{context}

User Question:
{query}

Instructions:
1. Answer using the PDF context whenever possible.
2. If the PDF does not contain the answer, answer from your own knowledge.
3. Keep the answer concise.

Answer:
"""

    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    
    if history:
        messages.extend(history[-6:])

    messages.append({"role": "user", "content": prompt})

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = tokenizer(text, return_tensors="pt").to(model.device)
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    
    generation_kwargs = dict(
        **inputs,
        max_new_tokens=512,
        temperature=0.2,
        do_sample=True,
        streamer=streamer
    )
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()
    for new_text in streamer:
        yield new_text


def pdf_answer(question: str, vectorstore, history=None) -> Generator[str, None, None]:
    yield from get_qwen_response(question, vectorstore, history=history)


def get_formula_response(question: str, vectorstore, history=None) -> str:
    search_query = f"formula equation mathematical expression {question}"
    docs = vectorstore.similarity_search(search_query, k=5)
    context = "\n\n".join([doc.page_content for doc in docs])
    
    if not context or len(context) < 50:
        return "I couldn't find any formula-related content in the PDF. Please make sure the PDF contains mathematical content."

    prompt = f"""
You are a precise AI assistant. The user is asking about a formula or equation from the PDF.

PDF CONTENT (USE THIS EXACTLY):
{context}

User Question: {question}

IMPORTANT INSTRUCTIONS:
1. Extract the formula or equation EXACTLY as it appears in the PDF CONTENT above.
2. If you don't see a formula in the PDF CONTENT above, state: "No formula was found in the PDF content."
3. PRESERVE ALL special characters, mathematical symbols (like ∑, ∫, √, π, θ, α, β, γ, Δ, etc.)
4. Use proper mathematical notation.
5. Explain the formula using ONLY the PDF CONTENT above.
6. Do NOT use your general knowledge or invent formulas.

Response format:
- First show the formula as it appears in the PDF
- Then explain what each part means based on the PDF
- Finally, explain the significance of the formula from the PDF context

Remember: ONLY USE INFORMATION FROM THE PDF CONTENT ABOVE.
"""

    messages = [
        {
            "role": "system",
            "content": "You are a strict assistant that ONLY uses the provided PDF content. Never use external knowledge."
        },
    ]
    
    if history:
        messages.extend(history[-6:])
    
    messages.append({"role": "user", "content": prompt})

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = tokenizer(text, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=512,
        temperature=0.1,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

    response = tokenizer.decode(
        outputs[0][inputs.input_ids.shape[1]:],
        skip_special_tokens=True
    )
    
    return response.strip()


def generate_quiz_questions(vectorstore, num_questions: int = 5) -> list[dict]:
    search_query = "key concepts definitions main ideas important details core principles"
    docs = vectorstore.similarity_search(search_query, k=6)
    context = "\n\n---\n\n".join([doc.page_content for doc in docs])
    
    if not context or len(context) < 100:
        return [{
            "question": "I couldn't find enough content in your PDF to generate questions. Please make sure the PDF contains readable text.",
            "answer": "Upload a PDF with more content."
        }]
    
    if len(context) > 5000:
        context = context[:5000] + "..."
    
    prompt = f"""
You are creating a quiz based ONLY on the PDF content below.

PDF CONTENT (USE THIS EXACTLY):
{context}

Generate {num_questions} different quiz questions based ONLY on the content above.

FORMAT YOUR RESPONSE EXACTLY AS:
Q1: [question 1]
A1: [answer 1]

Q2: [question 2]
A2: [answer 2]

...and so on for all {num_questions} questions.

IMPORTANT RULES:
- ONLY use information from the PDF CONTENT above
- DO NOT use your general knowledge
- Questions must be answerable from the PDF content
- Each question should have ONE correct answer
- Answers should be directly from the PDF text

RESPONSE:
"""
    
    messages = [
        {"role": "system", "content": "You are a strict assistant that ONLY uses the provided PDF content to create quiz questions."},
        {"role": "user", "content": prompt}
    ]
    
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    
    inputs = tokenizer(text, return_tensors="pt").to(model.device)
    
    outputs = model.generate(
        **inputs,
        max_new_tokens=600,
        temperature=0.2,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    
    response = tokenizer.decode(
        outputs[0][inputs.input_ids.shape[1]:],
        skip_special_tokens=True
    )
    
    questions = []
    q_pattern = r'Q(\d+):\s*(.*?)\s*A\1:\s*(.*?)(?=Q\d+:|$)'
    matches = re.findall(q_pattern, response, re.DOTALL)
    
    if matches:
        for match in matches:
            _, question_text, answer_text = match
            questions.append({
                "question": question_text.strip(),
                "answer": answer_text.strip()
            })
    else:
        lines = response.strip().split('\n')
        current_q = None
        current_a = None
        
        for line in lines:
            line = line.strip()
            if re.match(r'^Q\d+:', line):
                if current_q and current_a:
                    questions.append({"question": current_q, "answer": current_a})
                parts = line.split(':', 1)
                current_q = parts[1].strip() if len(parts) > 1 else ""
                current_a = None
            elif re.match(r'^A\d+:', line) and current_q:
                parts = line.split(':', 1)
                current_a = parts[1].strip() if len(parts) > 1 else ""
                questions.append({"question": current_q, "answer": current_a})
                current_q = None
                current_a = None
        
        if current_q and current_a:
            questions.append({"question": current_q, "answer": current_a})
    
    if not questions:
        questions = [{
            "question": "What is the main topic of this PDF?",
            "answer": context[:200] if context else "No content found."
        }]
    
    return questions[:num_questions]


def check_answer(user_answer: str, correct_answer: str) -> bool:
    user_clean = user_answer.lower().strip()
    correct_clean = correct_answer.lower().strip()
    
    if user_clean == correct_clean:
        return True
    
    stopwords = {'the', 'a', 'an', 'of', 'to', 'for', 'with', 'on', 'at', 'from', 'by', 'in', 'as', 'is', 'was', 'are', 'were'}
    
    correct_words = [word for word in correct_clean.split() if word not in stopwords]
    user_words = [word for word in user_clean.split() if word not in stopwords]
    
    if correct_words:
        matches = sum(1 for word in correct_words if word in user_words)
        match_percentage = matches / len(correct_words)
        
        if match_percentage >= 0.6:
            return True
    
    return False