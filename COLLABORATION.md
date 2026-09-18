# 🤝 دليل العمل الجماعي والدمج الآمن — SHAGHOOF AI Team Collaboration Guide

> **الهدف الذهبي:** كل عضو في الفريق يعمل على **Branch منفصل** تماماً، وعند عمل **Merge** مع كود زملائك، نضمن بنسبة 100% أن **"مفيش حاجة تبوظ"** وأن الفرع الرئيسي (`main`) يظل مستقراً دائماً ويعمل بدون أي أخطاء.

---

## 🏛️ 1. المبادئ الأساسية (Golden Rules)

1. **الفرع الرئيسي (`main`) خط أحمر (Protected Branch):**
   - يُمنع منعاً باتاً عمل `git push origin main` مباشرة.
   - لا يدخل أي كود إلى `main` إلا عبر **Pull Request (PR)** بعد فحصه واختباره تلقائياً.
2. **برانش لكل ميزة أو عضو (Feature Branching):**
   - كل مهمة جديدة يتم فتح Branch جديد لها يبدأ بـ `feature/` أو `bugfix/` (مثال: `feature/student-quiz`, `feature/audio-player`, `bugfix/login-error`).
3. **الفحص الآلي الإجباري (GitHub Actions CI):**
   - تم تفعيل نظام فحص آلي في الـ Repo يقوم تلقائياً باختبار:
     - ✅ بناء الفرونت إند (`npm run build`) والتأكد من عدم وجود أخطاء في TypeScript.
     - ✅ اختبارات الباك إند (`pytest`) والتأكد من سلامة الكود والـ APIs.
   - إذا حدث أي خطأ في كود زميلك، سيمنع GitHub الدمج تلقائياً بـ علامة ❌ حمراء حتى يتم إصلاحه!

---

## 🚀 2. خطوات العمل اليومية (Daily Git Workflow Cheat-Sheet)

### 📌 الخطوة 1: ابدأ دائماً بأحدث نسخة من المشروع
قبل كتابة أي كود جديد، تأكد أنك على فرع `main` وسحبت آخر تعديلات الفريق:
```bash
git checkout main
git pull origin main
```

### 📌 الخطوة 2: أنشئ برانش جديد خاص بك
اختر اسماً واضحاً يعبر عما تقوم ببنائه:
```bash
# مثال: إنشاء برانش لتطوير الواجهة
git checkout -b feature/interactive-dashboard

# أو برانش باسم العضو والمهمة
git checkout -b dev/ahmed-quiz-component
```

### 📌 الخطوة 3: اكتب كودك واختبره محلياً
أثناء عملك، اختبر أن الكود يعمل محلياً:
```bash
# للتأكد من خلو الفرونت إند من الأخطاء:
cd frontend
npm run build

# للتأكد من خلو الباك إند من الأخطاء:
cd ../backend
pytest tests/test_moodle.py
```

### 📌 الخطوة 4: احفظ تعديلاتك بـ Commits واضحة
```bash
git status
git add .
git commit -m "feat(dashboard): add dynamic charts and filter controls"
```

### 📌 الخطوة 5: قبل رفع كودك، ادمج آخر تحديثات `main` محلياً (منع الـ Conflicts)
هذه أهم خطوة تضمن عدم حدوث أي تضارب:
```bash
# 1. اسحب آخر كود من main لبرانشك
git pull origin main
```
- إذا لم يوجد أي تضارب (وهو الغالب)، سيتم الدمج تلقائياً.
- إذا حدثت تعارضات (Conflict)، اقرأ قسم "حل الـ Conflicts" بالأسفل.

### 📌 الخطوة 6: ارفع البرانش الخاص بك على GitHub
```bash
git push origin feature/your-branch-name
```

