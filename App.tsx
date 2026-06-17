// src/App.tsx
import React from 'react';
import { useAppState } from './hooks/useAppState';
import Onboarding from './components/Onboarding';
import HomeView from './components/HomeView';
import PlannerView from './components/PlannerView';
import TimerView from './components/TimerView';
import NotesView from './components/NotesView';
import CharacterView from './components/CharacterView';

import { Home, Calendar, Timer, BookOpen, User } from 'lucide-react';

export default function App() {
  const { state, setStep, initUser, toggleTodo, addTodo, deleteTodo, addWrongNote, answerQuiz, addMinutes, setTab } = useAppState();

  // 온보딩 프로세스 처리 (첫 실행 화면 포함)
  if (!state.isInitialized) {
    return <Onboarding step={state.step} setStep={setStep} onComplete={initUser} />;
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      {/* 모바일 뷰포트 컨테이너 (스마트폰 크기 고정 및 태블릿/PC 반응형 대응) */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-xl relative pb-20">
        
        {/* 상단 공통 헤더 */}
        <header className="bg-emerald-600 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <h1 className="font-bold text-lg tracking-wide">Study With AI</h1>
          </div>
          <div className="bg-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
            Lv.{state.stats.level} {state.userInfo?.nickname}
          </div>
        </header>

        {/* 탭 기반 본문 렌더링 */}
        <main className="flex-1 p-4 overflow-y-auto">
          {state.currentTab === 'home' && (
            <HomeView state={state} toggleTodo={toggleTodo} />
          )}
          {state.currentTab === 'planner' && (
            <PlannerView todos={state.todos} addTodo={addTodo} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />
          )}
          {state.currentTab === 'timer' && (
            <TimerView addMinutes={addMinutes} />
          )}
          {state.currentTab === 'notes' && (
            <NotesView wrongNotes={state.wrongNotes} addWrongNote={addWrongNote} answerQuiz={answerQuiz} />
          )}
          {state.currentTab === 'character' && (
            <CharacterView stats={state.stats} avatar={state.avatar} userInfo={state.userInfo} />
          )}
        </main>

        {/* 하단 고정 내비게이션 바 */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50 px-2 shadow-lg">
          <button 
            onClick={() => setTab('home')} 
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${state.currentTab === 'home' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-gray-400'}`}
          >
            <Home size={20} />
            <span className="text-[10px] mt-1">홈</span>
          </button>
          <button 
            onClick={() => setTab('planner')} 
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${state.currentTab === 'planner' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-gray-400'}`}
          >
            <Calendar size={20} />
            <span className="text-[10px] mt-1">플래너</span>
          </button>
          <button 
            onClick={() => setTab('timer')} 
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${state.currentTab === 'timer' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-gray-400'}`}
          >
            <Timer size={20} />
            <span className="text-[10px] mt-1">집중</span>
          </button>
          <button 
            onClick={() => setTab('notes')} 
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${state.currentTab === 'notes' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-gray-400'}`}
          >
            <BookOpen size={20} />
            <span className="text-[10px] mt-1">오답노트</span>
          </button>
          <button 
            onClick={() => setTab('character')} 
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${state.currentTab === 'character' ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-gray-400'}`}
          >
            <User size={20} />
            <span className="text-[10px] mt-1">캐릭터</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
