// src/components/MiniAvatarRenderer.tsx
import React from 'react';
import { AvatarConfig } from '../types';

interface MiniAvatarRendererProps {
  config: AvatarConfig;
}

export default function MiniAvatarRenderer({ config }: MiniAvatarRendererProps) {
  // 옷 스타일 코드에 따른 색상 및 테마 매핑 연산
  const getClothColor = () => {
    switch (config.clothStyle) {
      case 'student': return 'bg-blue-600'; // 교복 느낌 블루
      case 'developer': return 'bg-zinc-800'; // 다크 개발자 후디/맨투맨
      case 'engineer': return 'bg-amber-600'; // 테크니컬 작업복 오렌지
      case 'expert': return 'bg-slate-900 border-t-2 border-yellow-400'; // 최고 등급 골드 정장 슈트
      default: return 'bg-emerald-500'; // 초기 기본 그린 후드티
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center scale-110 relative pt-2">
      {/* 헤어 레이어 상단 파트 */}
      <div className={`absolute top-4 w-12 text-center text-xs font-bold z-20 text-stone-700`}>
        {config.gender === 'male' ? '👨‍🦱' : '👩‍🦰'}
      </div>

      {/* 얼굴 구체 형태 구조 */}
      <div 
        className="w-10 h-10 rounded-full shadow-inner relative z-10 transition-colors duration-300 flex flex-col items-center justify-center"
        style={{ backgroundColor: config.skinColor }}
      >
        {/* 눈 렌더 매핑 */}
        <div className="flex gap-2 justify-center mb-0.5 mt-2">
          <span className="text-[7px] text-stone-800 font-sans">●</span>
          <span className="text-[7px] text-stone-800 font-sans">●</span>
        </div>
        
        {/* 표정 동적 대응 기믹 */}
        <div className="text-[8px] -mt-1 font-sans font-bold text-rose-600">
          {config.expression === 'happy' && '⌣'}
          {config.expression === 'focused' && '⩊'}
          {config.expression === 'tired' && '~'}
        </div>
      </div>

      {/* 몸체 및 해금 등급별 의상 렌더 레이어 */}
      <div className={`w-14 h-12 rounded-t-2xl ${getClothColor()} z-0 -mt-2 shadow-md relative flex items-center justify-center`}>
        <span className="text-[8px] text-white/50 font-mono tracking-tighter scale-75 pt-2">
          {config.clothStyle.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
