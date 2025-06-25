import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react-native';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const score = parseInt(params.score as string);
  const total = parseInt(params.total as string);
  const percentage = Math.round((score / total) * 100);

  const getResultMessage = () => {
    if (percentage >= 90) return 'Excellent !';
    if (percentage >= 75) return 'Très bien !';
    if (percentage >= 60) return 'Bien joué !';
    if (percentage >= 40) return 'Pas mal !';
    return 'Continuez à vous entraîner !';
  };

  const getResultColor = () => {
    if (percentage >= 75) return '#4CAF50';
    if (percentage >= 50) return '#FF9800';
    return '#F44336';
  };

  const renderStars = () => {
    const stars = [];
    const starCount = Math.ceil((percentage / 100) * 5);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={32}
          color={i < starCount ? '#FFD700' : '#E0E0E0'}
          fill={i < starCount ? '#FFD700' : 'transparent'}
        />
      );
    }
    
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1976D2', '#42A5F5']}
        style={styles.header}>
        <Trophy size={64} color="#FFFFFF" />
        <Text style={styles.title}>Quiz Terminé !</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreText, { color: getResultColor() }]}>
              {score}/{total}
            </Text>
            <Text style={styles.percentageText}>
              {percentage}%
            </Text>
          </View>
          
          <Text style={[styles.resultMessage, { color: getResultColor() }]}>
            {getResultMessage()}
          </Text>
          
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Bonnes réponses</Text>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {score}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Mauvaises réponses</Text>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              {total - score}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Précision</Text>
            <Text style={styles.statValue}>
              {percentage}%
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}>
            <Home size={20} color="#1976D2" />
            <Text style={styles.secondaryButtonText}>Accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.primaryButtonGradient}>
              <RotateCcw size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Rejouer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 4,
  },
  resultMessage: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1976D2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});