import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Network, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  BookOpen, 
  ArrowRight, 
  X
} from 'lucide-react';

interface KnowledgeGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConceptTopic?: (conceptId: string) => void;
}

interface GraphNode {
  id: string;
  label: string;
  labelAr: string;
  category: 'foundations' | 'neural' | 'core' | 'optimization' | 'advanced';
  level: number;
  x: number;
  y: number;
  radius: number;
  descriptionAr: string;
  formula?: string;
  prerequisites: string[];
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export const KnowledgeGraphModal: React.FC<KnowledgeGraphModalProps> = ({ isOpen, onClose, onSelectConceptTopic }) => {
  const { language, themeMode, setActiveModality } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('c7'); // Default to Backpropagation
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Nodes with predefined 2D canvas coordinates for a balanced, aesthetic layout
  const nodes: GraphNode[] = [
    {
      id: 'c1',
      label: 'Linear Algebra & Vectors',
      labelAr: 'الجبر الخطي والمتجهات',
      category: 'foundations',
      level: 1,
      x: 120,
      y: 120,
      radius: 26,
      descriptionAr: 'المصفوفات والمتجهات التي تمثل المدخلات والأوزان في الفضاء الرقمي متعدد الأبعاد.',
      formula: 'y = W · x + b',
      prerequisites: ['أساسيات الرياضيات']
    },
    {
      id: 'c2',
      label: 'Calculus & Gradients',
      labelAr: 'التفاضل وحساب المشتقات',
      category: 'foundations',
      level: 1,
      x: 120,
      y: 340,
      radius: 26,
      descriptionAr: 'حساب معدل تغير دالة الخسارة بالنسبة لكل وزن لمعرفة اتجاه التحديث الأمثل.',
      formula: '∇L = [∂L/∂w₁, ∂L/∂w₂, ...]',
      prerequisites: ['التفاضل والتكامل']
    },
    {
      id: 'c3',
      label: 'Perceptron & Neurons',
      labelAr: 'الخلية العصبية الاصطناعية',
      category: 'neural',
      level: 2,
      x: 280,
      y: 180,
      radius: 30,
      descriptionAr: 'الوحدة الحسابية الأساسية التي تستقبل المدخلات وتضربها بالأوزان ثم تجمعها مع الانحياز.',
      formula: 'z = ∑ (wᵢ · xᵢ) + b',
      prerequisites: ['الجبر الخطي']
    },
    {
      id: 'c4',
      label: 'Activation Functions',
      labelAr: 'دوال التفعيل (ReLU, Sigmoid)',
      category: 'neural',
      level: 2,
      x: 280,
      y: 300,
      radius: 28,
      descriptionAr: 'إدخال اللاخطية (Non-linearity) لتمكين الشبكة من تعلم أنماط معقدة غير قابلة للفصل الخطي.',
      formula: 'ReLU(z) = max(0, z)',
      prerequisites: ['الخلية العصبية']
    },
    {
      id: 'c5',
      label: 'Forward Propagation',
      labelAr: 'التمرير الأمامي',
      category: 'core',
      level: 3,
      x: 450,
      y: 160,
      radius: 32,
      descriptionAr: 'تدفق الإشارات من طبقة المدخلات عبر الطبقات الخفية وصولاً لتوليد التنبؤ النهائي.',
      formula: 'a^[l] = σ(W^[l] · a^[l-1] + b^[l])',
      prerequisites: ['دوال التفعيل', 'الخلية العصبية']
    },
    {
      id: 'c6',
      label: 'Loss Functions (MSE/Cross-Entropy)',
      labelAr: 'دوال الخسارة وحساب الخطأ',
      category: 'core',
      level: 3,
      x: 450,
      y: 320,
      radius: 30,
      descriptionAr: 'المقياس الكمي للفارق بين القيمة المتوقعة والقيمة الحقيقية المستهدفة.',
      formula: 'MSE = 1/n ∑ (y - ŷ)²',
      prerequisites: ['التمرير الأمامي']
    },
    {
      id: 'c7',
      label: 'Backpropagation',
      labelAr: 'التمرير الخلفي للأخطاء',
      category: 'core',
      level: 4,
      x: 620,
      y: 240,
      radius: 36,
      descriptionAr: 'نشر إشارات الخطأ عكسياً باستخدام قاعدة السلسلة لحساب التدرجات وتعديل كافة الأوزان.',
      formula: '∂L/∂w = (∂L/∂a) · (∂a/∂z) · (∂z/∂w)',
      prerequisites: ['دوال الخسارة', 'حساب المشتقات']
    },
    {
      id: 'c8',
      label: 'Gradient Descent Optimizers',
      labelAr: 'مُحسّنات التدرج (SGD & Adam)',
      category: 'optimization',
      level: 4,
      x: 770,
      y: 150,
      radius: 32,
      descriptionAr: 'الخوارزمية التي تستخدم التدرجات المحسوبة لتحديث الأوزان نحو القاع الأقل خسارة.',
      formula: 'w := w - α · ∇L',
      prerequisites: ['التمرير الخلفي']
    },
    {
      id: 'c9',
      label: 'Overfitting & Regularization',
      labelAr: 'فرط المطابقة ومعالجة الانحياز',
      category: 'optimization',
      level: 5,
      x: 770,
      y: 330,
      radius: 30,
      descriptionAr: 'تقنيات مثل Dropout و L2 Regularization لمنع الشبكة من حفظ بيانات التدريب.',
      formula: 'L_reg = L + λ/2m ∑ w²',
      prerequisites: ['محسنات التدرج']
    },
    {
      id: 'c10',
      label: 'Deep Convolutional Networks',
      labelAr: 'الشبكات الالتفافية CNN',
      category: 'advanced',
      level: 6,
      x: 910,
      y: 240,
      radius: 34,
      descriptionAr: 'استخدام الفلاتر والمطابقة المكانية لاستخراج الخصائص البصرية من الصور والمصفوفات.',
      formula: 'S(i,j) = (I * K)(i,j)',
      prerequisites: ['التمرير الخلفي', 'الشبكات العصبية']
    }
  ];

  const edges: GraphEdge[] = [
    { source: 'c1', target: 'c3', label: 'Inputs' },
    { source: 'c2', target: 'c7', label: 'Derivatives' },
    { source: 'c3', target: 'c4', label: 'Activation' },
    { source: 'c3', target: 'c5', label: 'Signal' },
    { source: 'c4', target: 'c5', label: 'Non-linear' },
    { source: 'c5', target: 'c6', label: 'Prediction' },
    { source: 'c6', target: 'c7', label: 'Error Feed' },
    { source: 'c7', target: 'c8', label: 'Gradients' },
    { source: 'c8', target: 'c9', label: 'Tune' },
    { source: 'c7', target: 'c10', label: 'Deep Stacking' }
  ];

  const categoryColors: Record<string, { bg: string; border: string; glow: string; text: string }> = {
    foundations: { bg: '#3b82f6', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)', text: 'الركائز الرياضية' },
    neural: { bg: '#8b5cf6', border: '#a78bfa', glow: 'rgba(139, 92, 246, 0.4)', text: 'البنية العصبية' },
    core: { bg: '#ef4444', border: '#f87171', glow: 'rgba(239, 68, 68, 0.4)', text: 'آليات التعلم الجوهرية' },
    optimization: { bg: '#10b981', border: '#34d399', glow: 'rgba(16, 185, 129, 0.4)', text: 'التحسين وضبط الأداء' },
    advanced: { bg: '#f59e0b', border: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)', text: 'المعمارية المتقدمة' }
  };

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const q = searchQuery.toLowerCase();
    return nodes.filter(n => n.label.toLowerCase().includes(q) || n.labelAr.includes(q));
  }, [searchQuery]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[6];

