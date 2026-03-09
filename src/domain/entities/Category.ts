export type CategoryType = 'interest' | 'occupation' | 'mbti' | 'custom';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  values: string[];
}
