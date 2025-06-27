export interface Question {
  id: string;
  english: string;
  french: string;
  model: any;
  category: string;
}

export const questions: Question[] = [
  {
    id: '1',
    english: 'apple',
    french: 'pomme',
    model: require('../assets/models/apple.glb'),
    category: 'food',
  },
  {
    id: '2',
    english: 'chair',
    french: 'chaise',
    model: require('../assets/models/chair.glb'),
    category: 'furniture',
  },
  {
    id: '3',
    english: 'book',
    french: 'livre',
    model: require('../assets/models/book.glb'),
    category: 'object',
  },
  {
    id: '4',
    english: 'car',
    french: 'voiture',
    model: require('../assets/models/car.glb'),
    category: 'vehicle',
  },
  {
    id: '5',
    english: 'house',
    french: 'maison',
    model: require('../assets/models/house.glb'),
    category: 'building',
  },
  {
    id: '6',
    english: 'tree',
    french: 'arbre',
    model: require('../assets/models/tree.glb'),
    category: 'nature',
  },
  {
    id: '7',
    english: 'dog',
    french: 'chien',
    model: require('../assets/models/dog.glb'),
    category: 'animal',
  },
  {
    id: '8',
    english: 'cat',
    french: 'chat',
    model: require('../assets/models/cat.glb'),
    category: 'animal',
  },
  {
    id: '9',
    english: 'table',
    french: 'table',
    model: require('../assets/models/table.glb'),
    category: 'furniture',
  },
  {
    id: '10',
    english: 'phone',
    french: 'téléphone',
    model: require('../assets/models/phone.glb'),
    category: 'technology',
  },
];

export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter((q) => q.category === category);
};
