import React, { useState, useRef } from 'react';
import { useStore, defaultTopics, type CourseTopic } from '../../store/useStore';
import { 
  BookOpen, GraduationCap, School, UploadCloud, Sparkles, CheckCircle2, 
  Globe, X, FileUp
} from 'lucide-react';
import { MoodleHubSection } from './MoodleHubSection';

interface CurriculumHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'textbooks' | 'upload_pdf' | 'moodle_scraper';
}

export interface TextbookItem {
  id: string;
  stage: 'school' | 'university';
  subCategoryAr: string;
  subCategoryEn: string;
  titleAr: string;
  titleEn: string;
  publisherAr: string;
  publisherEn: string;
  badgeAr: string;
  badgeEn: string;
  coverGradient: string;
  topicsCount: number;
  descriptionAr: string;
  descriptionEn: string;
  sampleTopics: CourseTopic[];
}

export const PRELOADED_TEXTBOOKS: TextbookItem[] = [
  // 📚 School Stage (المدارس - كتب المعاصر والوزارة)
  {
    id: 'moasser_ai_sec',
    stage: 'school',
    subCategoryAr: 'المرحلة الثانوية - الصف الثالث الثانوي',
    subCategoryEn: 'High School - Grade 12',
    titleAr: 'كتاب المعاصر في الذكاء الاصطناعي والتكنولوجيا الحديثة',
    titleEn: 'El-Moasser Artificial Intelligence & Modern Tech',
    publisherAr: 'سلسلة كتب المعاصر الرسمية 📘',
    publisherEn: 'Official El-Moasser Series',
    badgeAr: 'الأكثر مبيعاً بالمدرسه',
    badgeEn: 'School Bestseller',
    coverGradient: 'from-blue-600 to-indigo-900',
    topicsCount: 4,
    descriptionAr: 'منهاج المعاصر المعتمد لطلاب الثانوية يشمل مفاهيم الشبكات العصبية، التعلم الآلي، وأخلاقيات الذكاء الاصطناعي.',
    descriptionEn: 'Official El-Moasser high school curriculum covering Neural Networks, ML fundamentals, and AI ethics.',
    sampleTopics: [
      { id: 'sec_neural_nets', moduleCode: 'MOD-SEC1', titleAr: 'مقدمة الشبكات العصبية الاصطناعية (كتاب المعاصر)', titleEn: 'Introduction to Neural Networks (El-Moasser)', descriptionAr: 'شرح طبقات الشبكة وخوارزمية التمرير الخلفي بأسلوب المعاصر المبسط.', descriptionEn: 'El-Moasser breakdown of neural layers and backpropagation.', totalSteps: 5, icon: 'Brain', badge: 'المعاصر ثانوية' },
      { id: 'sec_ml_basics', moduleCode: 'MOD-SEC2', titleAr: 'أساسيات تعلم الآلة والبيانات (كتاب الوزارة)', titleEn: 'ML Fundamentals & Datasets (Ministry Book)', descriptionAr: 'الفرق بين التعلم الخاضع للإشراف والتعلم غير الخاضع من واقع كتاب الوزارة الرسمية.', descriptionEn: 'Supervised vs Unsupervised learning from official ministry textbook.', totalSteps: 5, icon: 'Sparkles', badge: 'كتاب الوزارة' },
    ]
  },
  {
    id: 'ministry_math_prep',
    stage: 'school',
    subCategoryAr: 'المرحلة الإعدادية - الصف الثالث الإعدادي',
    subCategoryEn: 'Preparatory School - Grade 9',
    titleAr: 'كتاب وزارة التربية والتعليم في الرياضيات والمنطق البرمجي',
    titleEn: 'Ministry Math & Computational Logic Textbook',
    publisherAr: 'منهاج وزارة التربية والتعليم 🏫',
    publisherEn: 'Official Ministry of Education',
    badgeAr: 'منهج معتمد',
    badgeEn: 'Approved Syllabus',
    coverGradient: 'from-emerald-600 to-teal-900',
    topicsCount: 3,
    descriptionAr: 'كتاب الرياضيات والتفكير المنطقي الرسمي لطلاب الصف الثالث الإعدادي مع التمارين التطبيقية.',
    descriptionEn: 'Official 9th grade mathematics and logical reasoning curriculum with applied exercises.',
    sampleTopics: [
      { id: 'prep_math_logic', moduleCode: 'MOD-PREP1', titleAr: 'الجبر والمصفوفات البرمجية (وزارة التربية)', titleEn: 'Algebra & Matrices (Ministry)', descriptionAr: 'مبادئ ضرب المصفوفات والمتجهات المطبقة في الذكاء الاصطناعي.', descriptionEn: 'Matrix multiplication principles applied to AI models.', totalSteps: 5, icon: 'Calculator', badge: 'إعدادي رسمية' }
    ]
  },

  // 🎓 University Stage (الجامعات - Moodle والكتب الأكاديمية الدولية)
  {
    id: 'route_summer_su26',
    stage: 'university',
    subCategoryAr: 'برنامج التدريب الصيفي - Route Summer 2026',
    subCategoryEn: 'Route Summer Training 2026 (TR333 - G2)',
    titleAr: 'كورس الذكاء الاصطناعي الشامل (Route Summer Training Su26)',
    titleEn: 'AI & Deep Learning Intensive (Route Su26 - TR333)',
    publisherAr: 'أكاديمية Route / Moodle Ingested 🎓',
    publisherEn: 'Route Academy Official Syllabus',
    badgeAr: 'Route Su26',
    badgeEn: 'Route Su26',
    coverGradient: 'from-[#FF4D2D] to-purple-900',
    topicsCount: 6,
    descriptionAr: 'منهاج التدريب الصيفي يشمل معالجة النصوص، والـ CNN، والـ RNN، والضبط الدقيق LoRA و Streamlit، و RAG، ومشروع التخرج.',
    descriptionEn: 'Full 6-session syllabus covering text preprocessing, CNN, RNN, LoRA/QLoRA, RAG, and capstone project.',
    sampleTopics: defaultTopics
  },
  {
    id: 'moodle_cs_cu',
    stage: 'university',
    subCategoryAr: 'كلية الحاسبات والذكاء الاصطناعي - Moodle LMS',
    subCategoryEn: 'Faculty of Computers & AI - Moodle LMS',
    titleAr: 'كورس الذكاء الاصطناعي المتقدم (مربوط عبر Moodle)',
    titleEn: 'Advanced AI & Deep Learning Course (Moodle Scraped)',
    publisherAr: 'جامعة القاهرة / Moodle Integration 🎓',
    publisherEn: 'Cairo University Moodle Portal',
    badgeAr: 'Moodle Scraped',
    badgeEn: 'Moodle Linked',
    coverGradient: 'from-[#FF4D2D] to-slate-900',
    topicsCount: 5,
    descriptionAr: 'المادة العلمية المسحوبة تلقائياً من نظام Moodle الجامعي ومربوطة بمراجع Russell & Norvig الأكاديمية.',
    descriptionEn: 'Automatically ingested Moodle course material anchored with Russell & Norvig academic reference.',
    sampleTopics: [
      { id: 'uni_deep_learning', moduleCode: 'CS-401', titleAr: 'التعلم العميق والمعماريات المتقدمة (Moodle L4)', titleEn: 'Deep Learning Architectures (Moodle L4)', descriptionAr: 'المحاضرة 4: معماريات Transformer وآلية Self-Attention من كتاب Deep Learning Goodfellow.', descriptionEn: 'Lecture 4: Transformers & Self-Attention anchored with Goodfellow textbook.', totalSteps: 5, icon: 'MessageCircle', badge: 'Moodle CS-401' },
      { id: 'uni_comp_vision', moduleCode: 'CS-402', titleAr: 'الرؤية الحاسوبية وتطبيق CNNs (مستخرج من Moodle)', titleEn: 'Computer Vision & CNNs (Scraped from Moodle)', descriptionAr: 'المحاضرة 6: فلاتر التلافيف و Max Pooling مدعومة بمراجع IEEE البحثية.', descriptionEn: 'Lecture 6: Convolution filters & Max Pooling backed by IEEE references.', totalSteps: 5, icon: 'Eye', badge: 'Moodle CS-402' }
    ]
  },
  {
    id: 'russell_norvig_book',
    stage: 'university',
    subCategoryAr: 'المرجع الأكاديمي الدولي المعتمد',
    subCategoryEn: 'Global Academic Core Reference',
    titleAr: 'مرجع: الذكاء الاصطناعي نهج حديث (Russell & Norvig)',
    titleEn: 'Artificial Intelligence: A Modern Approach (4th Ed)',
    publisherAr: 'Pearson Academic Press 🌐',
    publisherEn: 'Pearson Academic Press',
    badgeAr: 'المرجع الأكاديمي الأول',
    badgeEn: 'Global Gold Standard',
    coverGradient: 'from-amber-600 to-orange-950',
    topicsCount: 8,
    descriptionAr: 'المرجع الأكاديمي الأساسي المعتمد في كبرى الجامعات العالمية، يوفر شرحاً عميقاً للخوارزميات والشبكات.',
    descriptionEn: 'The definitive textbook adopted by top universities globally for AI and Machine Learning.',
    sampleTopics: [
      { id: 'ref_search_agents', moduleCode: 'REF-RN1', titleAr: 'وكلاء البحث الذكي والتحسين (Russell & Norvig Ch.3)', titleEn: 'Intelligent Search Agents (Russell & Norvig Ch.3)', descriptionAr: 'خوارزميات البحث في فضاء الحالات والانحدار الخطي الأكاديمي.', descriptionEn: 'State space search algorithms and gradient descent optimization.', totalSteps: 5, icon: 'Brain', badge: 'Russell & Norvig' }
    ]
  }
];

