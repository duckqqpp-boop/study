// src/components/CharacterView.tsx
import React from 'react';
import { CharacterStats, AvatarConfig, UserInfo } from '../types';
import MiniAvatarRenderer from './MiniAvatarRenderer';

interface CharacterViewProps {
  stats: CharacterStats;
  avatar: AvatarConfig | null;
  userInfo: UserInfo | null;
}

export default function CharacterView({ stats, avatar, userInfo }: CharacterViewProps) {
  // 해금 등급에 대응하는 국문 이름 변환 매퍼
  const getClothTitle = (style: string) => {
    switch(style) {
      case 'student': return '학생 스타일 (Lv.3 해금)';
      case 'developer': return '개발자 스타일 (Lv.5 해금)';
      case 'engineer': return '엔지니어 스타일 (Lv.10 해금)';
      case 'expert': return '전문가 마스터 수트 (Lv.15 해금)';
      default: return '초기 기본 후드티';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 아바타 히어로 쇼케이스 박스 */}
      <div className="bg-gradient-to-b from-emerald-600 to-teal-700 rounded-3xl p-6 text-white flex flex-col items-center shadow-lg relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
          {avatar?.gender === 'male' ? '👨 MALE HERO' : '👩 FEMALE HERO'}
        </div>

        <div className="w-28 h-28 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shadow-inner mb-4 overflow-hidden">
          {avatar && <MiniAvatarRenderer config={avatar} />}
        </div>

        <h2 className="text-lg font-bold tracking-wide">{userInfo?.nickname}</h2>
        <p className="text-xs text-emerald-100 font-mono mt-0.5">Title: {getClothTitle(avatar?.clothStyle || 'hoodie')}</p>
      </div>

      {/* RPG 스탯 스펙 차트 보드 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3.5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-0.5">Character Core Status</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* 체력 게이지 */}
          <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>❤️ 체력</span>
              <span className="font-mono text-rose-600">{stats.hp}/100</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all" style={{ width: `${stats.hp}%` }}></div>
            </div>
          </div>

          {/* 집중력 수치 */}
          <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>🎯 집중력</span>
              <span className="font-mono text-amber-600">{stats.focus} P</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all" style={{ width: `${Math.min(100, stats.focus)}%` }}></div>
            </div>
          </div>

          {/* 의지 수치 */}
          <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>🔥 의지력</span>
              <span className="font-mono text-indigo-600">{stats.willpower} P</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all" style={{ width: `${Math.min(100, stats.willpower)}%` }}></div>
            </div>
          </div>

          {/* 지식 수치 */}
          <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span>📘 지식수준</span>
              <span className="font-mono text-emerald-600">{stats.knowledge} P</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${Math.min(100, stats.knowledge)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 설정된 유저 목표 성장 아카이브 카드 */}
      <div className="bg-gray-50 p-3.5 rounded-xl border text-[11px] text-gray-600 space-y-1">
        <div>• <span className="font-semibold text-gray-800">성장 메인 목표:</span> {userInfo?.goal}</div>
        <div>• <span className="font-semibold text-gray-800">타겟 데드라인:</span> {userInfo?.examDate || '미설정'}</div>
        <div>• <span className="font-semibold text-gray-800">지정 클래스 난이도:</span> {userInfo?.level} 과정</div>
      </div>
    </div>
  );
}
