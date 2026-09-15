import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { getVisualData, type VisualNode } from '../../services/topicContentService';
import { Sparkles, Layers, Zap, Info, Cpu, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const VisualRenderer: React.FC = () => {
  const { language, themeMode, topics, activeTopicId, addMessage } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const visualData = getVisualData(activeTopic);

  const [selectedNode, setSelectedNode] = useState<VisualNode | null>(visualData.nodes[0] || null);

  // Reset selected node when topic changes
  useEffect(() => {
    setSelectedNode(visualData.nodes[0] || null);
  }, [activeTopicId]);

  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return Cpu;
      case 'CheckCircle': return CheckCircle;
      case 'Layers': return Layers;
      case 'Sparkles': return Sparkles;
      default: return Zap;
    }
  };

  const Card1Icon = getCardIcon(visualData.card1.icon);
  const Card2Icon = getCardIcon(visualData.card2.icon);

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className={`border rounded-2xl p-5 shadow-sm transition-colors ${
        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] border border-[#FF4D2D]/30 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isAr ? visualData.headerTitleAr : visualData.headerTitleEn}
          </h3>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {isAr ? visualData.headerDescAr : visualData.headerDescEn}
        </p>
      </div>

      {/* SVG Interactive Architecture Diagram */}
      <div className={`border rounded-2xl p-6 relative overflow-hidden flex flex-col items-center shadow-sm transition-colors ${
        isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        <svg className="w-full max-w-3xl h-72" viewBox="0 0 600 240">
          <defs>
            <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6C5CE7" />
            </linearGradient>
            <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
            <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D2D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Connection Lines based on diagram type */}
          {visualData.diagramType === 'concurrency' && (
            <g stroke={isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.35)"} strokeWidth="2" strokeDasharray="5,5">
              <line x1="90" y1="70" x2="230" y2="50" stroke="#0284C7" strokeWidth="2" opacity="0.6" />
              <line x1="230" y1="50" x2="370" y2="50" stroke="#7C3AED" strokeWidth="2" opacity="0.6" />
              <line x1="370" y1="50" x2="510" y2="70" stroke="#FF4D2D" strokeWidth="2" opacity="0.6" />
              <line x1="230" y1="50" x2="300" y2="175" stroke="#D97706" strokeWidth="2.5" opacity="0.8" />
              <line x1="510" y1="70" x2="300" y2="175" stroke="#FF4D2D" strokeWidth="2" strokeDasharray="2,2" opacity="0.4" />
            </g>
          )}

          {visualData.diagramType === 'rag' && (
            <g stroke={isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.35)"} strokeWidth="2" strokeDasharray="5,5">
              <line x1="80" y1="70" x2="220" y2="60" stroke="#0284C7" strokeWidth="2" />
              <line x1="220" y1="60" x2="360" y2="60" stroke="#7C3AED" strokeWidth="2" />
              <line x1="360" y1="60" x2="520" y2="70" stroke="#FF4D2D" strokeWidth="2" />
              <line x1="360" y1="60" x2="430" y2="175" stroke="#D97706" strokeWidth="2" />
              <line x1="430" y1="175" x2="520" y2="70" stroke="#D97706" strokeWidth="2" />
            </g>
          )}

          {visualData.diagramType === 'transformers' && (
            <g stroke={isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.35)"} strokeWidth="2" strokeDasharray="5,5">
              <line x1="90" y1="70" x2="230" y2="60" stroke="#0284C7" strokeWidth="2" />
              <line x1="230" y1="60" x2="370" y2="60" stroke="#7C3AED" strokeWidth="2" />
              <line x1="370" y1="60" x2="520" y2="70" stroke="#FF4D2D" strokeWidth="2" />
              <line x1="370" y1="60" x2="430" y2="175" stroke="#D97706" strokeWidth="2" />
              <line x1="430" y1="175" x2="520" y2="70" stroke="#FF4D2D" strokeWidth="2" />
            </g>
          )}

          {visualData.diagramType === 'neural_nets' && (
            <g stroke={isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(100, 116, 139, 0.35)"} strokeWidth="2" strokeDasharray="4,4">
              <line x1="100" y1="80" x2="300" y2="60" stroke="#7C3AED" strokeWidth="2" opacity="0.6" />
              <line x1="300" y1="60" x2="500" y2="80" stroke="#0284C7" strokeWidth="2" opacity="0.7" />
            </g>
          )}

          {/* Interactive Nodes */}
          {visualData.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g 
                key={node.id} 
                onClick={() => setSelectedNode(node)} 
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isSelected ? 32 : 28} 
                  fill={isDark ? '#1E293B' : '#F1F5F9'} 
                  stroke={node.color} 
                  strokeWidth={isSelected ? 4 : 2.5}
                  className="transition-all"
                />
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={isSelected ? 26 : 22} 
                  fill={node.color} 
                  opacity={isSelected ? 0.95 : 0.85}
                />
                <text 
                  x={node.x} 
                  y={node.y + 4} 
                  fill="#FFFFFF" 
                  fontSize={node.label.length > 10 ? '9' : '10'} 
                  textAnchor="middle" 
                  fontWeight="bold"
                >
                  {node.label}
                </text>
                {node.subLabel && (
                  <text 
                    x={node.x} 
                    y={node.y + 44} 
                    fill={isDark ? '#94A3B8' : '#475569'} 
                    fontSize="10" 
                    textAnchor="middle" 
                    fontWeight="600"
                  >
                    {node.subLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Node Inspector Detail Card */}
        {selectedNode && (
          <div className={`w-full mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-3 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-700 shadow-md' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm"
                style={{ backgroundColor: selectedNode.color }}
              >
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isAr ? selectedNode.titleAr : selectedNode.titleEn}
                </h4>
                <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? selectedNode.descAr : selectedNode.descEn}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const question = isAr 
                  ? `اشرح لي بالتفصيل كيف يعمل ${selectedNode.titleAr} في مقرر ${activeTopic.titleAr} مع مثال عملي؟`
                  : `Can you explain how ${selectedNode.titleEn} works in ${activeTopic.titleEn} with a code example?`;
                addMessage({ sender: 'user', text: question });
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#FF4D2D]/10 hover:bg-[#FF4D2D] text-[#FF4D2D] hover:text-white border border-[#FF4D2D]/30 font-bold flex items-center gap-1 shrink-0 self-end sm:self-center transition-all cursor-pointer"
            >
              <span>{isAr ? 'اسأل المعلم الذكي عن هذا العنصر' : 'Ask AI Tutor'}</span>
              {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        )}

      </div>

      {/* Visual Infographic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border space-y-2 shadow-sm transition-colors ${
          isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-[#FF4D2D] dark:text-[#FF7355] font-bold text-xs">
            <Card1Icon className="w-4 h-4" />
            <span>{isAr ? visualData.card1.titleAr : visualData.card1.titleEn}</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {isAr ? visualData.card1.descAr : visualData.card1.descEn}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border space-y-2 shadow-sm transition-colors ${
          isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs">
            <Card2Icon className="w-4 h-4" />
            <span>{isAr ? visualData.card2.titleAr : visualData.card2.titleEn}</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {isAr ? visualData.card2.descAr : visualData.card2.descEn}
          </p>
        </div>
      </div>

    </div>
  );
};