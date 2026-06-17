// src/hooks/useAppState.ts
import { useState, useEffect } from 'react';
import { AppState, UserInfo, AvatarConfig, TodoItem, WrongNote, CharacterStats } from '../types';

const INITIAL_STATS: CharacterStats = {
  level: 1,
  exp: 0,
  maxExp: 100,
  hp: 100,
  focus: 10,
  willpower: 10,
  knowledge: 10,
};

const INITIAL_STATE: AppState = {
  isInitialized: false,
  step: 0,
  userInfo: null,
  avatar: null,
  stats: INITIAL_STATS,
  todos: [],
  wrongNotes: [],
  totalStudyTime: 0,
  currentTab: 'home',
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('study_with_ai_data');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_STATE; }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('study_with_ai_data', JSON.stringify(state));
  }, [state]);

  const setStep = (step: number) => setState(prev => ({ ...prev, step }));
  
  const initUser = (userInfo: UserInfo, avatar: AvatarConfig) => {
    setState(prev => ({
      ...prev,
      userInfo,
      avatar,
      isInitialized: true,
      currentTab: 'home',
    }));
    generateAiPlan(userInfo);
  };

  const generateAiPlan = (info: UserInfo) => {
    // AI 스티의 가상 분석 플래너 생성 (요구사항 반영)
    const mockTasks = [
      `${info.field} 이론 1단원 공부`,
      `핵심 도면 및 개념 5개 분석`,
      `기출문제 20개 풀이`,
      `주요 공식 암기`
    ];
    const generated: TodoItem[] = mockTasks.map((task, idx) => ({
      id: `todo-${Date.now()}-${idx}`,
      text: task,
      completed: false,
      day: 1
    }));
    setState(prev => ({ ...prev, todos: generated }));
  };

  const gainExp = (amount: number, statGains?: Partial<CharacterStats>) => {
    setState(prev => {
      let newExp = prev.stats.exp + amount;
      let newLevel = prev.stats.level;
      let newMaxExp = prev.stats.maxExp;
      
      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel += 1;
        newMaxExp = Math.floor(newMaxExp * 1.2);
      }

      // 레벨에 따른 아바타 의상 자동 해금 체크
      let currentCloth = prev.avatar?.clothStyle || 'hoodie';
      if (newLevel >= 15) currentCloth = 'expert';
      else if (newLevel >= 10) currentCloth = 'engineer';
      else if (newLevel >= 5) currentCloth = 'developer';
      else if (newLevel >= 3) currentCloth = 'student';

      const updatedAvatar = prev.avatar ? { ...prev.avatar, clothStyle: currentCloth } : null;

      return {
        ...prev,
        avatar: updatedAvatar as AvatarConfig,
        stats: {
          ...prev.stats,
          level: newLevel,
          exp: newExp,
          maxExp: newMaxExp,
          hp: Math.min(100, prev.stats.hp + (statGains?.hp || 0)),
          focus: prev.stats.focus + (statGains?.focus || 1),
          willpower: prev.stats.willpower + (statGains?.willpower || 1),
          knowledge: prev.stats.knowledge + (statGains?.knowledge || 1),
        }
      };
    });
  };

  const addMinutes = (minutes: number) => {
    setState(prev => ({ ...prev, totalStudyTime: prev.totalStudyTime + minutes }));
    gainExp(minutes * 2, { focus: Math.floor(minutes / 10), willpower: Math.floor(minutes / 15) });
  };

  const toggleTodo = (id: string) => {
    setState(prev => {
      const updated = prev.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const target = prev.todos.find(t => t.id === id);
      if (target && !target.completed) {
        // 완료 체크 시 보상
        setTimeout(() => gainExp(15, { knowledge: 2 }), 50);
      }
      return { ...prev, todos: updated };
    });
  };

  const addTodo = (text: string) => {
    const newItem: TodoItem = { id: `todo-${Date.now()}`, text, completed: false, day: 1 };
    setState(prev => ({ ...prev, todos: [...prev.todos, newItem] }));
  };

  const deleteTodo = (id: string) => {
    setState(prev => ({ ...prev, todos: prev.todos.filter(t => t.id !== id) }));
  };

  const addWrongNote = (note: Omit<WrongNote, 'id' | 'stars' | 'correctStreak'>) => {
    const newNote: WrongNote = { ...note, id: `note-${Date.now()}`, stars: 0, correctStreak: 0 };
    setState(prev => ({ ...prev, wrongNotes: [...prev.wrongNotes, newNote] }));
  };

  const answerQuiz = (id: string, isCorrect: boolean) => {
    setState(prev => {
      const updatedNotes = prev.wrongNotes.map(note => {
        if (note.id !== id) return note;
        if (isCorrect) {
          const nextStreak = note.correctStreak + 1;
          return { ...note, correctStreak: nextStreak };
        } else {
          const nextStars = note.stars + 1;
          return { ...note, stars: nextStars, correctStreak: 0 };
        }
      }).filter(note => note.correctStreak < 3); // 3번 연속 정답 시 자동 완완료 삭제

      // 오답 패널티 및 피드백 계산을 위한 타겟 확인
      const originNote = prev.wrongNotes.find(n => n.id === id);
      let hpPenalty = 0;
      if (!isCorrect && originNote && originNote.stars + 1 >= 5) {
        hpPenalty = 5; // 별 5개 이상 시 체력 -5
      }

      setTimeout(() => {
        if (isCorrect) {
          gainExp(20, { knowledge: 3, willpower: 2 });
        }
      }, 50);

      return {
        ...prev,
        wrongNotes: updatedNotes,
        stats: {
          ...prev.stats,
          hp: Math.max(0, prev.stats.hp - hpPenalty)
        }
      };
    });
  };

  const setTab = (tab: AppState['currentTab']) => setState(prev => ({ ...prev, currentTab: tab }));

  const resetAll = () => setState(INITIAL_STATE);

  return { state, setStep, initUser, toggleTodo, addTodo, deleteTodo, addWrongNote, answerQuiz, addMinutes, setTab, resetAll };
}
