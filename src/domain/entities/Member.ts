export type Gender = 'male' | 'female';

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface Member {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  mbti: MBTIType;
  occupation: string;
  interests: string[];
  bio?: string;
  expectations?: string;
  createdAt: string;
}
