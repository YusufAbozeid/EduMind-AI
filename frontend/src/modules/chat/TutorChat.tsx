import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { QuickActions } from './QuickActions';
import { 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Brain, 
  Lightbulb,
  Mic,
  MicOff,
  Sparkles,
  Hand
} from 'lucide-react';

export const TutorChat: React.FC = () => {
  const {
    messages,
    addMessage,
    isStreaming,
    speakText,
    stopSpeech,
    isSpeaking,
    registerKeystroke,
    activeModality,
    egyptianDialect,
    language,
    themeMode,
    setSignLanguageTerm
  } = useStore();

  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const [input, setInput] = useState('');
  const [proactiveHint, setProactiveHint] = useState<string | null>(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Keystroke Psychology & Pause Detection (> 4s pause triggers proactive hint offer)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    registerKeystroke();

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    if (e.target.value.length > 5) {
      pauseTimerRef.current = setTimeout(() => {
        let hintText = "You seem to be reflecting on this step! Would you like a helpful hint? 💡";
        if (isAr) {
          hintText = egyptianDialect 
            ? 'شكلك بتفكر في الخطوة دي يا بطل! بتحب أساعدك بتلميح بسيط يسّهل عليك؟ 💡'
            : 'يبدو أنك تفكر في هذه الخطوة! هل تحب أن أساعدك بتلميح ميسر؟ 💡';
        }
        setProactiveHint(hintText);
      }, 4000);
    }
  };

  const handleSendMessage = (textToSend?: string, level?: 'intuitive' | 'academic' | 'deep') => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setProactiveHint(null);

    // Add user message (triggers automatic AI Bot Response via useStore)
    addMessage({
      sender: 'user',
      text: text,
      modalityTag: activeModality,
      feynmanLevel: level
    });

    if (!textToSend) setInput('');
  };

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = isAr ? 'ar-EG' : 'en-US';
      
      if (!isListeningVoice) {
        setIsListeningVoice(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListeningVoice(false);
        };
        recognition.onerror = () => setIsListeningVoice(false);
        recognition.onend = () => setIsListeningVoice(false);
      } else {
        setIsListeningVoice(false);
      }
    } else {
      alert('Speech recognition is not supported on this browser version.');
    }
  };

  return (
    <div className={`flex flex-col h-full border rounded-2xl overflow-hidden shadow-xl transition-colors ${
      isDark ? 'bg-card/90 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      
      {/* Tutor Header */}
      <div className={`p-4 border-b flex items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF4D2D] flex items-center justify-center text-white font-extrabold shadow-md shadow-[#FF4D2D]/20">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="truncate">{isAr ? 'مساعد شغوف الذكي' : 'SHAGHOOF AI Tutor'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            </h3>
            <p className="text-[10px] text-slate-500 truncate">
              {!isAr
                ? `Active Modality: ${activeModality.toUpperCase()}`
                : egyptianDialect 
                ? 'يتحدث العامية المصرية 🇪🇬' 
                : 'يتحدث الفصحى الأكاديمية'}
            </p>
          </div>
        </div>

        {isAr && egyptianDialect && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shrink-0 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>عامية مصرية</span>
          </span>
        )}
      </div>

      {/* Messages List Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[90%] ${
              msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
            }`}
          >
            {/* Avatar Icon */}
            <div
              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : isDark ? 'bg-slate-800 border border-slate-700 text-sky-400' : 'bg-purple-100 text-purple-700 border border-purple-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Box */}
            <div
              className={`p-3.5 rounded-2xl text-xs space-y-2 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                  : isDark ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none' : 'bg-slate-100/90 border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              {/* Feynman Level Tag if Bot */}
              {msg.sender === 'bot' && msg.feynmanLevel && (
                <div className="flex items-center gap-1 text-[10px] text-sky-600 font-bold mb-1">
                  <Brain className="w-3 h-3 text-purple-600" />
                  <span>
                    {msg.feynmanLevel === 'intuitive' && (isAr ? 'مستوى مبسط للغاية (ELI5)' : 'Intuitive Level (ELI5)')}
                    {msg.feynmanLevel === 'academic' && (isAr ? 'مستوى أكاديمي قياسي' : 'Academic Standard')}
                    {msg.feynmanLevel === 'deep' && (isAr ? 'مستوى متعمق (Deep Math)' : 'Deep Math Derivation')}
                  </span>
                </div>
              )}

              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Message Actions: Listen (TTS) & Sign Language Translator Buttons */}
              {msg.sender === 'bot' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[9.5px] text-slate-400">{msg.timestamp}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSignLanguageTerm(msg.text)}
                      className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-300 font-bold hover:bg-teal-500/20 transition"
                      title={isAr ? "ترجمة هذه الإجابة بلغة الإشارة بمترجم 3D" : "Translate this bot reply into Sign Language Presenter Avatar"}
                    >
                      <Hand className="w-3 h-3 text-teal-500" />
                      <span>{isAr ? '🤟 ترجم بلغة الإشارة' : '🤟 Translate to Sign Language'}</span>
                    </button>

                    <button
                      onClick={() => (isSpeaking ? stopSpeech() : speakText(msg.text))}
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-purple-600 font-bold transition"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-500" /> : <Volume2 className="w-3 h-3 text-purple-600" />}
                      <span>{isSpeaking ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? '🔊 استمع بالمصرية 🇪🇬' : '🔊 Listen')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming Animation */}
        {isStreaming && (
          <div className={`flex items-center gap-2 text-slate-500 text-xs p-3 rounded-2xl max-w-[60%] border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Bot className="w-4 h-4 text-purple-600 animate-spin" />
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Proactive Keystroke Psychology Hint Banner */}
      {proactiveHint && (
        <div className="mx-3 mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-bold animate-fade-in">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{proactiveHint}</span>
          </div>
          <button
            onClick={() => handleSendMessage(isAr ? (egyptianDialect ? 'هات تلميح ميسر يا بطل 💡' : 'اعطني تلميح ميسر لهذه الخطوة 💡') : 'Give me a hint 💡')}
            className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px] hover:bg-amber-300"
          >
            {isAr ? 'قبول التلميح' : 'Accept Hint'}
          </button>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="px-3 pt-2">
        <QuickActions onSelectAction={(text, level) => handleSendMessage(text, level)} />
      </div>

      {/* Chat Input Bar */}
      <div className={`p-3 border-t transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
              isListeningVoice
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse'
                : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title={isAr ? "الإدخال الصوتي (Speech-to-Text)" : "Voice Input (Speech-to-Text)"}
          >
            {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              !isAr
                ? "Ask AI Tutor about PDF or request simplification..."
                : egyptianDialect 
                ? "اسأل المساعد بالمصري أو اطلب تبسيط..." 
                : "اسأل المساعد على الـ PDF أو اطلب تبسيطاً..."
            }
            className={`flex-1 border rounded-xl px-3.5 py-2 text-xs placeholder-slate-400 focus:outline-none focus:border-[#FF4D2D] transition ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition shadow-md shadow-[#FF4D2D]/20 shrink-0"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
      </div>

    </div>
  );
};
