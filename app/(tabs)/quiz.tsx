import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X, RotateCcw, Camera } from 'lucide-react-native';
import ARView from '@/components/ARView';
import Feedback from '@/components/Feedback';
import { questions } from '@/services/questions';
import { saveQuizSession } from '@/services/storage';

export default function QuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const sourceLanguage = params.sourceLanguage as string;
  const targetLanguage = params.targetLanguage as string;
  const questionCount = parseInt(params.questionCount as string);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [arReady, setArReady] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Array<any>>([]);

  useEffect(() => {
    // Generate random questions for the quiz
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);
    setQuizQuestions(selected);
  }, [questionCount]);

  const handleAnswer = () => {
    if (!userAnswer.trim()) return;

    const question = quizQuestions[currentQuestion];
    const correctAnswer = sourceLanguage === 'EN' 
      ? question.french.toLowerCase() 
      : question.english.toLowerCase();
    
    const userAnswerNormalized = userAnswer.trim().toLowerCase();
    const correct = correctAnswer === userAnswerNormalized;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    // Hide feedback after 2 seconds and move to next question
    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer('');
      
      if (currentQuestion + 1 >= questionCount) {
        // Quiz finished
        handleQuizComplete();
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 2000);
  };

  const handleQuizComplete = async () => {
    const sessionData = {
      date: new Date().toISOString(),
      total: questionCount,
      correct: score + (isCorrect ? 1 : 0),
      sourceLanguage,
      targetLanguage,
    };

    await saveQuizSession(sessionData);
    
    router.push({
      pathname: '/results',
      params: {
        score: (score + (isCorrect ? 1 : 0)).toString(),
        total: questionCount.toString(),
      },
    });
  };

  if (quizQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Préparation du quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestionData = quizQuestions[currentQuestion];
  const questionText = sourceLanguage === 'EN' 
    ? `Traduisez en français: ${currentQuestionData.english}`
    : `Translate to English: ${currentQuestionData.french}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1976D2', '#42A5F5']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.questionCounter}>
            Question {currentQuestion + 1}/{questionCount}
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / questionCount) * 100}%` }
            ]} 
          />
        </View>
      </LinearGradient>

      {/* AR View */}
      <View style={styles.arContainer}>
        {Platform.OS === 'web' ? (
          <View style={styles.webFallback}>
            <Camera size={64} color="#1976D2" />
            <Text style={styles.webFallbackText}>
              Fonctionnalité AR disponible sur mobile
            </Text>
            <Text style={styles.objectName}>
              Objet: {currentQuestionData.english}
            </Text>
          </View>
        ) : (
          <ARView
            model={currentQuestionData.model}
            objectName={currentQuestionData.english}
            onARReady={setArReady}
            showAnimation={showFeedback && isCorrect}
          />
        )}
        
        {!arReady && Platform.OS !== 'web' && (
          <View style={styles.arInstructions}>
            <Text style={styles.instructionText}>
              Scannez une surface plane pour placer l'objet
            </Text>
          </View>
        )}
      </View>

      {/* Question and Input */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{questionText}</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Tapez votre réponse..."
            placeholderTextColor="#9E9E9E"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleAnswer}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              !userAnswer.trim() && styles.submitButtonDisabled,
            ]}
            onPress={handleAnswer}
            disabled={!userAnswer.trim()}
            activeOpacity={0.8}>
            <Check size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feedback Overlay */}
      {showFeedback && (
        <Feedback 
          isCorrect={isCorrect}
          correctAnswer={sourceLanguage === 'EN' ? currentQuestionData.french : currentQuestionData.english}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#424242',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionCounter: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E3F2FD',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  arContainer: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  webFallbackText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
    textAlign: 'center',
  },
  objectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1976D2',
    marginTop: 24,
  },
  arInstructions: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 8,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginTop: -20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});