import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { History, Calendar, Trophy, TrendingUp, Trash2 } from 'lucide-react-native';
import { getQuizSessions, clearQuizHistory } from '@/services/storage';

interface QuizSession {
  date: string;
  total: number;
  correct: number;
  sourceLanguage: string;
  targetLanguage: string;
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedSessions = await getQuizSessions();
      setSessions(savedSessions);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearQuizHistory();
      setSessions([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getScoreColor = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    if (percentage >= 75) return '#4CAF50';
    if (percentage >= 50) return '#FF9800';
    return '#F44336';
  };

  const getAverageScore = () => {
    if (sessions.length === 0) return 0;
    const totalCorrect = sessions.reduce((sum, session) => sum + session.correct, 0);
    const totalQuestions = sessions.reduce((sum, session) => sum + session.total, 0);
    return Math.round((totalCorrect / totalQuestions) * 100);
  };

  const getTotalSessions = () => sessions.length;

  const getBestScore = () => {
    if (sessions.length === 0) return 0;
    return Math.max(...sessions.map(session => Math.round((session.correct / session.total) * 100)));
  };

  const renderSessionItem = (session: QuizSession, index: number) => (
    <View key={index} style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionDate}>
            {formatDate(session.date)}
          </Text>
          <Text style={styles.sessionLanguages}>
            {session.sourceLanguage} → {session.targetLanguage}
          </Text>
        </View>
        <View style={styles.sessionScore}>
          <Text
            style={[
              styles.scoreValue,
              { color: getScoreColor(session.correct, session.total) },
            ]}>
            {session.correct}/{session.total}
          </Text>
          <Text style={styles.scorePercentage}>
            {Math.round((session.correct / session.total) * 100)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${(session.correct / session.total) * 100}%`,
                backgroundColor: getScoreColor(session.correct, session.total),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement de l'historique...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1976D2', '#42A5F5']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <History size={48} color="#FFFFFF" />
          <Text style={styles.title}>Historique</Text>
          <Text style={styles.subtitle}>
            Vos performances passées
          </Text>
        </View>
      </LinearGradient>

      {sessions.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{getAverageScore()}%</Text>
            <Text style={styles.statLabel}>Moyenne</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={24} color="#FF9800" />
            <Text style={styles.statValue}>{getBestScore()}%</Text>
            <Text style={styles.statLabel}>Meilleur</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color="#1976D2" />
            <Text style={styles.statValue}>{getTotalSessions()}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <History size={64} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>Aucun quiz terminé</Text>
            <Text style={styles.emptySubtitle}>
              Commencez un quiz pour voir vos résultats ici
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Dernières sessions ({sessions.length})
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearHistory}
                activeOpacity={0.7}>
                <Trash2 size={16} color="#F44336" />
                <Text style={styles.clearButtonText}>Effacer</Text>
              </TouchableOpacity>
            </View>
            
            {sessions.map((session, index) => renderSessionItem(session, index))}
          </>
        )}
      </ScrollView>
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
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#424242',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFEBEE',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 4,
    fontWeight: '500',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  sessionLanguages: {
    fontSize: 14,
    color: '#757575',
  },
  sessionScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scorePercentage: {
    fontSize: 14,
    color: '#757575',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});