  const handleStartLesson = () => {
    setActiveModality('visual');
    if (onSelectConceptTopic) {
      onSelectConceptTopic(selectedNode.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-blue-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
        }`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? '🕸️ خريطة المفاهيم التفاعلية ثلاثية الأبعاد (Interactive Knowledge Graph)' : '🕸️ 3D Concept Knowledge Graph'}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30">
                  Topological Network
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'استكشف الترابط العضوي بين موضوعات المنهج، وتدرج المفاهيم من الأساس الرياضي وحتى التطبيق المتقدم' : 'Explore conceptual dependencies from math foundations to advanced architectures'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Legend & Zoom */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
        }`}>
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن مفهوم في الخريطة...' : 'Search concepts in graph...'}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clusters Legend */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            {Object.entries(categoryColors).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.bg }} />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{meta.text}</span>
              </div>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Canvas & Details Drawer Split View */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Interactive SVG Canvas Area */}
          <div className={`flex-1 relative overflow-hidden flex items-center justify-center p-4 select-none ${
            isDark ? 'bg-slate-950/90' : 'bg-slate-50/50'
          }`}>
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />

            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 200ms ease-out' }}
              className="relative w-[1000px] h-[460px]"
            >
              <svg className="w-full h-full" viewBox="0 0 1000 460">
                {/* Connecting Edges */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={isDark ? '#475569' : '#cbd5e1'} />
                  </marker>
                </defs>

                {edges.map((edge, i) => {
                  const sNode = nodes.find(n => n.id === edge.source);
                  const tNode = nodes.find(n => n.id === edge.target);
                  if (!sNode || !tNode) return null;

                  const isConnectedToSelected = sNode.id === selectedNodeId || tNode.id === selectedNodeId;

                  return (
                    <g key={i}>
                      <line
                        x1={sNode.x}
                        y1={sNode.y}
                        x2={tNode.x}
                        y2={tNode.y}
                        stroke={isConnectedToSelected ? '#f97316' : (isDark ? '#334155' : '#cbd5e1')}
                        strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                        strokeDasharray={isConnectedToSelected ? '4 2' : undefined}
                        markerEnd="url(#arrow)"
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* Graph Nodes */}
                {nodes.map(node => {
                  const isSelected = node.id === selectedNodeId;
                  const isMatch = filteredNodes.some(fn => fn.id === node.id);
                  const meta = categoryColors[node.category];

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group"
                      style={{ opacity: isMatch ? 1 : 0.25 }}
                    >
                      {/* Pulse Ring when selected */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.radius + 8}
                          fill="none"
                          stroke={meta.border}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                        />
                      )}

                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill={meta.bg}
                        stroke={isSelected ? '#ffffff' : meta.border}
                        strokeWidth={isSelected ? 3 : 1.5}
                        style={{ filter: isSelected ? `drop-shadow(0 0 12px ${meta.glow})` : undefined }}
                        className="transition-transform group-hover:scale-110"
                      />

                      {/* Node Label Text */}
                      <text
                        x={node.x}
                        y={node.y + node.radius + 14}
                        textAnchor="middle"
                        fill={isDark ? '#e2e8f0' : '#1e293b'}
                        fontSize="11"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="select-none pointer-events-none"
                      >
                        {isAr ? node.labelAr : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Inspector / Concept Details Drawer */}
          <div className={`w-full lg:w-96 border-t lg:border-t-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l p-6 flex flex-col justify-between overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                  categoryColors[selectedNode.category].text
                }`} style={{ borderColor: categoryColors[selectedNode.category].border, backgroundColor: `${categoryColors[selectedNode.category].bg}15`, color: categoryColors[selectedNode.category].border }}>
                  {categoryColors[selectedNode.category].text}
                </span>

                <span className="text-xs font-mono text-slate-400">
                  Level {selectedNode.level}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  {isAr ? selectedNode.labelAr : selectedNode.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedNode.label}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {isAr ? 'الشرح المفاهيمي:' : 'Conceptual Overview:'}
                </span>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedNode.descriptionAr}
                </p>
              </div>

              {selectedNode.formula && (
                <div className={`p-3.5 rounded-2xl border font-mono text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800 text-orange-400' : 'bg-orange-50/70 border-orange-200 text-orange-700'
                }`}>
                  <span className="text-[9px] font-sans font-bold text-slate-400 block mb-1 uppercase">
                    {isAr ? 'الصياغة الرياضية:' : 'Core Formula:'}
                  </span>
                  {selectedNode.formula}
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {isAr ? 'المتطلبات السابقة (Prerequisites):' : 'Prerequisites:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.prerequisites.map((p, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch to VARK Lesson Player Action */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleStartLesson}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isAr ? 'ابدأ دراسة هذا المفهوم في الدرس الآن' : 'Launch Interactive VARK Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <span className="font-bold text-blue-500">
            SHAGHOOF 3D Knowledge Network
          </span>
          <span>
            {isAr ? 'مستخرج تلقائياً من المناهج ومربوط بمحركات VARK' : 'Dynamically clustered from course syllabus & linked to VARK'}
          </span>
        </div>
      </div>
    </div>
  );
};
