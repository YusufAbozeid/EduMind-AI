import streamlit as st
from edumind.pdf_tools import process_pdf_to_vectorstore, pdf_answer, SUGGESTED_PROMPTS,get_formula_response,generate_quiz_questions,check_answer
from edumind.storage import add_event
from edumind.ui import page_header


def render_pdf_chat() -> None:
    page_header("Chat with Lecture PDFs", "Upload a lecture PDF, ask questions, and turn the conversation into progress data.")
    st.markdown("<div class='main-container'>", unsafe_allow_html=True)
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)

    uploaded = st.file_uploader("Lecture PDF", type=["pdf"])
    st.markdown("</div>", unsafe_allow_html=True)
    
    if "pdf_chat" not in st.session_state:
        st.session_state.pdf_chat = []
        # Initialize quiz state
    if "quiz_active" not in st.session_state:
        st.session_state.quiz_active = False
    if "quiz_questions" not in st.session_state:
        st.session_state.quiz_questions = []
    if "quiz_current_index" not in st.session_state:
        st.session_state.quiz_current_index = 0
    if "quiz_score" not in st.session_state:
        st.session_state.quiz_score = 0
    if "quiz_answered" not in st.session_state:
        st.session_state.quiz_answered = False
    if "quiz_feedback" not in st.session_state:
        st.session_state.quiz_feedback = ""
    if "quiz_user_answers" not in st.session_state:
        st.session_state.quiz_user_answers = {}

    if uploaded:
        with st.spinner("Processing lecture PDF..."):
            vectorstore = process_pdf_to_vectorstore(uploaded)

        st.session_state.vectorstore = vectorstore
        st.session_state.pdf_name = uploaded.name

        add_event(
            st.session_state.username,
            "pdf_uploaded",
            topic=uploaded.name,
            
        )

        st.success(f"Loaded {uploaded.name}")
    if "vectorstore" not in st.session_state:
        return

    if st.session_state.quiz_active:
        render_quiz_interface()
        return
    
    for msg in st.session_state.get("pdf_chat", []):
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"], unsafe_allow_html=True)

    st.markdown("<div style='margin-top:0.6rem;'></div>", unsafe_allow_html=True)
    st.markdown("##### Try asking:")
    cols = st.columns(3)
    clicked_prompt = None
    for col, prompt in zip(cols, SUGGESTED_PROMPTS):
        with col:
            if st.button(prompt, use_container_width=True, key=f"suggest_{prompt}_{len(st.session_state.get('pdf_chat', []))}"):
                clicked_prompt = prompt
                
        if clicked_prompt == "Quiz me on this file":
            with st.spinner("Generating quiz questions from your PDF..."):
                questions = generate_quiz_questions(st.session_state.vectorstore, num_questions=5)
                st.session_state.quiz_questions = questions
                st.session_state.quiz_active = True
                st.session_state.quiz_current_index = 0
                st.session_state.quiz_score = 0
                st.session_state.quiz_answered = False
                st.session_state.quiz_feedback = ""
                st.session_state.quiz_user_answers = {}
            st.rerun()
        
    # Handle "Explain the key formula" button
    if clicked_prompt == "Explain the key formula":
        # Use the specialized formula response function
        with st.chat_message("assistant"):
            placeholder = st.empty()
            try:
                # Get formula response (non-streaming to preserve formatting)
                response = get_formula_response(
                    "Explain the key formula from this PDF. Please preserve all mathematical symbols and special characters exactly as they appear.",
                    st.session_state.vectorstore,
                    history=st.session_state.get("pdf_chat", [])
                )
                placeholder.markdown(response, unsafe_allow_html=True)
                
                # Add to chat history
                st.session_state.pdf_chat.append({"role": "assistant", "content": response})
                
                # Log the event
                add_event(
                    st.session_state.username, 
                    "pdf_question", 
                    topic=st.session_state.get("pdf_name"), 
                    payload={"question": "Explain the key formula"}
                )
                
            except Exception as e:
                placeholder.error(f"Error generating formula response: {str(e)}")
        
        st.rerun()
           
    question = st.chat_input("Ask about the lecture...", key="unique_pdf_chat_input") 
     
    if clicked_prompt:
        question = clicked_prompt
        
    if question:
        # Add user message to history
        st.session_state.setdefault("pdf_chat", []).append({"role": "user", "content": question})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(question)
        
        # Initialize answer variable
        answer = ""
        
        # Generate and stream response
        with st.chat_message("assistant"):
            # Create placeholder for streaming response
            placeholder = st.empty()
            full_response = ""
            
            try:
                if "formula" in question.lower() or "equation" in question.lower() or "symbol" in question.lower():
                    # Use specialized formula response
                    response = get_formula_response(
                        question,
                        st.session_state.vectorstore,
                        history=st.session_state.get("pdf_chat", [])
                    )
                    full_response = response
                    answer = response
                    placeholder.markdown(response, unsafe_allow_html=True)
                else:
                # Stream the response - this fills the answer variable
                    for chunk in pdf_answer(
                        question,
                        st.session_state.vectorstore,
                        history=st.session_state.get("pdf_chat", []),
                    ):
                        full_response += chunk
                        answer = full_response  # Store in answer variable
                        # Update placeholder with cursor effect
                        placeholder.markdown(full_response + "▌", unsafe_allow_html=True)
                    
                    # Final response without cursor
                    placeholder.markdown(full_response, unsafe_allow_html=True)
                    
            except Exception as e:
                placeholder.error(f"Error generating response: {str(e)}")
                answer = f"Error: {str(e)}"
                full_response = answer
        
        # Add assistant message to history using the answer variable
        st.session_state.pdf_chat.append({"role": "assistant", "content": answer})
        
        # Log the event
        add_event(
            st.session_state.username, 
            "pdf_question", 
            topic=st.session_state.get("pdf_name"), 
            payload={"question": question}
        )
        
        # Rerun to update the UI
        st.rerun()
    
    st.markdown("</div>", unsafe_allow_html=True)
    