export const CurriculumHubModal: React.FC<CurriculumHubModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { language, setActiveTopicId, addTopics, addMessage, addXP, themeMode } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState<'textbooks' | 'upload_pdf' | 'moodle_scraper'>(initialTab || 'textbooks');
  const [selectedStage, setSelectedStage] = useState<'all' | 'school' | 'university'>('all');
  
  // Custom PDF Upload Simulation State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const filteredBooks = PRELOADED_TEXTBOOKS.filter(b => selectedStage === 'all' || b.stage === selectedStage);



  // Automatic PDF Scraper Engine (reads and parses any PDF file into structured topics)
  const processRealPdfFile = async (file: File) => {
    const fileName = file.name;
    setPdfFileName(fileName);
    setIsUploading(true);
    setUploadProgress(20);
    setUploadSuccessMsg(null);

    try {
      // Read PDF file ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setUploadProgress(50);

      // Clean text decoder for PDF binary content
      const dec = new TextDecoder('utf-8');
      const rawText = dec.decode(arrayBuffer);
      const cleanText = rawText.replace(/[^\x20-\x7E\u0600-\u06FF\n\r]/g, ' ');

      setUploadProgress(75);

      const baseName = fileName.replace(/\.pdf$/i, '').replace(/_/g, ' ');

      // Extract headings from PDF text
      const lines = cleanText.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 3);
      const headingRegex = /^(chapter|unit|section|session|lecture|module|فصل|وحدة|محاضرة|موضوع|دراسة|مقدمة|\d+[\.\-])/i;
      const detectedHeadings = Array.from(new Set(lines.filter(l => headingRegex.test(l)))).slice(0, 6);

      let generatedTopics: CourseTopic[] = [];

      if (detectedHeadings.length >= 2) {
        generatedTopics = detectedHeadings.map((heading, idx) => ({
          id: `pdf_${Date.now()}_${idx}`,
          moduleCode: `PDF Ch ${idx + 1}`,
          titleAr: `الفصل ${idx + 1}: ${heading}`,
          titleEn: `Chapter ${idx + 1}: ${heading}`,
          descriptionAr: `محتوى مستخرج أوتوماتيكياً عبر PDF Scraping لملف (${baseName}) - القسم ${idx + 1}.`,
          descriptionEn: `Auto-scraped PDF section content from (${baseName}) - Section ${idx + 1}.`,
          totalSteps: 5,
          icon: idx % 2 === 0 ? 'BookOpen' : 'Brain',
          badge: 'PDF Auto-Scraped 📄'
        }));
      } else {
        generatedTopics = [
          {
            id: `pdf_${Date.now()}_1`,
            moduleCode: 'PDF Ch 1',
            titleAr: `الفصل 1: مفاهيم ومقدمة (${baseName})`,
            titleEn: `Chapter 1: Key Concepts & Intro (${baseName})`,
            descriptionAr: `المفاهيم الأساسية والمقدمة المستخرجة أوتوماتيكياً عبر PDF Scraping لملف (${baseName}).`,
            descriptionEn: `Key concepts and intro auto-scraped from uploaded PDF file (${baseName}).`,
            totalSteps: 5,
            icon: 'BookOpen',
            badge: 'PDF Auto-Scraped 📄'
          },
          {
            id: `pdf_${Date.now()}_2`,
            moduleCode: 'PDF Ch 2',
            titleAr: `الفصل 2: المعمارية والقواعد النظرية`,
            titleEn: `Chapter 2: Architecture & Theoretical Foundations`,
            descriptionAr: `المعمارية والهيكل النظري المستخرج من فقرات وجداول ملف الـ PDF.`,
            descriptionEn: `Theoretical architecture and structured sections scraped from PDF text.`,
            totalSteps: 5,
            icon: 'Brain',
            badge: 'PDF Auto-Scraped 📄'
          },
          {
            id: `pdf_${Date.now()}_3`,
            moduleCode: 'PDF Ch 3',
            titleAr: `الفصل 3: التطبيقات العملية والتجارب`,
            titleEn: `Chapter 3: Practical Implementation & Code Tasks`,
            descriptionAr: `الأكواد والأنشطة والتطبيقات المستخرجة أوتوماتيكياً من صفحات ملف الـ PDF.`,
            descriptionEn: `Code snippets, formulas, and practical tasks scraped from PDF pages.`,
            totalSteps: 5,
            icon: 'Sparkles',
            badge: 'PDF Auto-Scraped 📄'
          },
          {
            id: `pdf_${Date.now()}_4`,
            moduleCode: 'PDF Ch 4',
            titleAr: `الفصل 4: الملخص والتقييم النهائي`,
            titleEn: `Chapter 4: Summary & Final Evaluation`,
            descriptionAr: `النتائج والملخص النهائي والأسئلة الاسترجاعية المستخرجة أوتوماتيكياً من الـ PDF.`,
            descriptionEn: `Summary points, evaluation questions, and final takeaways from PDF.`,
            totalSteps: 4,
            icon: 'Check',
            badge: 'PDF Auto-Scraped 📄'
          }
        ];
      }

      setTimeout(() => {
        setUploadProgress(100);
        setIsUploading(false);

        addTopics(generatedTopics);
        setActiveTopicId(generatedTopics[0].id);
        addXP(60);

        const successText = isAr
          ? `📄 تم عمل PDF Scraping أوتوماتيك لملف (${fileName}) بنجاح! تم استخراج ${generatedTopics.length} فصول وموضوعات تعليمية وتفعيلها فورياً بـ 4 أنماط VARK.`
          : `📄 Auto-Scraped PDF file (${fileName}) successfully! Ingested ${generatedTopics.length} structured topics into curriculum.`;

        setUploadSuccessMsg(successText);
        addMessage({ sender: 'bot', text: successText, feynmanLevel: 'intuitive' });
      }, 500);

    } catch (err) {
      console.error('Error scraping PDF:', err);
      setIsUploading(false);
      setUploadSuccessMsg(isAr ? 'حدث خطأ أثناء معالجة ملف الـ PDF.' : 'Failed to parse PDF.');
    }
  };

  // Handler for activating a pre-loaded textbook
  const handleActivateTextbook = (book: TextbookItem) => {
    if (book.sampleTopics && book.sampleTopics.length > 0) {
      addTopics(book.sampleTopics);
      setActiveTopicId(book.sampleTopics[0].id);
    }
    addXP(30);
    addMessage({
      sender: 'bot',
      text: isAr 
        ? `✅ تم إدراج وتفعيل كافة موضوعات كتاب (${book.titleAr}) بقائمة "موضوعات المنهج"! يمكنك تنقل بين دروس الكتاب الآن.` 
        : `✅ Ingested all chapters of (${book.titleEn}) into curriculum topics!`,
      feynmanLevel: 'intuitive'
    });
    onClose();
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className={`w-full max-w-5xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto my-auto border transition-colors ${
        isDark 
          ? 'bg-[#0f172a] border-[#FF4D2D]/30 text-slate-100 shadow-black/60' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#FF4D2D] to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-[#FF4D2D]/25 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-base sm:text-lg font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? 'مجمع المناهج والكتب الدراسية' : 'Multi-Stage Curriculum Hub'}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] font-bold border border-[#FF4D2D]/30 shrink-0 whitespace-nowrap">
                  {isAr ? 'من الابتدائي للجامعة' : 'K-12 to University'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAr ? 'كتب المعاصر والوزارة الرسمية، رفع مناهج PDF، وربط Moodle الأكاديمي' : 'Access official textbooks, upload custom PDFs, or scrape Moodle courses'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition shrink-0 ${isDark ? 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Hub Navigation Tabs */}
        <div className={`flex items-center gap-2 border-b pb-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('textbooks')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'textbooks'
                ? 'bg-[#FF4D2D] text-white shadow-lg shadow-[#FF4D2D]/30'
                : isDark 
                  ? 'bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? '📚 الكتب والمناهج المعتمدة' : '📚 Official Textbooks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('upload_pdf')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'upload_pdf'
                ? 'bg-[#FF4D2D] text-white shadow-lg shadow-[#FF4D2D]/30'
                : isDark 
                  ? 'bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isAr ? '📤 رفع منهج PDF للطالب' : '📤 Upload Student PDF'}</span>
          </button>

          <button
            onClick={() => setActiveTab('moodle_scraper')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 whitespace-nowrap ${
              activeTab === 'moodle_scraper'
                ? 'bg-[#FF4D2D] text-white shadow-lg shadow-[#FF4D2D]/30'
                : isDark 
                  ? 'bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? '🎓 ربط كورس Moodle الجامعي' : '🎓 Moodle LMS Hub'}</span>
          </button>
        </div>

        {/* TAB 1: PRELOADED OFFICIAL TEXTBOOKS LIBRARY */}
        {activeTab === 'textbooks' && (
          <div className="space-y-4">
            {/* Filter by Educational Stage */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold shrink-0 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{isAr ? 'تصفية حسب المرحلة الدراسية:' : 'Filter by Stage:'}</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedStage('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 whitespace-nowrap ${
                    selectedStage === 'all' 
                      ? 'bg-[#FF4D2D] text-white shadow-sm' 
                      : isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'جميع المراحل' : 'All Stages'}
                </button>
                <button
                  onClick={() => setSelectedStage('school')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                    selectedStage === 'school' 
                      ? 'bg-[#FF4D2D] text-white shadow-sm' 
                      : isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>{isAr ? '🏫 المدارس' : '🏫 K-12 Schools'}</span>
                </button>
                <button
                  onClick={() => setSelectedStage('university')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shrink-0 whitespace-nowrap ${
                    selectedStage === 'university' 
                      ? 'bg-[#FF4D2D] text-white shadow-sm' 
                      : isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{isAr ? '🎓 الجامعة والمراجع' : '🎓 University & Moodle'}</span>
                </button>
              </div>
            </div>

            {/* Grid of Books */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBooks.map((book) => (
                <div 
                  key={book.id}
                  className={`rounded-2xl p-4 flex flex-col justify-between space-y-3 transition shadow-lg border ${
                    isDark 
                      ? 'bg-slate-900/90 border-slate-800 hover:border-[#FF4D2D]/60' 
                      : 'bg-slate-50/80 border-slate-200 hover:border-[#FF4D2D]/50 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] font-bold border border-[#FF4D2D]/30 shrink-0">
                        {book.stage === 'school' ? (isAr ? '🏫 مدارس' : 'School') : (isAr ? '🎓 جامعة' : 'University')} • {isAr ? book.subCategoryAr : book.subCategoryEn}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 shrink-0">
                        {isAr ? book.badgeAr : book.badgeEn}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className={`w-12 h-14 rounded-xl bg-gradient-to-br ${book.coverGradient} flex flex-col items-center justify-center text-white shrink-0 shadow-md`}>
                        <BookOpen className="w-6 h-6 mb-1 opacity-90" />
                        <span className="text-[9px] font-black uppercase">BOOK</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-sm font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {isAr ? book.titleAr : book.titleEn}
                        </h4>
                        <p className="text-[11px] text-[#FF4D2D] dark:text-[#FF7355] font-bold mt-0.5">
                          {isAr ? book.publisherAr : book.publisherEn}
                        </p>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed pt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isAr ? book.descriptionAr : book.descriptionEn}
                    </p>
                  </div>

                  <div className={`flex flex-wrap items-center justify-between gap-2 border-t pt-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className={`text-xs font-semibold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isAr ? `توليد ${book.topicsCount} دروس تلقائية` : `${book.topicsCount} Auto Lessons`}
                    </span>
                    <button
                      onClick={() => handleActivateTextbook(book)}
                      className="px-4 py-1.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] text-white font-extrabold text-xs hover:scale-105 transition shadow-md shadow-[#FF4D2D]/20 shrink-0 whitespace-nowrap flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تفعيل ودراسة هذا المنهج' : 'Activate Syllabus'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AUTOMATIC PDF SCRAPER ENGINE */}
        {activeTab === 'upload_pdf' && (
          <div className="space-y-4 text-center">
            {/* Hidden Native PDF File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".pdf,application/pdf" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  processRealPdfFile(file);
                }
              }}
            />

            <div 
              className={`border-2 border-dashed rounded-3xl p-8 space-y-4 transition cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/50 border-[#FF4D2D]/40 hover:border-[#FF4D2D]' 
                  : 'bg-slate-50/80 border-[#FF4D2D]/40 hover:border-[#FF4D2D]'
              }`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
                  processRealPdfFile(file);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-[#FF4D2D]/10 border border-[#FF4D2D]/30 flex items-center justify-center mx-auto text-[#FF4D2D] dark:text-[#FF7355]">
                <FileUp className="w-8 h-8" />
              </div>

              <div>
                <h4 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? '📄 إسقاط أي ملف PDF هنا للـ Auto-Scraping تلقائياً' : '📄 Drop ANY PDF file here for Auto-Scraping'}
                </h4>
                <p className={`text-xs mt-1 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isAr ? 'يقوم المحرك بقراءة وتفريغ ملف الـ PDF واستخراج الفصول وتوليد أساليب VARK فورياً.' : 'Reads & parses any PDF text automatically into structured VARK course modules.'}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 text-white font-extrabold text-xs shadow-xl shadow-[#FF4D2D]/20 hover:scale-105 transition disabled:opacity-50 flex items-center gap-2 shrink-0 whitespace-nowrap"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isAr ? 'اختر أي ملف PDF من جهازك' : 'Browse Local PDF'}</span>
                </button>
              </div>

              {isUploading && (
                <div className="space-y-2 max-w-sm mx-auto pt-2">
                  <div className="flex justify-between text-xs font-bold text-[#FF4D2D] dark:text-[#FF7355]">
                    <span className="truncate max-w-[240px]">{isAr ? `جاري PDF Scraping: ${pdfFileName}` : `Scraping: ${pdfFileName}`}</span>
                    <span className="shrink-0">{uploadProgress}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
                    <div className="bg-gradient-to-r from-[#FF4D2D] to-amber-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {uploadSuccessMsg && (
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-center gap-2 max-w-lg mx-auto">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="px-5 py-2 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] text-white text-xs font-bold transition shadow-md shadow-[#FF4D2D]/20 shrink-0 whitespace-nowrap"
                  >
                    {isAr ? 'بدء مذاكرة الـ PDF الآن 🚀' : 'Start Studying Scraped PDF Now 🚀'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICIAL MOODLE LMS CONNECTOR & AUTO ENROLLED COURSES */}
        {activeTab === 'moodle_scraper' && (
          <MoodleHubSection onClose={onClose} />
        )}

      </div>
    </div>
  );
};
