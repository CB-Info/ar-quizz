import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Play, Globe, BookOpen } from 'lucide-react-native';

type Language = 'EN' | 'FR';
type QuestionCount = 5 | 10;

export default function HomeScreen() {
  const [sourceLanguage, setSourceLanguage] = useState<Language>('EN');
  const [targetLanguage, setTargetLanguage] = useState<Language>('FR');
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5);
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push({
      pathname: '/quiz',
      params: {
        sourceLanguage,
        targetLanguage,
        questionCount: questionCount.toString(),
      },
    });
  };

  const renderLanguageSelector = (
    title: string,
    value: Language,
    onChange: (lang: Language) => void
  ) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            value === 'EN' && styles.languageButtonActive,
          ]}
          onPress={() => onChange('EN')}>
          <Text
            style={[
              styles.languageButtonText,
              value === 'EN' && styles.languageButtonTextActive,
            ]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            value === 'FR' && styles.languageButtonActive,
          ]}
          onPress={() => onChange('FR')}>
          <Text
            style={[
              styles.languageButtonText,
              value === 'FR' && styles.languageButtonTextActive,
            ]}>
            Français
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuestionCountSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Nombre de questions</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.countButton,
            questionCount === 5 && styles.countButtonActive,
          ]}
          onPress={() => setQuestionCount(5)}>
          <Text
            style={[
              styles.countButtonText,
              questionCount === 5 && styles.countButtonTextActive,
            ]}>
            5
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.countButton,
            questionCount === 10 && styles.countButtonActive,
          ]}
          onPress={() => setQuestionCount(10)}>
          <Text
            style={[
              styles.countButtonText,
              questionCount === 10 && styles.countButtonTextActive,
            ]}>
            10
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1976D2', '#42A5F5']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <BookOpen size={48} color="#FFFFFF" />
          <Text style={styles.title}>AR Quiz Langues</Text>
          <Text style={styles.subtitle}>
            Apprenez le vocabulaire en réalité augmentée
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderLanguageSelector(
          'Langue source',
          sourceLanguage,
          setSourceLanguage
        )}

        {renderLanguageSelector(
          'Langue cible',
          targetLanguage,
          setTargetLanguage
        )}

        {renderQuestionCountSelector()}

        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <Globe size={24} color="#1976D2" />
            <Text style={styles.featureText}>
              Objets 3D en réalité augmentée
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Play size={24} color="#1976D2" />
            <Text style={styles.featureText}>
              Feedback visuel et sonore instantané
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartQuiz}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            style={styles.startButtonGradient}>
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Commencer le Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  selectorContainer: {
    marginBottom: 32,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageButtonActive: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
  },
  languageButtonTextActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
  countButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countButtonActive: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  countButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#757575',
  },
  countButtonTextActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
  featureContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
});