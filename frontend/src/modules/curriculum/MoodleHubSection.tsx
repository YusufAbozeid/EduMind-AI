import React, { useState, useEffect, useRef } from 'react';
import { useStore, type CourseTopic } from '../../store/useStore';
import { 
  MoodleApiService, 
  type MoodleCourse, 
  type MoodleFile, 
  type MoodleStatusResponse,
  type SyncJobResponse,
  type MoodleRagCitation
} from '../../services/moodleApi';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Search, 
  FileText, 
  RefreshCw, 
  LogOut, 
  Sparkles, 
  Send, 
  BookOpen, 
  Layers, 
  Info,
  SlidersHorizontal,
  Check,
  AlertTriangle
} from 'lucide-react';

interface MoodleHubSectionProps {
  onClose?: () => void;
}

export const MoodleHubSection: React.FC<MoodleHubSectionProps> = ({ onClose }) => {
  const { 
    language, 
    themeMode, 
    user, 
    addMessage, 
    addXP, 
    addTopic, 
    addTopics, 
    setActiveTopicId 
  } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';
  const userId = user?.email || 'user_default';

  // Connection State
  const [moodleUrl, setMoodleUrl] = useState<string>('https://moodle.fue.edu.eg');
  const [moodleToken, setMoodleToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<MoodleStatusResponse>({
    is_connected: false,
    enrolled_courses_count: 0,
    activated_courses_count: 0
  });
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Courses & Search
  const [courses, setCourses] = useState<MoodleCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);

  // Active Sync Job State
  const [syncJob, setSyncJob] = useState<SyncJobResponse | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // PDF Explorer State
  const [selectedCourseForFiles, setSelectedCourseForFiles] = useState<MoodleCourse | null>(null);
  const [courseFiles, setCourseFiles] = useState<MoodleFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);

  // AI RAG Query State
  const [ragQuery, setRagQuery] = useState<string>('');
  const [ragCourseFilter, setRagCourseFilter] = useState<number | 'all'>('all');
  const [isQueryingRag, setIsQueryingRag] = useState<boolean>(false);
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [ragCitations, setRagCitations] = useState<MoodleRagCitation[]>([]);
  const [ragError, setRagError] = useState<string | null>(null);

  // Load status on mount
  useEffect(() => {
    checkConnection();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [userId]);

  const checkConnection = async () => {
    try {
      const status = await MoodleApiService.getStatus(userId);
      setConnectionStatus(status);
      if (status.is_connected) {
        fetchCourses();
      }
    } catch {
      // Fallback
    }
  };

  const convertFileToTopic = (file: MoodleFile, courseName: string): CourseTopic => {
    const cleanTitle = file.filename.replace(/\.pdf$/i, '');
    return {
      id: `moodle_pdf_${file.moodle_file_id}`,
      moduleCode: file.section_name ? `PDF • ${file.section_name}` : 'Moodle PDF',
      titleAr: cleanTitle,
      titleEn: cleanTitle,
      descriptionAr: `ملف دراسي تم سحبه ومزامنته من Moodle (${file.page_count || 1} صفحة، ${file.chunk_count || 0} مقطع) من مقرر: ${courseName}`,
      descriptionEn: `Moodle study material (${file.page_count || 1} pages, ${file.chunk_count || 0} chunks) from course: ${courseName}`,
      totalSteps: Math.max(3, Math.min(file.page_count || 5, 8)),
      icon: 'FileText',
      badge: 'Moodle PDF 🎓'
    };
  };

  const handleStudyFileInPlayer = (file: MoodleFile, courseName: string) => {
    const topic = convertFileToTopic(file, courseName);
    addTopic(topic);
    setActiveTopicId(topic.id);
    addXP(25);
    if (onClose) {
      onClose();
    }
  };

  const handleStudyAllFiles = (files: MoodleFile[], courseName: string) => {
    if (!files || files.length === 0) return;
    const newTopics = files.map(f => convertFileToTopic(f, courseName));
    addTopics(newTopics);
    setActiveTopicId(newTopics[0].id);
    addXP(50);
    if (onClose) {
      onClose();
    }
  };

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const list = await MoodleApiService.getCourses(userId);
      setCourses(list);

      // Auto-ingest activated courses' files into curriculum topics
      const activatedCourses = list.filter(c => c.activation_status === 'activated');
      for (const course of activatedCourses) {
        try {
          const files = await MoodleApiService.getCourseFiles(course.moodle_course_id, userId);
          if (files && files.length > 0) {
            const coursePdfs: CourseTopic[] = files.map(f => convertFileToTopic(f, course.course_name));
            addTopics(coursePdfs);
          }
        } catch (e) {
          console.warn('Auto-ingest course files error:', e);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load courses:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!moodleUrl.trim() || !moodleToken.trim()) {
      setConnectionError(isAr ? 'يرجى إدخال رابط المنصة ورمز الخدمة (Token).' : 'Please enter both Moodle URL and Token.');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const res = await MoodleApiService.connect(moodleUrl.trim(), moodleToken.trim(), userId);
      setConnectionStatus({
        is_connected: true,
        connection: {
          moodle_url: res.moodle_url,
          site_name: res.site_name,
          moodle_username: res.moodle_username,
          moodle_fullname: res.moodle_fullname,
          moodle_version: res.moodle_version
        },
        enrolled_courses_count: res.courses_count,
        activated_courses_count: res.courses.filter(c => c.activation_status === 'activated').length
      });
      setCourses(res.courses);
      addXP(50);
    } catch (err: any) {
      setConnectionError(err.message || (isAr ? 'فشل الاتصال بمنصة Moodle. تحقق من الرابط وصلاحيات الرمز.' : 'Connection failed. Check URL and token permissions.'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await MoodleApiService.disconnect(userId);
      setConnectionStatus({
        is_connected: false,
        enrolled_courses_count: 0,
        activated_courses_count: 0
      });
      setCourses([]);
      setSelectedCourseForFiles(null);
      setSyncJob(null);
      setRagAnswer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivateCourse = async (course: MoodleCourse) => {
    try {
      const res = await MoodleApiService.activateCourse(course.moodle_course_id, userId);

      // Optimistic update
      setCourses(prev => prev.map(c => 
        c.moodle_course_id === course.moodle_course_id 
          ? { ...c, activation_status: 'activating', sync_status: 'syncing' }
          : c
      ));

      // Start polling
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        try {
          const job = await MoodleApiService.getSyncJob(res.job_id);
          setSyncJob(job);

          if (job.status === 'completed' || job.status === 'warning' || job.status === 'failed') {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            fetchCourses();
            if (job.status === 'completed' || job.status === 'warning') {
              addXP(100);
              try {
                const files = await MoodleApiService.getCourseFiles(course.moodle_course_id, userId);
                if (files && files.length > 0) {
                  const coursePdfs: CourseTopic[] = files.map(f => convertFileToTopic(f, course.course_name));
                  addTopics(coursePdfs);
                }
              } catch (e) {
                console.warn('Error ingesting course files:', e);
              }
            }
          }
        } catch {
          // ignore transient poll error
        }
      }, 1500);

    } catch (err: any) {
      alert(err.message || 'Failed to trigger activation.');
      fetchCourses();
    }
  };

  const handleOpenFiles = async (course: MoodleCourse) => {
    setSelectedCourseForFiles(course);
    setIsLoadingFiles(true);
    try {
      const files = await MoodleApiService.getCourseFiles(course.moodle_course_id, userId);
      setCourseFiles(files);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleRagSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setIsQueryingRag(true);
    setRagError(null);
    setRagAnswer(null);

    try {
      const courseId = ragCourseFilter === 'all' ? undefined : ragCourseFilter;
      const res = await MoodleApiService.queryRag(ragQuery.trim(), courseId, userId, language);
      setRagAnswer(res.answer);
      setRagCitations(res.citations);
    } catch (err: any) {
      setRagError(err.message || (isAr ? 'حدث خطأ أثناء استرجاع الإجابة من المواد الدراسية.' : 'Error querying knowledge base.'));
    } finally {
      setIsQueryingRag(false);
    }
  };

  const handleSendToTutorChat = () => {
    if (!ragAnswer) return;
    addMessage({
      sender: 'user',
      text: ragQuery
    });
    addMessage({
      sender: 'bot',
      text: ragAnswer,
      feynmanLevel: 'academic'
    });
    alert(isAr ? 'تم تحويل المحادثة إلى نافذة المعلم الذكي الرئيسية!' : 'Transferred to AI Tutor Chat!');
  };

  const filteredCourses = courses.filter(c => 
    c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.course_code && c.course_code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. Moodle Connection State Card */}
      {!connectionStatus.is_connected ? (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/80 shadow-xl' 
            : 'bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20 border-orange-200/60 shadow-md'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF4D2D] to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'ربط منصة Moodle الأكاديمية' : 'Connect Official Moodle LMS'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAr 
                  ? 'اتصال رسمي آمن عبر Moodle Web Services بدون الحاجة لكتابة روابط المقررات يدوياً' 
                  : 'Official secure integration via Moodle Web Services without entering course URLs manually'}
              </p>
            </div>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {isAr ? 'رابط منصة Moodle الجامعية (Instance URL)' : 'Moodle Instance URL'}
              </label>
              <input
                type="url"
                value={moodleUrl}
                onChange={(e) => setMoodleUrl(e.target.value)}
                placeholder="https://moodle.university.edu"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D2D] ${
                  isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {isAr ? 'رمز الوصول لخدمات الويب (Web Service REST Token)' : 'Web Service REST Token'}
                </label>
                <span className="text-[11px] text-[#FF4D2D] flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {isAr ? 'من إعدادات حسابك على Moodle > مفاتيح الأمان' : 'Moodle > Preferences > Security keys'}
                </span>
              </div>
              <input
                type="password"
                value={moodleToken}
                onChange={(e) => setMoodleToken(e.target.value)}
                placeholder={isAr ? 'أدخل رمز الـ Token الصادر من Moodle...' : 'Enter your Moodle REST Token...'}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D2D] ${
                  isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                required
              />
            </div>

            {connectionError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-500 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{connectionError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setMoodleUrl('https://moodle.fue.edu.eg');
                  setMoodleToken('demo_token_su26_secure');
                }}
                className={`text-xs underline transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[#FF4D2D]'
                }`}
              >
                {isAr ? '⚡ استخدام بيانات حساب تجريبي (Demo Mode)' : '⚡ Use Demo Credentials'}
              </button>

              <button
                type="submit"
                disabled={isConnecting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 hover:from-[#e04324] hover:to-orange-600 text-white font-medium text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري التحقق والربط...' : 'Connecting...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'ربط واسترجاع المقررات تلقائياً' : 'Connect & Fetch Courses'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Connected Status Banner */
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-orange-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {connectionStatus.connection?.site_name || 'Moodle LMS'}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {isAr ? 'متصل رسمياً' : 'Connected'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAr ? 'المستخدم:' : 'User:'} <span className="font-semibold">{connectionStatus.connection?.moodle_fullname}</span>
                {connectionStatus.connection?.moodle_version && ` • Ver: ${connectionStatus.connection.moodle_version}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={fetchCourses}
              disabled={isLoadingCourses}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title={isAr ? 'تحديث المقررات' : 'Refresh courses'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs flex items-center gap-1.5 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'قطع الاتصال' : 'Disconnect'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Synchronization Progress Card */}
      {syncJob && syncJob.status === 'running' && (
        <div className={`p-5 rounded-2xl border transition-all animate-pulse ${
          isDark ? 'bg-slate-800/90 border-[#FF4D2D]/40' : 'bg-orange-50/60 border-orange-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#FF4D2D] animate-spin" />
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'جاري تفعيل ومزامنة المقرر...' : 'Activating Course Materials...'}
              </h4>
            </div>
            <span className="text-xs font-bold text-[#FF4D2D]">{syncJob.progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#FF4D2D] to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${syncJob.progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {syncJob.current_file ? (
                  <>
                    <span className="text-[#FF4D2D] font-mono">⏳ {syncJob.current_file}</span>
                  </>
                ) : (
                  <span>{isAr ? 'استخراج النصوص وتوليد التضمينات...' : 'Extracting text & generating embeddings...'}</span>
                )}
              </span>
            </div>
            <span className="font-semibold text-slate-500">
              {syncJob.downloaded_files} / {syncJob.total_files} {isAr ? 'ملف PDF' : 'PDFs'}
            </span>
          </div>
        </div>
      )}

      {/* Sync Job Completed Banner */}
      {syncJob && (syncJob.status === 'completed' || syncJob.status === 'warning') && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          syncJob.status === 'completed' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
        }`}>
          <div className="flex items-center gap-2.5">
            {syncJob.status === 'completed' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <div className="text-xs">
              <span className="font-bold block">
                {syncJob.status === 'completed' 
                  ? (isAr ? '✓ تم تفعيل المقرر بنجاح!' : '✓ Course Activated Successfully!') 
                  : (isAr ? '⚠ تم التفعيل مع بعض التحذيرات' : '⚠ Activated with warnings')}
              </span>
              <span className="opacity-80">
                {syncJob.processed_files} {isAr ? 'ملف تم استخراجه وتضمينه وجاهز للذكاء الاصطناعي' : 'PDFs indexed and ready for AI QA'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSyncJob(null)}
            className="text-xs px-2.5 py-1 rounded-lg border border-current hover:opacity-75 transition-opacity"
          >
            {isAr ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* 3. Enrolled Courses Section */}
      {connectionStatus.is_connected && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <BookOpen className="w-5 h-5 text-[#FF4D2D]" />
                <span>{isAr ? 'مقرراتي المسجلة على Moodle' : 'My Enrolled Courses'}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                  {courses.length}
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAr 
                  ? 'اختر المقرر واضغط "تفعيل المقرر" ليقوم النظام بسحب وتضمين كل ملفات الـ PDF المتاحة تلقائياً' 
                  : 'Select a course and click "Activate Course" to automatically download and vector all PDFs'}
              </p>
            </div>

            {/* Course Search */}
            <div className="relative w-full sm:w-64">
              <Search className={`w-4 h-4 absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث في المقررات...' : 'Search courses...'}
                className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#FF4D2D] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Courses Grid */}
          {isLoadingCourses ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF4D2D]" />
              <span className="text-xs">{isAr ? 'جاري جلب المقررات من Moodle...' : 'Loading courses...'}</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-500">
                {courses.length === 0 
                  ? (isAr ? 'لا توجد مقررات مسجلة لهذا الحساب على Moodle.' : 'No enrolled courses found for this account.')
                  : (isAr ? 'لا توجد مقررات مطابقة للبحث.' : 'No courses matching your search.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const isActivated = course.activation_status === 'activated';
                const isActivating = course.activation_status === 'activating' || (syncJob?.status === 'running' && syncJob.course_id === course.moodle_course_id);

                return (
                  <div 
                    key={course.moodle_course_id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isActivated 
                        ? (isDark ? 'bg-slate-800/90 border-emerald-500/40 shadow-sm' : 'bg-white border-emerald-300 shadow-sm')
                        : (isDark ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-orange-300 shadow-sm')
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                          isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {course.course_code || `ID: ${course.moodle_course_id}`}
                        </span>

                        {isActivated ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            {isAr ? 'مفعل وجاهز' : 'Activated'}
                          </span>
                        ) : isActivating ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {isAr ? 'جاري التفعيل...' : 'Activating...'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-0.5 rounded-full">
                            {isAr ? 'غير مفعل' : 'Not Activated'}
                          </span>
                        )}
                      </div>

                      {/* Course Title */}
                      <h4 className={`text-base font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        🎓 {course.course_name}
                      </h4>

                      {/* Metrics */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#FF4D2D]" />
                          <span>{course.pdf_count || 0} {isAr ? 'ملف PDF' : 'PDFs'}</span>
                        </div>
                        {isActivated && (
                          <div className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{course.total_chunks || 0} {isAr ? 'مقطع متضمن' : 'chunks'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      {isActivated ? (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                const files = await MoodleApiService.getCourseFiles(course.moodle_course_id, userId);
                                if (files && files.length > 0) {
                                  handleStudyAllFiles(files, course.course_name);
                                } else {
                                  handleOpenFiles(course);
                                }
                              } catch {
                                handleOpenFiles(course);
                              }
                            }}
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 hover:from-[#e04324] hover:to-orange-600 text-white flex items-center gap-1.5 shadow-sm shadow-[#FF4D2D]/20 transition-all cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{isAr ? 'دراسة الملفات في المشغل 🚀' : 'Study in Player 🚀'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenFiles(course)}
                            className={`text-xs font-semibold px-2.5 py-2 rounded-xl border transition-colors flex items-center gap-1 ${
                              isDark 
                                ? 'border-slate-700 hover:bg-slate-700 text-slate-300' 
                                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                            title={isAr ? 'عرض قائمة ملفات PDF المستخرجة' : 'View extracted PDF list'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{isAr ? 'الملفات' : 'Files'}</span>
                          </button>

                          <button
                            onClick={() => handleActivateCourse(course)}
                            disabled={isActivating}
                            className="text-xs px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
                            title={isAr ? 'مزامنة التحديثات الجديدة' : 'Sync updates'}
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{isAr ? 'تحديث' : 'Sync'}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleActivateCourse(course)}
                          disabled={isActivating}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 hover:from-[#e04324] hover:to-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isActivating ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{isAr ? '⏳ جاري تفعيل المقرر...' : '⏳ Activating...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تفعيل المقرر (Activate Course)' : 'Activate Course'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. PDF Explorer Modal / Drawer */}
      {selectedCourseForFiles && (
        <div className={`p-5 rounded-2xl border mt-4 transition-all ${
          isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white border-slate-200 shadow-lg'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-4 gap-2 flex-wrap">
            <div>
              <h4 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <FileText className="w-4 h-4 text-[#FF4D2D]" />
                <span>{selectedCourseForFiles.course_name}</span>
              </h4>
              <span className="text-xs text-slate-400">
                {courseFiles.length} {isAr ? 'ملفات ومراجع مستخرجة' : 'synced documents'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {courseFiles.length > 0 && (
                <button
                  onClick={() => handleStudyAllFiles(courseFiles, selectedCourseForFiles.course_name)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 hover:from-[#e04324] hover:to-orange-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-[#FF4D2D]/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? '🚀 دراسة كل الملفات في المشغل' : 'Study All in Player 🚀'}</span>
                </button>
              )}

              <button 
                onClick={() => setSelectedCourseForFiles(null)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>

          {isLoadingFiles ? (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF4D2D]" />
              <span>{isAr ? 'جاري تحميل قائمة الملفات...' : 'Loading files...'}</span>
            </div>
          ) : courseFiles.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400">
              {isAr ? 'لم يتم العثور على ملفات مفهرسة لهذا المقرر بعد.' : 'No indexed files found for this course.'}
            </p>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {courseFiles.map((file) => (
                <div 
                  key={file.moodle_file_id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                    isDark ? 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                    <div className="overflow-hidden">
                      <p className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {file.filename}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {file.section_name} • {file.page_count} {isAr ? 'صفحة' : 'pages'} • {file.chunk_count} {isAr ? 'مقطع متضمن' : 'chunks'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 hidden sm:inline-block ${
                      file.processing_status === 'processed'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : file.processing_status === 'failed'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      {file.processing_status === 'processed' ? '✓ Indexed' : file.processing_status}
                    </span>

                    <button
                      onClick={() => handleStudyFileInPlayer(file, selectedCourseForFiles.course_name)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 hover:from-[#e04324] hover:to-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-[#FF4D2D]/20 cursor-pointer"
                      title={isAr ? 'دراسة هذا الملف في مشغل الدروس الرئيسي' : 'Study this file in the main Lesson Player'}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isAr ? 'دراسة في المشغل 🚀' : 'Study in Player 🚀'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. AI RAG Assistant Querying Moodle Materials */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-700/90' : 'bg-gradient-to-br from-white to-orange-50/30 border-orange-200/80 shadow-md'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'المعلم الأكاديمي لمقررات Moodle (AI RAG)' : 'Moodle AI Study Assistant'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'اسأل أي سؤال وسيستخرج الذكاء الاصطناعي الإجابة الموثقة بأرقام الصفحات من مقرراتك' : 'Ask questions strictly grounded in your synced Moodle course materials'}
              </p>
            </div>
          </div>

          {/* Scope Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={ragCourseFilter}
              onChange={(e) => setRagCourseFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-[#FF4D2D] ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">{isAr ? 'كل المقررات المفعلة' : 'All Activated Courses'}</option>
              {courses.filter(c => c.activation_status === 'activated').map(c => (
                <option key={c.moodle_course_id} value={c.moodle_course_id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Form */}
        <form onSubmit={handleRagSearch} className="flex gap-2">
          <input
            type="text"
            value={ragQuery}
            onChange={(e) => setRagQuery(e.target.value)}
            placeholder={isAr ? 'مثال: اشرحلي مفهوم Backpropagation والمعادلة الرياضية الخاصة به...' : 'e.g. Explain backpropagation and its mathematical formula...'}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D2D] ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={isQueryingRag || !ragQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-orange-500 hover:from-[#e04324] hover:to-orange-600 text-white font-medium text-sm shadow-md shadow-orange-500/20 flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isQueryingRag ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAr ? 'اسأل' : 'Ask'}</span>
          </button>
        </form>

        {/* AI Answer & Citation Card */}
        {ragAnswer && (
          <div className={`mt-4 p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-orange-200/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#FF4D2D] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {isAr ? 'إجابة مدعومة بمراجع Moodle الرسمية' : 'Grounded Answer from Moodle'}
              </span>
              <button
                onClick={handleSendToTutorChat}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] hover:bg-[#FF4D2D]/20 font-medium transition-colors"
              >
                {isAr ? 'نقل للمحادثة الكاملة 💬' : 'Send to Tutor Chat 💬'}
              </button>
            </div>

            <p className={`text-sm leading-relaxed whitespace-pre-line mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {ragAnswer}
            </p>

            {/* Citations Badges */}
            {ragCitations.length > 0 && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80">
                <p className="text-[11px] font-bold text-slate-400 mb-2">
                  {isAr ? '📌 الاقتباسات والمصادر الدقيقة:' : '📌 Exact Citations & Sources:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ragCitations.map((cit, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-3 h-3" />
                      <span className="font-semibold">{cit.course_name}</span>
                      <span>•</span>
                      <span>{cit.filename}</span>
                      <span className="px-1.5 py-0.2 bg-orange-500/20 rounded font-bold">
                        {isAr ? `صفحة ${cit.page_number}` : `p. ${cit.page_number}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {ragError && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{ragError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
