// src/components/HomeView.tsx
import React from 'react';
import { AppState } from '../types';
import MiniAvatarRenderer from './MiniAvatarRenderer';

interface HomeViewProps {
  state: AppState;
  toggleTodo: (id: string) => void;
}

export default function HomeView({ state, toggleTodo }: HomeViewProps) {
  const completedCount = state.todos.filter(t => t.completed).length;
  const progressPercent = state.todos.length ? Math.round((completedCount / state.todos.length) * 100) : 0;

  // 요구사항 기반 동적 AI 코칭 멘트 알고리즘
  const getAiMessage = () => {
    if (state.stats.hp < 40) {
      return "어라라.. 연속된 오답으로 캐릭터 체력이 낮아졌어요! 스티랑 같이 쉬운 문제부터 차근차근 다시 복습해요 🌱";
    }
    if (progressPercent === 100 && state.todos.length > 0) {
      return "대단해요! 오늘 플래너를 완전히 정복하셨네요! 우리 아바타가 쑥쑥 자라는 소리가 들려요 🚀";
    }
    return `안녕하세요! 저는 스티(STDY)예요 🌱 오늘 목표인 [${state.userInfo?.goal}]을(를) 향해 오늘도 저와 함께 멋지게 성장해볼까요?`;
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 귀여운 AI 스티 메신저 위젯 */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3 shadow-sm">
        <div className="bg-white p-2 rounded-full shadow-inner border border-emerald-200 text-2xl shrink-0">🤖</div>
        <div>
          <h4 className="font-bold text-xs text-emerald-800 mb-0.5">AI 코치 스티(STDY)</h4>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">{getAiMessage()}</p>
        </div>
      </div>

      {/* 미니 RPG 캐릭터 아바타 상태바 패널 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border relative overflow-hidden">
          {state.avatar && <MiniAvatarRenderer config={state.avatar} />}
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between items-end">
            <span className="font-bold text-sm text-gray-800">Lv.{state.stats.level} {state.userInfo?.nickname}</span>
            <span className="text-[10px] text-gray-400">EXP {state.stats.exp}/{state.stats.maxExp}</span>
          </div>
          {/* 경험치 바 */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${(state.stats.exp / state.stats.maxExp) * 100}%` }}></div>
          </div>
          {/* 하트 체력 바 (요구사항 반영) */}
          <div className="flex justify-between items-center text-xs text-gray-600 pt-1">
            <span className="flex items-center gap-1">❤️ 체력 {state.stats.hp}/100</span>
            <span className="text-[11px] text-emerald-600 font-semibold">총 공부: {state.totalStudyTime}분</span>
          </div>
        </div>
      </div>

      {/* 오늘 진행률 및 퀵 플래너 리스트 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-800">오늘의 퀘스트 진행률</h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="pt-2 space-y-2">
          {state.todos.slice(0, 3).map(todo => (
            <div key={todo.id} onClick={() => toggleTodo(todo.id)} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-100">
              <input type="checkbox" checked={todo.completed} readOnly className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
              <span className={`text-xs ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>{todo.text}</span>
            </div>
          ))}
          {state.todos.length > 3 && (
            <p className="text-center text-[11px] text-gray-400 font-medium pt-1">외에 {state.todos.length - 3}개의 퀘스트가 플래너에 더 있습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