### 📌 الخطوة 7: افتح Pull Request (PR) على GitHub
1. ادخل على صفحة الـ Repo: [YusufAbozeid/SHAGHOOF-AI](https://github.com/YusufAbozeid/SHAGHOOF-AI).
2. ستجد زراً أخضر: **"Compare & pull request"**، اضغط عليه.
3. اكتب عنواناً ووصفاً مختصراً لما أضفته.
4. انتظر حتى ينتهي الفحص الآلي (GitHub Actions CI):
   - 🟢 `Frontend Build & Typecheck` passed
   - 🟢 `Backend Tests & Validation` passed
5. بعد ظهور العلامات الخضراء وموافقة الفريق، اضغط: **"Squash and merge"**.
6. احذف البرانش من GitHub بعد الدمج للحفاظ على نظافة المشروع: **"Delete branch"**.

---

## ⚡ 3. كيف تتصرف إذا حدث Merge Conflict؟

الـ Conflict يحدث فقط إذا قمت أنت وزميلك بتعديل **نفس السطر في نفس الملف في نفس الوقت**. 
حلّه بسيط جداً:

1. عند تشغيل `git pull origin main` وظهور رسالة `CONFLICT (content)`:
2. افتح ملفات التضارب في **VS Code**.
3. ستجد خيارات ملونة أعلى السطور المتضاربة:
   - **Accept Current Change:** للإبقاء على تعديلك أنت.
   - **Accept Incoming Change:** لقبول تعديل زميلك من `main`.
   - **Accept Both Changes:** للإبقاء على التعديلين معاً (الخيار الأكثر شيوعاً).
4. بعد مراجعة الأسطر وحفظ الملف:
```bash
git add .
git commit -m "fix(merge): resolve merge conflicts with main"
git push origin feature/your-branch-name
```

---

## 🔒 4. إعداد حماية البرانش على GitHub (Branch Protection)

يقوم صاحب الـ Repository (يوسف) بتفعيل هذه الإعدادات مرة واحدة لحماية المشروع:
1. ادخل على **Settings** في صفحة المشروع على GitHub.
2. من القائمة الجانبية اضغط على **Branches**.
3. اضغط على **Add branch protection rule**.
4. في خانة **Branch name pattern** اكتب: `main`.
5. فعّل الخيارات التالية:
   - ✅ **Require a pull request before merging** (يمنع أي Push مباشر لـ main).
   - ✅ **Require approvals**: اختر `1` (يتطلب موافقة عضو من الفريق قبل الدمج).
   - ✅ **Require status checks to pass before merging**:
     - ابحث في القائمة عن `Frontend Build & Typecheck` و `Backend Tests & Validation` وفعّلهما.
   - ✅ **Require branches to be up to date before merging**.
   - ✅ **Do not allow bypassing the above settings**.
6. اضغط **Save changes** بالأسفل.

---

## 👥 5. كيفية إضافة أصحابك كـ Collaborators

1. ادخل على **Settings** في صفحة الـ Repo على GitHub.
2. من القائمة الجانبية اضغط على **Collaborators**.
3. اضغط على زر **Add people**.
4. اكتب الـ Username أو الإيميل الخاص بزميلك على GitHub.
5. سيصله إشعار ودعوة عبر الإيميل، بمجرد قبوله يستطيع عمل Clone و Push للـ Branches الخاصة به.

---

## 📦 6. تهيئة بيئة العمل للزميل الجديد (Quick Setup for New Collaborator)

عندما ينضم زميل جديد للفريق، ينفذ هذه الأوامر فقط للبدء:
```bash
# 1. عمل Clone للمشروع
git clone https://github.com/YusufAbozeid/SHAGHOOF-AI.git
cd SHAGHOOF-AI

# 2. تثبيت مكتبات الفرونت إند
cd frontend
npm install
npm run dev

# 3. في نافذة تيرمينال أخرى، تثبيت مكتبات الباك إند
cd ../backend
pip install -r requirements.txt
python -m uvicorn server:app --reload
```

---
🎯 **باتباع هذه الخطوات، سيتمكن كل فرد في الفريق من العمل بحرية كاملة على برانشه الخاص دون أدنى خوف من تداخل الأكواد أو تعطل النظام!**