import AsyncStorage from '@react-native-async-storage/async-storage';

const QUIZ_SESSIONS_KEY = '@ARQuizLangues/sessions';

export interface QuizSession {
  date: string;
  total: number;
  correct: number;
  sourceLanguage: string;
  targetLanguage: string;
}

export const saveQuizSession = async (session: QuizSession): Promise<void> => {
  try {
    const existingSessions = await getQuizSessions();
    const updatedSessions = [session, ...existingSessions];
    
    // Keep only the last 50 sessions
    const limitedSessions = updatedSessions.slice(0, 50);
    
    await AsyncStorage.setItem(QUIZ_SESSIONS_KEY, JSON.stringify(limitedSessions));
  } catch (error) {
    console.error('Error saving quiz session:', error);
    throw error;
  }
};

export const getQuizSessions = async (): Promise<QuizSession[]> => {
  try {
    const sessionsData = await AsyncStorage.getItem(QUIZ_SESSIONS_KEY);
    if (sessionsData) {
      return JSON.parse(sessionsData);
    }
    return [];
  } catch (error) {
    console.error('Error getting quiz sessions:', error);
    return [];
  }
};

export const clearQuizHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(QUIZ_SESSIONS_KEY);
  } catch (error) {
    console.error('Error clearing quiz history:', error);
    throw error;
  }
};

export const getQuizStats = async () => {
  try {
    const sessions = await getQuizSessions();
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0,
        totalCorrect: 0,
      };
    }

    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce((sum, session) => sum + session.total, 0);
    const totalCorrect = sessions.reduce((sum, session) => sum + session.correct, 0);
    const averageScore = Math.round((totalCorrect / totalQuestions) * 100);
    const bestScore = Math.max(...sessions.map(session => 
      Math.round((session.correct / session.total) * 100)
    ));

    return {
      totalSessions,
      averageScore,
      bestScore,
      totalQuestions,
      totalCorrect,
    };
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    return {
      totalSessions: 0,
      averageScore: 0,
      bestScore: 0,
      totalQuestions: 0,
      totalCorrect: 0,
    };
  }
};