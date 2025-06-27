import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { ViroARSceneNavigator, ViroARScene, ViroARPlaneSelector, Viro3DObject, ViroAmbientLight } from '@reactvision/react-viro';
import { Camera as CameraIcon, Box } from 'lucide-react-native';

interface ARViewReactVisionProps {
  model: any;
  objectName: string;
  onARReady?: (ready: boolean) => void;
  showAnimation?: boolean;
}

function EmojiFallback({ objectName, showAnimation }: { objectName: string; showAnimation?: boolean }) {
  const getIcon = (name: string) => {
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

  const getColor = (name: string) => {
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
          <CameraIcon size={32} color="rgba(255,255,255,0.7)" />
          <Text style={styles.cameraText}>AR Simulation</Text>
        </View>
        <View style={[styles.objectContainer, showAnimation && styles.objectAnimated]}>
          <View style={[styles.object3D, { backgroundColor: getColor(objectName) }]}>
            <Text style={styles.objectEmoji}>{getIcon(objectName)}</Text>
          </View>
          <View style={styles.objectShadow} />
        </View>
        <View style={styles.arInstructions}>
          <Box size={20} color="rgba(255,255,255,0.8)" />
          <Text style={styles.instructionText}>Objet 3D: {objectName}</Text>
        </View>
      </View>
    </View>
  );
}

function ModelScene({ model, onARReady }: { model: any; onARReady?: () => void }) {
  return (
    <ViroARScene onTrackingUpdated={(state) => state === 'NORMAL' && onARReady?.() }>
      <ViroARPlaneSelector>
        <ViroAmbientLight color="#FFFFFF" />
        <Viro3DObject source={model} type="GLB" />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
}

export default function ARViewReactVision({ model, objectName, onARReady, showAnimation }: ARViewReactVisionProps) {
  if (Platform.OS === 'web') {
    return <EmojiFallback objectName={objectName} showAnimation={showAnimation} />;
  }

  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene: () => <ModelScene model={model} onARReady={() => onARReady?.(true)} /> }}
      style={{ flex: 1 }}
    />
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
});

