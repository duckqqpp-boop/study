// src/components/PlannerView.tsx
import React, { useState } from 'react';
import { TodoItem } from '../types';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

interface PlannerViewProps {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
}

export default function PlannerView({ todos, addTodo, deleteTodo, toggleTodo }: PlannerViewProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addTodo(inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
        <h3 className="text-xs font-bold text-emerald-800 mb-1">🤖 STDY AI 자동 동적 플래너</h3>
        <p className="text-[11px] text-emerald-700 leading-relaxed">설정된 D-Day 및 공부 가용 시간을 정밀 연산하여 AI가 처방한 1일차 퀘스트 라인업입니다.</p>
      </div>

      {/* 신규 할일 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={inputText} 
          onChange={e => setInputText(e.target.value)} 
          placeholder="추가할 공부 퀘스트를 입력하세요..." 
          className="flex-1 p-3 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all shadow-sm">
          <Plus size={18} />
        </button>
      </form>

      {/* 할일 리스트 렌더러 */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-gray-500 px-1">DAY 1 미션 목록</div>
        {todos.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">등록된 플래너 퀘스트가 없습니다.</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`flex justify-between items-center p-3 rounded-xl border transition-all ${todo.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-3 flex-1 mr-2 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                <CheckCircle size={18} className={todo.completed ? 'text-emerald-500 fill-emerald-50' : 'text-gray-300'} />
                <span className={`text-xs ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 font-semibold'}`}>{todo.text}</span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="text-gray-300 hover:text-rose-500 p-1 rounded transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
