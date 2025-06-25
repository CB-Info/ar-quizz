import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer?: string;
}

export default function Feedback({ isCorrect, correctAnswer }: FeedbackProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after delay
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const gradientColors = isCorrect 
    ? ['#4CAF50', '#66BB6A'] 
    : ['#F44336', '#EF5350'];

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <LinearGradient
          colors={gradientColors}
          style={styles.content}>
          <View style={styles.iconContainer}>
            {isCorrect ? (
              <Check size={48} color="#FFFFFF" strokeWidth={3} />
            ) : (
              <X size={48} color="#FFFFFF" strokeWidth={3} />
            )}
          </View>
          
          <Text style={styles.message}>
            {isCorrect ? 'Correct !' : 'Incorrect'}
          </Text>
          
          {!isCorrect && correctAnswer && (
            <Text style={styles.correctAnswer}>
              Réponse: {correctAnswer}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  content: {
    paddingHorizontal: 48,
    paddingVertical: 32,
    alignItems: 'center',
    minWidth: 280,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
});