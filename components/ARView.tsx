import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Camera, Cube } from 'lucide-react-native';

interface ARViewProps {
  objectName: string;
  onARReady?: (ready: boolean) => void;
  showAnimation?: boolean;
}

export default function ARView({ objectName, onARReady, showAnimation }: ARViewProps) {
  const [isReady, setIsReady] = useState(true);

  React.useEffect(() => {
    // Simulate AR initialization
    const timer = setTimeout(() => {
      setIsReady(true);
      onARReady?.(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onARReady]);

  const getObjectIcon = (name: string) => {
    switch (name) {
      case 'apple':
        return '🍎';
      case 'chair':
        return '🪑';
      case 'book':
        return '📚';
      case 'car':
        return '🚗';
      case 'house':
        return '🏠';
      case 'tree':
        return '🌳';
      case 'dog':
        return '🐕';
      case 'cat':
        return '🐱';
      case 'table':
        return '🪑';
      case 'phone':
        return '📱';
      default:
        return '📦';
    }
  };

  const getObjectColor = (name: string) => {
    switch (name) {
      case 'apple':
        return '#FF4444';
      case 'chair':
        return '#8B4513';
      case 'book':
        return '#4444FF';
      case 'car':
        return '#444444';
      case 'house':
        return '#8B4513';
      case 'tree':
        return '#228B22';
      case 'dog':
        return '#D2691E';
      case 'cat':
        return '#696969';
      case 'table':
        return '#8B4513';
      case 'phone':
        return '#000000';
      default:
        return '#1976D2';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.arSimulation}>
        <View style={styles.cameraOverlay}>
          <Camera size={32} color="rgba(255,255,255,0.7)" />
          <Text style={styles.cameraText}>AR Simulation</Text>
        </View>
        
        <View style={[
          styles.objectContainer,
          showAnimation && styles.objectAnimated
        ]}>
          <View style={[
            styles.object3D,
            { backgroundColor: getObjectColor(objectName) }
          ]}>
            <Text style={styles.objectEmoji}>
              {getObjectIcon(objectName)}
            </Text>
          </View>
          <View style={styles.objectShadow} />
        </View>

        <View style={styles.arInstructions}>
          <Cube size={20} color="rgba(255,255,255,0.8)" />
          <Text style={styles.instructionText}>
            Objet 3D: {objectName}
          </Text>
        </View>
      </View>

      {!isReady && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>
            Initialisation AR...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  arSimulation: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cameraText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  objectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  objectAnimated: {
    transform: [{ scale: 1.1 }],
  },
  object3D: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 20,
  },
  objectEmoji: {
    fontSize: 48,
  },
  objectShadow: {
    width: 80,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
    marginTop: -10,
  },
  arInstructions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});