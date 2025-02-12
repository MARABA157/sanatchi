export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: 'art' | 'animation' | 'style';
  tags: string[];
  createdAt: Date;
  userId: string;
}

export interface PromptVariable {
  name: string;
  defaultValue: string;
  description: string;
}