def render_quiz_interface() -> None:
    """Render the quiz interface"""
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.markdown("### 📝 PDF Quiz")
    st.markdown("Answer the questions based on the PDF content. Type your answer and submit!")
    st.markdown("---")
    
    # Check if quiz is complete
    if st.session_state.quiz_current_index >= len(st.session_state.quiz_questions):
        # Quiz complete - show results
        total = len(st.session_state.quiz_questions)
        score = st.session_state.quiz_score
        percentage = (score / total) * 100 if total > 0 else 0
        
        st.markdown(f"""
        <div style='text-align: center; padding: 2rem;'>
            <div style='font-size: 3rem;'>🎉</div>
            <h2>Quiz Complete!</h2>
            <p style='font-size: 1.5rem;'>Score: {score}/{total} ({percentage:.1f}%)</p>
            <div class='progress-track'>
                <div class='progress-fill' style='width: {percentage}%;'></div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Show all questions and answers
        with st.expander("📋 Review All Questions"):
            for i, q in enumerate(st.session_state.quiz_questions):
                user_ans = st.session_state.quiz_user_answers.get(i, "Not answered")
                is_correct = user_ans == q["answer"]  # Simple check
                icon = "✅" if is_correct else "❌"
                st.markdown(f"""
                **Q{i+1}:** {q['question']}
                
                **Your answer:** {user_ans}
                
                **Correct answer:** {q['answer']}
                
                {icon} {'Correct!' if is_correct else 'Incorrect'}
                ---
                """)
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🔄 Retry Quiz", use_container_width=True):
                st.session_state.quiz_active = False
                st.session_state.quiz_questions = []
                st.session_state.quiz_current_index = 0
                st.session_state.quiz_score = 0
                st.session_state.quiz_user_answers = {}
                st.rerun()
        
        with col2:
            if st.button("💬 Back to Chat", use_container_width=True):
                st.session_state.quiz_active = False
                st.session_state.quiz_questions = []
                st.session_state.quiz_current_index = 0
                st.session_state.quiz_score = 0
                st.session_state.quiz_user_answers = {}
                st.rerun()
        
        st.markdown("</div>", unsafe_allow_html=True)
        return
    
    # Display current question
    current = st.session_state.quiz_current_index
    total = len(st.session_state.quiz_questions)
    question_data = st.session_state.quiz_questions[current]
    
    # Show progress
    st.markdown(f"""
    <div style='display: flex; justify-content: space-between; margin-bottom: 1rem;'>
        <span>Question {current + 1} of {total}</span>
        <span>Score: {st.session_state.quiz_score}/{total}</span>
    </div>
    <div class='progress-track'>
        <div class='progress-fill' style='width: {((current) / total) * 100}%;'></div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Display question
    st.markdown(f"""
    <div style='background: rgba(22, 28, 44, 0.5); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(108, 92, 231, 0.3);'>
        <p style='font-weight: 600; font-size: 1.1rem;'>{question_data['question']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Input for answer
    user_answer = st.text_area(
        "Your answer:",
        value=st.session_state.quiz_user_answers.get(current, ""),
        placeholder="Type your answer here...",
        key=f"quiz_answer_{current}",
        height=100
    )
    
    # Submit answer button
    col1, col2 = st.columns([1, 1])
    
    with col1:
        if st.button("✅ Submit Answer", use_container_width=True, type="primary"):
            if user_answer.strip():
                # Check if answer is correct
                is_correct = check_answer(user_answer, question_data["answer"])
                
                # Store user answer
                st.session_state.quiz_user_answers[current] = user_answer
                
                if is_correct:
                    st.session_state.quiz_score += 1
                    st.session_state.quiz_feedback = "✅ Correct! Great job!"
                else:
                    st.session_state.quiz_feedback = f"❌ Not quite. The correct answer is: **{question_data['answer']}**"
                
                st.session_state.quiz_answered = True
                st.rerun()
            else:
                st.warning("Please enter an answer before submitting.")
    
    with col2:
        if st.button("⏭️ Skip Question", use_container_width=True):
            st.session_state.quiz_user_answers[current] = "(Skipped)"
            st.session_state.quiz_feedback = f"The correct answer was: **{question_data['answer']}**"
            st.session_state.quiz_answered = True
            st.rerun()
    
    # Show feedback if answered
    if st.session_state.quiz_answered and st.session_state.quiz_feedback:
        st.markdown("---")
        st.markdown(st.session_state.quiz_feedback, unsafe_allow_html=True)
        
        # Next question button
        if st.button("➡️ Next Question", use_container_width=True):
            st.session_state.quiz_current_index += 1
            st.session_state.quiz_answered = False
            st.session_state.quiz_feedback = ""
            st.rerun()
    
    st.markdown("</div>", unsafe_allow_html=True)

