// src/components/TimerView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface TimerViewProps {
  addMinutes: (minutes: number) => void;
}

export default function TimerView({ addMinutes }: TimerViewProps) {
  const [mode, setMode] = useState<'pomodoro' | 'free'>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  
  // 뽀모도로 옵션 설정 상태
  const [pomoFocus, setPomoFocus] = useState(25);
  const [pomoBreak, setPomoBreak] = useState(5);
  const [isBreakStage, setIsBreakStage] = useState(false);

  // 시간 카운터 내부 상태값 (초 단위)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [freeSeconds, setFreeSeconds] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 모드 변환 시 리셋 유도
  useEffect(() => {
    stopTimer();
    if (mode === 'pomodoro') {
      setSecondsLeft(pomoFocus * 60);
      setIsBreakStage(false);
    } else {
      setFreeSeconds(0);
    }
  }, [mode, pomoFocus]);

  const startTimer = () => { if (!isRunning) setIsRunning(true); };
  const pauseTimer = () => { if (isRunning) setIsRunning(false); };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'pomodoro') {
          setSecondsLeft(prev => {
            if (prev <= 1) {
              // 뽀모도로 타임아웃 종료 연산
              stopTimer();
              if (!isBreakStage) {
                alert(`집중 완료! ${pomoFocus}분 공부 경험치가 정산됩니다.`);
                addMinutes(pomoFocus);
                setIsBreakStage(true);
                return pomoBreak * 60;
              } else {
                alert("휴식이 종료되었습니다. 다시 집중 세션을 시작하세요!");
                setIsBreakStage(false);
                return pomoFocus * 60;
              }
            }
            return prev - 1;
          });
        } else {
          setFreeSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode, isBreakStage, pomoFocus, pomoBreak]);

  // 자유 타이머 수동 세션 클리어 종료 정산 처리
  const handleFreeStop = () => {
    stopTimer();
    const earnedMins = Math.floor(freeSeconds / 60);
    if (earnedMins > 0) {
      addMinutes(earnedMins);
      alert(`자유 집중 종료! 총 ${earnedMins}분만큼의 경험치와 스탯이 강화됩니다.`);
    } else {
      alert("집중 시간이 1분을 경과하지 않아 정산 데이터가 누락되었습니다.");
    }
    setFreeSeconds(0);
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn flex flex-col items-center">
      {/* 듀얼 모드 토글 탭 리스트 */}
      <div className="w-full grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setMode('pomodoro')} className={`py-2 text-xs font-bold rounded-lg transition-all ${mode === 'pomodoro' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>뽀모도로 집중</button>
        <button onClick={() => setMode('free')} className={`py-2 text-xs font-bold rounded-lg transition-all ${mode === 'free' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>자유 집중 타이머</button>
      </div>

      {mode === 'pomodoro' && (
        <div className="w-full flex gap-2 text-xs justify-center bg-gray-50 p-2.5 rounded-xl border">
          <span className="text-gray-500 font-medium">집중:</span>
          <select value={pomoFocus} onChange={e => setPomoFocus(Number(e.target.value))} disabled={isRunning} className="bg-transparent font-bold text-emerald-700 focus:outline-none">
            {[25, 30, 50, 60].map(v => <option key={v} value={v}>{v}분</option>)}
          </select>
          <span className="text-gray-300 mx-1">|</span>
          <span className="text-gray-500 font-medium">휴식:</span>
          <select value={pomoBreak} onChange={e => setPomoBreak(Number(e.target.value))} disabled={isRunning} className="bg-transparent font-bold text-emerald-700 focus:outline-none">
            {[5, 10].map(v => <option key={v} value={v}>{v}분</option>)}
          </select>
        </div>
      )}

      {/* 원형 시각 그래픽 구조 패널 */}
      <div className="w-56 h-56 rounded-full border-[6px] border-emerald-500 flex flex-col items-center justify-center bg-white shadow-inner relative">
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
          {mode === 'pomodoro' ? (isBreakStage ? '☕ BREAK TIME' : '🎯 FOCUS STAGE') : '⚡ FREE FOCUS'}
        </div>
        <div className="text-4xl font-mono font-bold text-gray-800 tracking-tight">
          {mode === 'pomodoro' ? formatTime(secondsLeft) : formatTime(freeSeconds)}
        </div>
      </div>

      {/* 타이머 계통 제어 컨트롤러 피스 */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button onClick={startTimer} className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-md transition-all">
            <Play size={22} className="ml-1" />
          </button>
        ) : (
          <button onClick={pauseTimer} className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-md transition-all">
            <Pause size={22} />
          </button>
        )}
        
        {mode === 'free' && (
          <button onClick={handleFreeStop} className="w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md transition-all">
            <Square size={20} />
          </button>
        )}
        
        {mode === 'pomodoro' && (
          <button onClick={() => { stopTimer(); setSecondsLeft(pomoFocus * 60); setIsBreakStage(false); }} className="w-14 h-14 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full flex items-center justify-center shadow-sm transition-all">
            <RotateCcw size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
