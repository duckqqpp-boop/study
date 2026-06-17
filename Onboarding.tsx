// src/components/Onboarding.tsx
import React, { useState } from 'react';
import { UserInfo, AvatarConfig, StudyPurpose, StudyField } from '../types';

interface OnboardingProps {
  step: number;
  setStep: (step: number) => void;
  onComplete: (info: UserInfo, avatar: AvatarConfig) => void;
}

export default function Onboarding({ step, setStep, onComplete }: OnboardingProps) {
  // 폼 상태 데이터
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [purpose, setPurpose] = useState<StudyPurpose>('자격증 취득');
  const [field, setField] = useState<StudyField>('전기');
  const [examDate, setExamDate] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState<'초급' | '중급' | '고급'>('초급');
  const [dailyTime, setDailyTime] = useState<'30분' | '1시간' | '2시간' | '3시간 이상'>('1시간');

  // 아바타 커스터마이징 상태
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [skinColor, setSkinColor] = useState('#FFD1A9');
  const [eyeShape, setEyeShape] = useState('둥근 눈');
  const [hairStyle, setHairStyle] = useState('짧은 머리');

  const handleFinish = () => {
    const userInfo: UserInfo = { name, nickname, purpose, field, examDate, goal, level, dailyTime };
    const avatar: AvatarConfig = { gender, skinColor, eyeShape, expression: 'happy', hairStyle, clothStyle: 'hoodie' };
    onComplete(userInfo, avatar);
  };

  // STEP 0: 최초 실행 화면 (요구사항 엄격 반영)
  if (step === 0) {
    return (
      <div className="flex justify-center bg-gray-50 min-h-screen items-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
          <div className="text-5xl mb-4 animate-bounce">🌱</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Study With AI</h1>
          <p className="text-sm font-semibold text-emerald-600 mb-6">AI와 함께 성장하는 나만의 공부 습관</p>
          <div className="bg-emerald-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed mb-8">
            AI 친구 스티(STDY)와 함께 개인 맞춤형 공부 계획을 만들고 나만의 아바타를 성장시켜보세요.
          </div>
          <button 
            onClick={() => setStep(1)} 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-md text-base"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen items-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">STEP {step} / 4</span>
          <div className="w-2/3 bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* STEP 1: 기본 정보 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">사용자 정보 입력</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">이름</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">닉네임</label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="공부마스터" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">공부 목적</label>
                <select value={purpose} onChange={e => setPurpose(e.target.value as StudyPurpose)} className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {['자격증 취득', '학교 시험 준비', '취업 준비', '영어 공부', '자기계발'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: 분야 선택 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">공부 분야 선택</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="font-semibold text-sm text-gray-700 border-b pb-1">⚡ 자격증 분야</div>
              <div className="grid grid-cols-2 gap-2">
                {['전기', '전자', '전자캐드', '반도체 설비 보전', '컴퓨터활용능력', '한국사'].map(f => (
                  <button key={f} onClick={() => setField(f as StudyField)} className={`p-3 text-sm rounded-xl border text-left transition-all ${field === f ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700' : 'border-gray-200 text-gray-600'}`}>{f}</button>
                ))}
              </div>
              <div className="font-semibold text-sm text-gray-700 border-b pb-1 pt-2">🇺🇸 어학 분야</div>
              <div className="grid grid-cols-2 gap-2">
                {['TOEIC', 'OPIC'].map(f => (
                  <button key={f} onClick={() => setField(f as StudyField)} className={`p-3 text-sm rounded-xl border text-left transition-all ${field === f ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700' : 'border-gray-200 text-gray-600'}`}>{f}</button>
                ))}
              </div>
              <div className="font-semibold text-sm text-gray-700 border-b pb-1 pt-2">🔬 전공 분야</div>
              <div className="grid grid-cols-2 gap-2">
                {['전기전자', '전자회로', 'C언어', '아두이노', 'PLC', '로봇', '반도체'].map(f => (
                  <button key={f} onClick={() => setField(f as StudyField)} className={`p-3 text-sm rounded-xl border text-left transition-all ${field === f ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700' : 'border-gray-200 text-gray-600'}`}>{f}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 목표 상세 수립 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">목표 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">시험 및 마감 날짜</label>
                <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">한 줄 목표</label>
                <input type="text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="예: 전기기능사 최종 합격!" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">현재 내 수준</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['초급', '중급', '고급'] as const).map(l => (
                    <button key={l} onClick={() => setLevel(l)} className={`p-2.5 text-sm rounded-xl border transition-all ${level === l ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700' : 'border-gray-200 text-gray-600'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">하루 목표 공부 시간</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['30분', '1시간', '2시간', '3시간 이상'] as const).map(t => (
                    <button key={t} onClick={() => setDailyTime(t)} className={`p-2.5 text-sm rounded-xl border transition-all ${dailyTime === t ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700' : 'border-gray-200 text-gray-600'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: 캐릭터 롤플레잉 아바타 생성 */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">나만의 미니 아바타 생성</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">성별 선택 (픽스)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setGender('male'); setHairStyle('짧은 머리'); }} className={`p-3 rounded-xl border text-base transition-all ${gender === 'male' ? 'border-emerald-500 bg-emerald-50 font-bold' : 'border-gray-100'}`}>👨 남자</button>
                  <button onClick={() => { setGender('female'); setHairStyle('단발'); }} className={`p-3 rounded-xl border text-base transition-all ${gender === 'female' ? 'border-emerald-500 bg-emerald-50 font-bold' : 'border-gray-100'}`}>👩 여자</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">피부색 톤</label>
                <div className="flex gap-3">
                  {['#FFD1A9', '#FCD0A1', '#E0A96D'].map(c => (
                    <button key={c} onClick={() => setSkinColor(c)} className={`w-8 h-8 rounded-full border-2 ${skinColor === c ? 'border-emerald-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">헤어 스타일</label>
                <div className="grid grid-cols-2 gap-2">
                  {gender === 'male' ? (
                    ['짧은 머리', '스포츠 머리', '자연스러운 스타일'].map(h => (
                      <button key={h} onClick={() => setHairStyle(h)} className={`p-2 text-xs rounded-lg border ${hairStyle === h ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'}`}>{h}</button>
                    ))
                  ) : (
                    ['단발', '긴 머리', '포니테일', '웨이브'].map(h => (
                      <button key={h} onClick={() => setHairStyle(h)} className={`p-2 text-xs rounded-lg border ${hairStyle === h ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'}`}>{h}</button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 내비게이션 버튼 구조 */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="w-1/3 bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all">이전</button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="flex-1 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-sm">다음 단계</button>
          ) : (
            <button onClick={handleFinish} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md">완성 및 월드 입장 🚀</button>
          )}
        </div>
      </div>
    </div>
  );
}
