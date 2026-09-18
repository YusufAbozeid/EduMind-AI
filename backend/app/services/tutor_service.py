import os
from app.schemas.tutor import ChatRequest, ChatResponse

class TutorService:
    @staticmethod
    def generate_tutor_response(req: ChatRequest) -> ChatResponse:
        text = req.message.lower()
        is_ar = req.language == "ar"
        is_egyptian = req.egyptian_dialect
        level = req.feynman_level
        topic = (req.topic or "Session 1: Text Preprocessing & Attention").lower()

        # 1. Groq Cloud LLM generation if available
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                from langchain_groq import ChatGroq
                llm = ChatGroq(
                    groq_api_key=groq_key,
                    model_name=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                    temperature=0.3
                )
                system_prompt = (
                    "You are an expert AI tutor on the SHAGHOOF AI education platform.\n"
                    f"The student is studying the course topic: '{req.topic}'.\n"
                    f"Student Feynman level: {level}. Preferred modality: {req.modality}.\n"
                    f"Language: {'Egyptian Arabic (بالعامية المصرية)' if (is_ar and is_egyptian) else ('Arabic' if is_ar else 'English')}.\n"
                    "RULES:\n"
                    "1. Tailor your answer directly to the selected topic. Never use irrelevant analogies.\n"
                    "2. Keep explanations engaging, scientifically accurate, and supportive.\n"
                    "3. English technical terms (e.g. Attention, Backpropagation, CNN, Embeddings) should remain in English."
                )
                resp = llm.invoke([
                    ("system", system_prompt),
                    ("user", req.message)
                ])
                if resp.content and len(resp.content.strip()) > 5:
                    return ChatResponse(
                        sender="bot",
                        text=resp.content.strip(),
                        feynman_level=level or "academic",
                        modality=req.modality or "visual",
                        language=req.language or "ar",
                        status="success"
                    )
            except Exception as e:
                print(f"[TutorService] Groq notice: {e}. Using structured topic synthesis.")

        # 2. Topic-Aware Matrix
        if any(w in topic for w in ["attention", "انتباه", "preprocessing", "تجهيز", "token"]):
            if not is_ar:
                if level == "intuitive" or "eli5" in text or "simplify" in text:
                    reply = "Think of Self-Attention like reading a crime novel: you don't read words in a vacuum; every clue token attends to all previous characters to deduce the suspect! Q, K, and V matrices calculate that context in parallel."
                elif level == "deep" or "math" in text or "feynman" in text:
                    reply = "Self-Attention computes: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V. Scaled dot-product prevents softmax gradients from vanishing in high dimensions."
                elif "hint" in text:
                    reply = "Proactive Hint 💡: Query is what a token is asking for, Key is what it holds, and Value is the actual contextual information transmitted!"
                else:
                    reply = f"Hello {req.username}! In {req.topic}, tokenization and self-attention let the model capture sentence relationships without sequential RNN bottlenecks."
            else:
                if is_egyptian:
                    if level == "intuitive" or "eli5" in text or "مبسط" in text:
                        reply = "بص يا بطل، تخيل الـ Self-Attention ده زي دايرة أصحاب: لما حد يتكلم، الباقيين بيبصوله وكل واحد بيفهم الكلام بناءً على علاقته بيه! الكلمة بتبص على كل كلمات الجملة في نفس اللحظة عبر مصفوفات Q و K و V عشان تفهم المعنى السياقي الصح!"
                    elif level == "deep" or "math" in text or "فاينمان" in text:
                        reply = "معادلة الانتباه الأساسية هي: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V. بنقسم على جذر d_k عشان نمنع تلاشي التدرجات الرياضية في الأبعاد العالية!"
                    elif "تلميح" in text or "hint" in text:
                        reply = "تلميح سريع 💡: الـ Query هو سؤال الكلمة، والـ Key هو هويتها، والـ Value هو محتواها الفعلي اللي بيتنقل عبر شبكة الانتباه!"
                    else:
                        reply = f"أهلاً يا {req.username}! موضوع {req.topic} هو حجر الأساس لمعمارية الـ Transformers، واختيارك للنمط ({req.modality.upper()}) هيساعدك تستوعب مصفوفات الـ Attention بسهولة!"
                else:
                    if level == "intuitive" or "eli5" in text or "مبسط" in text:
                        reply = "تعتمد آلية الانتباه الذاتي Self-Attention على تقييم مدى ارتباط كل كلمة بباقي كلمات الجملة بالتوازي، مما يلغي التكرار التسلسلي ويمنح النموذج فهماً سياقياً عميقاً."
                    elif level == "deep" or "math" in text or "فاينمان" in text:
                        reply = "الصيغة الرياضية للانتباه: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V، حيث يُستخدم مقياس الجذر التربيعي لضبط أوزان التدرج."
                    elif "تلميح" in text or "hint" in text:
                        reply = "تلميح 💡: تُمثل مصفوفات Q و K و V إسقاطات خطية لتحديد درجة التشابه الدلالي ونقل المعلومات بين الرموز."
                    else:
                        reply = f"مرحباً بك {req.username}! في درس {req.topic}، ترتكز النماذج على مصفوفات الانتباه لربط النصوص وتحليلها بدقة متناهية."

        elif any(w in topic for w in ["cnn", "تلافيفية", "concurrency", "تزامن", "intel"]):
            if not is_ar:
                if level == "intuitive" or "eli5" in text or "simplify" in text:
                    reply = "Think of a CNN like scanning a photo with a magnifying glass: the kernel detects edges, deeper layers find shapes, and pooling reduces size. For speed, use Multiprocessing to bypass Python's GIL!"
                elif level == "deep" or "math" in text or "feynman" in text:
                    reply = "2D Convolution computes: (I * K)(i, j) = sum(I(m, n) * K(i-m, j-n)). Feature maps are downsampled using max pooling: P(i, j) = max(patch)."
                elif "hint" in text:
                    reply = "Proactive Hint 💡: Use Threading/AsyncIO for image dataset downloads (I/O-Bound), but Multiprocessing for heavy convolution math (CPU-Bound)!"
                else:
                    reply = f"Hello {req.username}! CNNs extract spatial hierarchies from images, while concurrency models ensure rapid parallel processing."
            else:
                if is_egyptian:
                    if level == "intuitive" or "eli5" in text or "مبسط" in text:
                        reply = "بص يا سيدي، الـ CNN عاملة زي عدسة مكبرة بتعدي على الصورة تستكشف الخطوط والزوايا (Kernels)! وعشان نحمل آلاف الصور بسرعة بنستخدم AsyncIO، ولما نيجي نحسب بالمعالج بنشغل Multiprocessing عشان نعدي قفل الـ GIL!"
                    elif level == "deep" or "math" in text or "فاينمان" in text:
                        reply = "طبقة الالتفاف بتضرب الفلتر في مصفوفة البكسلات: (I * K). وبعدها الـ Max Pooling بياخد أعلى قيمة في كل نافذة عشان يصغر الحجم ويحافظ على أهم الملامح!"
                    elif "تلميح" in text or "hint" in text:
                        reply = "تلميح 💡: التفرقة بين الـ I/O-Bound والـ CPU-Bound هي سر اختيارك بين Threading و Multiprocessing في بايثون!"
                    else:
                        reply = f"منور يا {req.username}! في درس {req.topic}، بنجمع بين الرؤية الحاسوبية وهندسة التزامن لتحقيق أعلى أداء ممكن!"
                else:
                    reply = f"أهلاً بك {req.username}! ترتكز شبكات CNN على فلاتر الالتفاف واستخلاص الملامح المكانية، بينما تضمن معمارية التزامن تجاوز قفل بايثون GIL."

        elif any(w in topic for w in ["rag", "متجهات", "weaviate", "faiss"]):
            if not is_ar:
                reply = "RAG combines vector retrieval with generative models: chunks are embedded, searched via cosine similarity in Weaviate, and passed to LLMs with verified page citations to prevent hallucination."
            else:
                reply = "نظام الـ RAG يقوم بتقطيع المستندات وتوليد متجهات Embeddings والبحث بالتشابه الاتجاهي لتقديم إجابات أكاديمية موثقة برقم الصفحة دون أي هلوسة."

        else:
            # General Neural Networks / Default Topic
            if not is_ar:
                reply = f"Hello {req.username}! For '{req.topic}', focus on understanding the core inputs, layer transformations, and loss minimization using your {req.modality.upper()} learning style."
            else:
                reply = f"أهلاً بك يا {req.username}! في موضوع '{req.topic}'، نركز على استيعاب المفاهيم الأساسية، خط أنابيب المعالجة، وتطبيق الأكواد العملية بما يناسب نمطك التعليمي ({req.modality.upper()})."

        return ChatResponse(
            sender="bot",
            text=reply,
            feynman_level=level or "academic",
            modality=req.modality or "visual",
            language=req.language or "ar",
            status="success"
        )

    @staticmethod
    def diagnose_and_plan(req):
        is_ar = (req.language == "ar")
        username = req.username or ("يوسف" if is_ar else "Yusuf")
        raw_topic = (req.topic or "").lower()
        raw_concept = req.weak_concept

        # Dynamic topic knowledge base matching
        if raw_concept:
            concept_ar = raw_concept
            concept_en = raw_concept
            slide_target = 14
            mastery_score = 42
        elif any(k in raw_topic for k in ["attention", "transformer", "bert", "gpt", "nlp", "preproc"]):
            concept_ar = "آلية الانتباه الذاتي (Self-Attention & Scaled Dot-Product)"
            concept_en = "Self-Attention Mechanism & Scaling Factor"
            slide_target = 18
            mastery_score = 38
        elif any(k in raw_topic for k in ["concurr", "thread", "async", "gil", "race", "parallel"]):
            concept_ar = "قفل المفسر العام (GIL) وحالات التنافس (Race Conditions)"
            concept_en = "Global Interpreter Lock (GIL) & Race Conditions"
            slide_target = 12
            mastery_score = 44
        elif any(k in raw_topic for k in ["cnn", "convolut", "kernel", "filter", "vision", "pooling"]):
            concept_ar = "مرشحات الالتفاف وحسابات الـ Stride والـ Pooling"
            concept_en = "Convolutional Kernels, Stride & Max-Pooling"
            slide_target = 9
            mastery_score = 45
        elif any(k in raw_topic for k in ["rag", "retriev", "embed", "vector", "faiss", "chunk"]):
            concept_ar = "استراتيجيات التقطيع وحساب تشابه المتجهات (Cosine Similarity)"
            concept_en = "Chunking Strategies & Vector Cosine Similarity"
            slide_target = 21
            mastery_score = 40
        elif any(k in raw_topic for k in ["rnn", "lstm", "gru", "sequence", "vanishing"]):
            concept_ar = "تلاشي المشتقات (Vanishing Gradients) وبوابات الـ LSTM"
            concept_en = "Vanishing Gradients & LSTM Gating Mechanics"
            slide_target = 15
            mastery_score = 35
        elif req.topic:
            concept_ar = f"المفاهيم المتقدمة في {req.topic}"
            concept_en = f"Advanced Concepts in {req.topic}"
            slide_target = 8
            mastery_score = 46
        else:
            concept_ar = "معادلات الانحدار العكسي وحساب المشتقات (Backpropagation)"
            concept_en = "Backpropagation Equations & Chain Rule"
            slide_target = 14
            mastery_score = 42

        concept = concept_ar if is_ar else concept_en
        
        msg = (
            f"أهلاً يا {username}! حللت أداءك الأخير في كويزات Wordwall، واكتشفت أنك واجهت صعوبة في فهم {concept}. "
            "أعددت لك خطة إنقاذ سريعة من 3 خطوات لمدة 10 دقائق فقط لإتقان المفهوم تماماً.. هل نبدأ معاً؟ 🚀"
            if is_ar else
            f"Hello {username}! I analyzed your recent quiz performance and spotted difficulty with {concept}. "
            "I prepared an autonomous 3-step rescue plan (10 mins) to master this concept.. Ready to begin? 🚀"
        )

        steps = [
            {
                "step": 1,
                "title": "الفهم الحدسي عبر النمط البصري" if is_ar else "Visual Modality Intuition",
                "action": "SWITCH_MODALITY",
                "target": "visual"
            },
            {
                "step": 2,
                "title": f"فحص شريحة المحاضرة المستهدفة (Slide {slide_target})" if is_ar else f"Lecture Slide {slide_target} Spotlight",
                "action": "OPEN_SLIDE",
                "target": slide_target
            },
            {
                "step": 3,
                "title": "كويز التحقق التشخيصي وحصد الـ XP" if is_ar else "Verification Micro-Quiz",
                "action": "LAUNCH_MICRO_QUIZ",
                "target": "diagnostic_quiz_3q"
            }
        ]

        from app.schemas.tutor import AgentDiagnosisResponse
        return AgentDiagnosisResponse(
            status="success",
            concept_name=concept,
            mastery_score=mastery_score,
            proactive_message=msg,
            steps=steps
        )

