// src/components/NotesView.tsx
import React, { useState } from 'react';
import { WrongNote } from '../types';
import { Plus, Star, Award, AlertTriangle } from 'lucide-react';

interface NotesViewProps {
  wrongNotes: WrongNote[];
  addWrongNote: (note: Omit<WrongNote, 'id' | 'stars' | 'correctStreak'>) => void;
  answerQuiz: (id: string, isCorrect: boolean) => void;
}

export default function NotesView({ wrongNotes, addWrongNote, answerQuiz }: NotesViewProps) {
  const [activeSubject, setActiveSubject] = useState('전기');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // 폼 필드 상태
  const [question, setQuestion] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [reason, setReason] = useState('');
  const [memo, setMemo] = useState('');

  const filteredNotes = wrongNotes.filter(n => n.subject === activeSubject);
  const isQuizAvailable = filteredNotes.length >= 25; // 요구사항: 오답 25개 이상 시 퀴즈 활성화

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    addWrongNote({ subject: activeSubject, question, myAnswer, correctAnswer, reason, memo });
    setIsModalOpen(false);
    setQuestion(''); setMyAnswer(''); setCorrectAnswer(''); setReason(''); setMemo('');
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    const targetProblem = filteredNotes[currentQuizIndex];
    answerQuiz(targetProblem.id, isCorrect);
    
    if (currentQuizIndex < filteredNotes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      alert("AI 무작위 오답 세션이 끝났습니다. 오답 데이터 현황이 갱신되었습니다!");
      setIsQuizMode(false);
      setCurrentQuizIndex(0);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 과목 수평 스크롤 탭 필터 바 */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['전기', '전자', '전자캐드', '반도체', '컴퓨터활용', '한국사', 'TOEIC', 'OPIC'].map(sub => (
          <button key={sub} onClick={() => { setActiveSubject(sub); setIsQuizMode(false); }} className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 ${activeSubject === sub ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{sub}</button>
        ))}
      </div>

      {/* AI 복습 퀴즈 모드 전환 분기 */}
      {isQuizMode && filteredNotes.length > 0 ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-700">🧠 AI 복습 랜덤 퀴즈 진행중</span>
            <button onClick={() => setIsQuizMode(false)} className="text-xs text-gray-400 underline">나가기</button>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-inner">
            <div className="text-[10px] text-indigo-400 font-bold mb-1">QUESTION</div>
            <p className="text-xs font-bold text-gray-800">{filteredNotes[currentQuizIndex]?.question}</p>
          </div>

          <div className="space-y-2 text-xs bg-white/60 p-3 rounded-xl border border-dashed">
            <div><span className="font-semibold text-gray-500">작성했던 오답:</span> {filteredNotes[currentQuizIndex]?.myAnswer}</div>
            <div><span className="font-semibold text-emerald-600">등록된 정답:</span> {filteredNotes[currentQuizIndex]?.correctAnswer}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => handleQuizAnswer(false)} className="bg-rose-500 text-white text-xs font-bold py-3 rounded-xl shadow-sm">틀렸습니다 ❌</button>
            <button onClick={() => handleQuizAnswer(true)} className="bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl shadow-sm">맞았습니다 ⭕</button>
          </div>
        </div>
      ) : (
        <>
          {/* 오답노트 제어 대시 영역 */}
          <div className="bg-white p-4 rounded-2xl border flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-gray-800">{activeSubject} 오답 저장고</h3>
              <p className="text-[11px] text-gray-400 font-medium">현재 쌓인 오답 개수: <span className="text-emerald-600 font-bold">{filteredNotes.length}개</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-all"><Plus size={16} /></button>
            </div>
          </div>

          {/* AI 퀴즈 활성화 트리거 알림판 */}
          {isQuizAvailable ? (
            <button onClick={() => { setIsQuizMode(true); setCurrentQuizIndex(0); }} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all">
              <Award size={16} /> AI 복습 퀴즈 인스턴스 전격 활성화! (터치해 시작)
            </button>
          ) : (
            <div className="bg-gray-50 text-gray-400 p-3 rounded-xl text-[11px] text-center font-medium border border-dashed">
              💡 해당 과목의 오답 문항이 <span className="font-bold text-gray-600">25개 이상</span> 쌓이면 AI 무작위 복습 퀴즈 인스턴스가 활성화됩니다. ({filteredNotes.length}/25)
            </div>
          )}

          {/* 오답 리스트 실시간 카드 뷰 카드 그리드 */}
          <div className="space-y-3">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2 relative">
                {/* 요구사항: 누적 오답 5회 이상 시 스티의 시스템 경고 피드백 */}
                {note.stars >= 5 && (
                  <div className="bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-start gap-1.5 mb-2">
                    <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-rose-700 leading-normal">
                      <span className="font-bold">스티 코치:</span> "이 문제는 아직 어려운 것 같아요. 다시 복습해볼까요?" (캐릭터 체력 패널티 부여됨)
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-gray-800 pr-4">{note.question}</h4>
                  <div className="flex gap-0.5 text-amber-400 shrink-0">
                    {Array.from({ length: Math.min(5, note.stars || 1) }).map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <div className="text-[11px] space-y-1 bg-gray-50 p-2.5 rounded-lg border">
                  <div><span className="font-semibold text-rose-500">내 대답:</span> {note.myAnswer}</div>
                  <div><span className="font-semibold text-emerald-600">올바른 정답:</span> {note.correctAnswer}</div>
                  <div className="text-gray-500 border-t pt-1 mt-1"><span className="font-semibold text-gray-700">틀린 메커니즘 분석:</span> {note.reason}</div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5">
                  <span>연속 정답 스택: <span className="text-emerald-600 font-bold">{note.correctStreak}/3</span></span>
                  {note.memo && <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{note.memo}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 수동 오답노트 등록 모달 시트 기믹 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 space-y-4 animate-scaleUp">
            <h3 className="font-bold text-sm text-gray-800">[{activeSubject}] 신규 오답 등록</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <input type="text" placeholder="문제를 입력하세요..." value={question} onChange={e => setQuestion(e.target.value)} required className="w-full p-2.5 text-xs border rounded-xl" />
              <input type="text" placeholder="내가 작성한 오답..." value={myAnswer} onChange={e => setMyAnswer(e.target.value)} required className="w-full p-2.5 text-xs border rounded-xl" />
              <input type="text" placeholder="정확한 정답..." value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} required className="w-full p-2.5 text-xs border rounded-xl" />
              <textarea placeholder="틀린 구체적인 원인 분석..." value={reason} onChange={e => setReason(e.target.value)} required className="w-full p-2.5 text-xs border rounded-xl h-16 resize-none" />
              <input type="text" placeholder="추가 암기 메모 피스 (선택)..." value={memo} onChange={e => setMemo(e.target.value)} className="w-full p-2.5 text-xs border rounded-xl" />
              
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 bg-gray-100 text-gray-600 text-xs font-semibold py-2.5 rounded-xl">취소</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm">오답 인덱싱 저장 📂</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
