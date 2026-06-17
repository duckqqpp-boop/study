// src/types.ts

export type StudyPurpose = '자격증 취득' | '학교 시험 준비' | '취업 준비' | '영어 공부' | '자기계발';

export type StudyField = 
  | '전기' | '전자' | '전자캐드' | '반도체 설비 보전' | '컴퓨터활용능력' | '한국사'
  | 'TOEIC' | 'OPIC'
  | '전기전자' | '전자회로' | 'C언어' | '아두이노' | 'PLC' | '로봇' | '반도체';

export interface UserInfo {
  name: string;
  nickname: string;
  purpose: StudyPurpose;
  field: StudyField;
  examDate: string;
  goal: string;
  level: '초급' | '중급' | '고급';
  dailyTime: '30분' | '1시간' | '2시간' | '3시간 이상';
}

export interface AvatarConfig {
  gender: 'male' | 'female';
  skinColor: string;
  eyeShape: string;
  expression: 'happy' | 'focused' | 'tired';
  hairStyle: string;
  clothStyle: 'hoodie' | 'student' | 'developer' | 'engineer' | 'expert';
}

export interface CharacterStats {
  level: number;
  exp: number;
  maxExp: number;
  hp: number; // 체력 (최대 100)
  focus: number; // 집중력
  willpower: number; // 의지
  knowledge: number; // 지식
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  day: number;
}

export interface WrongNote {
  id: string;
  subject: string;
  question: string;
  myAnswer: string;
  correctAnswer: string;
  reason: string;
  memo: string;
  stars: number; // 틀린 횟수
  correctStreak: number; // 연속 맞춘 횟수 (3회 시 삭제)
}

export interface AppState {
  isInitialized: boolean;
  step: number;
  userInfo: UserInfo | null;
  avatar: AvatarConfig | null;
  stats: CharacterStats;
  todos: TodoItem[];
  wrongNotes: WrongNote[];
  totalStudyTime: number; // 분 단위
  currentTab: 'home' | 'planner' | 'timer' | 'notes' | 'character';
}
