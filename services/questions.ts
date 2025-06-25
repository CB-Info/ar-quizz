export interface Question {
  id: string;
  english: string;
  french: string;
  model: string;
  category: string;
}

export const questions: Question[] = [
  {
    id: '1',
    english: 'apple',
    french: 'pomme',
    model: 'apple',
    category: 'food',
  },
  {
    id: '2',
    english: 'chair',
    french: 'chaise',
    model: 'chair',
    category: 'furniture',
  },
  {
    id: '3',
    english: 'book',
    french: 'livre',
    model: 'book',
    category: 'object',
  },
  {
    id: '4',
    english: 'car',
    french: 'voiture',
    model: 'car',
    category: 'vehicle',
  },
  {
    id: '5',
    english: 'house',
    french: 'maison',
    model: 'house',
    category: 'building',
  },
  {
    id: '6',
    english: 'tree',
    french: 'arbre',
    model: 'tree',
    category: 'nature',
  },
  {
    id: '7',
    english: 'dog',
    french: 'chien',
    model: 'dog',
    category: 'animal',
  },
  {
    id: '8',
    english: 'cat',
    french: 'chat',
    model: 'cat',
    category: 'animal',
  },
  {
    id: '9',
    english: 'table',
    french: 'table',
    model: 'table',
    category: 'furniture',
  },
  {
    id: '10',
    english: 'phone',
    french: 'téléphone',
    model: 'phone',
    category: 'technology',
  },
];

export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter(q => q.category === category);
};