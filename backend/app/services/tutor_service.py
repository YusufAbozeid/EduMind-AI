from app.schemas.tutor import ChatRequest, ChatResponse

class TutorService:
    @staticmethod
    def generate_tutor_response(req: ChatRequest) -> ChatResponse:
        text = req.message.lower()
        is_ar = req.language == "ar"
        is_egyptian = req.egyptian_dialect
        level = req.feynman_level

        if not is_ar:
          # Strict English Mode
          if level == "intuitive" or "eli5" in text or "simplify" in text:
            reply = "Think of a Neural Network like a football team: Inputs are the players, the Hidden Layer is the tactical strategy, and Output is scoring a goal! If they miss, the coach (Backpropagation) adjusts weights to fix errors instantly."
          elif level == "deep" or "math" in text or "feynman" in text:
            reply = "The gradient update relies on partial derivatives: ∂E/∂w = (y - y_hat) * x. We update weight matrix by gradient descent: w_new = w_old - α * (∂E/∂w)."
          elif "hint" in text:
            reply = "Proactive Hint 💡: Think of Backpropagation as a mirror reflecting the exact reverse path of the Forward Pass!"
          else:
            reply = f"Hello {req.username}! Based on your chosen {req.modality.upper()} learning style, this step is essential for tuning weight parameters and minimizing training loss."
        else:
          # Arabic Mode (Egyptian Dialect vs Standard Academic)
          if is_egyptian:
            if level == "intuitive" or "eli5" in text or "مبسط" in text:
              reply = "بص يا سيدي، تخيل الشبكة العصبية دي زي فريق كورة: المدخلات هما اللعيبة، والطبقة الخفية هي التكتيك، والمخرجات هي الجول! ولو الفريق غلط، المدرب (Backpropagation) بيتصرف ويعدل الخطة بسرعة عشان يظبط الماتش الجاي!"
            elif level == "deep" or "math" in text or "فاينمان" in text:
              reply = "بص يا بطل، المعادلة هنا بتعتمد على المشتقات الجزئية عشان تظبط الوزن: ∂E/∂w = (y - y_hat) * x. وبنحدث الوزن بالطريقة دي: w_new = w_old - α * (∂E/∂w). بكده الأخطاء بتقل خالص!"
            elif "تلميح" in text or "hint" in text:
              reply = "تلميح سريع 💡: فكر في التمرير الخلفي كأنه مرآة بتعكس اتجاه التمرير الأمامي بالضبط!"
            else:
              reply = f"منور يا {req.username}! بناءً على نمطك البصري ({req.modality.upper()})، الخطوة دي مهمة جداً عشان تظبط أوزان الشبكة العصبية وتمنع أي أخطاء تتكرر تاني."
          else:
            if level == "intuitive" or "eli5" in text or "مبسط" in text:
              reply = "تخيل الشبكة العصبية كفريق كرة قدم: المدخلات هي اللاعبين، والطبقة الخفية هي خط التكتيك، والمخرجات هي الهدف! إذا أخطأ الفريق، يقوم المدرب (Backpropagation) بتصحيح الأخطاء بسرعة."
            elif level == "deep" or "math" in text or "فاينمان" in text:
              reply = "معادلة التحديث المستهدفة تعتمد على المشتقات الجزئية: ∂E/∂w = (y - y_hat) * x. نحدث الوزن بالصيغة: w_new = w_old - α * (∂E/∂w)."
            elif "تلميح" in text or "hint" in text:
              reply = "تلميح 💡: فكر في اتجاه التمرير الخلفي كأنه مرآة تعكس اتجاه التمرير الأمامي تماماً!"
            else:
              reply = f"أهلاً بك يا {req.username}! بناءً على النمط المحدد ({req.modality.upper()})، تعتبر هذه الخطوة حاسمة لتقليل نسبة الخطأ في النمذجة العصبية."

        return ChatResponse(
            sender="bot",
            text=reply,
            feynman_level=level or "academic",
            modality=req.modality or "visual",
            language=req.language or "ar",
            status="success"
        )
