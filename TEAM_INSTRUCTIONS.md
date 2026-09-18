# 🚀 الدليل الإرشادي لفريق عمل مشروع SHAGHOOF AI
## 📌 دليل العمل على الفروع (Git Branching) والدمج الآمن (Safe Merging)

أهلاً بيك في فريق عمل **SHAGHOOF AI**! 🌟  
الهدف من هذا الدليل هو توضيح كيفية تشغيل المشروع على جهازك، وكيف تعمل على **Branch مستقل** خاص بك، وكيف ترفع شغلك وتعمل له **Merge** مع كود الفريق بأمان تام ومن غير ما أي حاجة تبوظ.

---

## 🛑 القاعدة الذهبية للمشروع (Rule #1)
> **ممنوع نهائياً عمل `git push origin main` مباشرة!**  
> الفرع `main` هو الفرع الرئيسي والنهائي، ومحمي بنظام فحص آلي. أي كود جديد لازم يدخل عبر **Pull Request (PR)** فقط بعد ما نتأكد إنه شغال 100%.

---

## 🛠️ أولاً: تجهيز المشروع على جهازك (مرة واحدة فقط)

### 1. المتطلبات الأساسية:
- **Git** مثبت على جهازك.
- **Node.js** (إصدار 18 أو 20).
- **Python** (إصدار 3.10 أو 3.11 أو 3.12).
- **VS Code** كبيئة تطوير.

### 2. سحب المشروع (Clone):
افتح التيرمينال (Terminal) في الفولدر الذي ترغب بحفظ المشروع فيه:
```bash
git clone https://github.com/YusufAbozeid/SHAGHOOF-AI.git
cd SHAGHOOF-AI
```

### 3. تشغيل الفرونت إند (Frontend):
```bash
cd frontend
npm install
npm run dev
```
👈 سيفتح معك الموقع محلياً على: `http://localhost:5173/`

### 4. تشغيل الباك إند (Backend):
في تيرمينال آخر منفصل:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --reload
```
👈 سيعمل خادم الـ API على: `http://127.0.0.1:8000/`

---

## 🌿 ثانياً: دورة العمل اليومية (خطوة بخطوة)

### 1️⃣ ابدأ دائماً بسحب آخر كود من `main`:
قبل ما تبدأ تكتب سطر كود واحد، تأكد إنك واخد آخر تحديثات عملها الفريق:
```bash
git checkout main
git pull origin main
```

### 2️⃣ أنشئ فرعاً (Branch) خاصاً بك وبالمهمة:
اختر اسماً يعبر عن المهمة التي ستعمل عليها:
```bash
# صيغة التسمية: feature/اسم-المهمة أو dev/اسمك-المهمة
git checkout -b feature/quiz-generator
```

### 3️⃣ اكتب كودك واختبره محلياً:
- اشتغل براحتك وعدّل الملفات المطلوبة.
- **خطوة مهمة جداً:** قبل ما ترفع، تأكد إن الكود مفيهوش أخطاء تشغيلية:
```bash
# للتأكد إن الواجهة بتبني بدون أخطاء TypeScript:
cd frontend
npm run build

# للتأكد إن اختبارات الباك إند سليمة:
cd ../backend
pytest tests/test_moodle.py
```

### 4️⃣ احفظ شغلك (Commit):
```bash
git status
git add .
git commit -m "feat(quiz): add timer and multiple choice question card"
```

### 5️⃣ ادمج آخر تحديثات `main` في برانشك (لمنع الـ Conflicts):
```bash
git pull origin main
```
- إذا كل شيء تمام ومفيش تعارض، كمل للخطوة التالية.
- إذا ظهرت رسالة Conflict، راجع قسم "حل الـ Conflicts" بالأسفل.

### 6️⃣ ارفع البرانش الخاص بك على GitHub:
```bash
git push origin feature/quiz-generator
```

---

## 🔀 ثالثاً: فتح الـ Pull Request والدمج على GitHub

1. افتح صفحة المستودع: [github.com/YusufAbozeid/SHAGHOOF-AI](https://github.com/YusufAbozeid/SHAGHOOF-AI)
2. ستجد إشعاراً باللون الأصفر أعلى الصفحة يخبرك بوجود فرع جديد، اضغط على زر:  
   👉 **"Compare & pull request"**
3. اكتب عنواناً واضحاً ومختصراً لما قمت بإضافته.
4. اضغط على **"Create pull request"**.
5. **انتظر ثوانٍ:** سيبدأ نظام الفحص الآلي (GitHub Actions CI) في فحص كودك تلقائياً:
   - 🟢 `Frontend Build & Typecheck` (تأكيد بناء الفرونت إند)
   - 🟢 `Backend Tests & Validation` (تأكيد اختبارات الباك إند)
6. بعد ظهور العلامات الخضراء، اضغط:
   👉 **"Squash and merge"** ثم **"Confirm"**.
7. بعد اكتمال الدمج، اضغط على زر **"Delete branch"** للحفاظ على نظافة الـ Repo.

---

## ⚠️ رابعاً: كيف تتصرف إذا ظهرت علامة ❌ حمراء في الـ PR؟

إذا ظهرت علامة ❌، هذا يعني أن هناك خطأ في كودك (مثل: نسيان import، أو خطأ في الـ Typescript، أو اختبار لم ينجح).
1. اضغط على **Details** بجانب الفحص الأحمر لتعرف السطر وسبب الخطأ.
2. افتح VS Code على جهازك وعدّل الخطأ.
3. احفظ وارفعه مجدداً بنفس الأوامر العادية:
```bash
git add .
git commit -m "fix: resolve build error"
git push origin feature/quiz-generator
```
👉 سيتم تحديث الـ PR تلقائياً وسيقوم الفحص بإعادة الاختبار حتى تظهر العلامة الخضراء 🟢!

---

## 🤼 خامساً: كيف تحل الـ Merge Conflict إذا حدث؟

الـ Conflict يحدث فقط لو أنت وزميلك عدلتوا **نفس السطر في نفس الملف في نفس الوقت**.
الحل بسيط جداً عبر **VS Code**:
1. لما تعمل `git pull origin main`، سيخبرك بوجود Conflict.
2. افتح الملف المعني في VS Code، ستجد أزراراً صغيرة ملونة أعلى السطور المتعارضة:
   - **Accept Current Change:** للإبقاء على كودك أنت.
   - **Accept Incoming Change:** لقبول كود زميلك القادم من `main`.
   - **Accept Both Changes:** للإبقاء على الكودين معاً (وهذا الأنسب غالباً).
3. بعد اختيار التعديل الصحيح وحفظ الملف:
```bash
git add .
git commit -m "fix(merge): resolve conflict with main"
git push origin feature/quiz-generator
```

---

## 💡 نصائح ذهبية لتجنب المشاكل نهائياً:
1. **قسّموا الشغل:** اتفقوا مع بعض مين ماسك صفحات معينة ومين ماسك ملفات معينة عشان متعدلوش نفس الملفات في نفس اللحظة.
2. **Commit صغير وسريع:** متستناش أسبوع عشان تعمل Commit واحد فيه 50 ملف، ارفع كل ميزة صغيرة أولاً بأول.
3. **ممنوع رفع ملفات الـ Environment:** ملفات `.env` و المفاتيح السرية ممنوع رفعها نهائياً، استخدموا `.env.example`.

---
بالتوفيق يا شباب، ومع بعض هنطلع أقوى مشروع تخرج ينافس ويكسب البطولة بإذن الله! 🏆🔥
