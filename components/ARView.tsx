import React, { useEffect, useState, Suspense } from 'react';
import { View, Text, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Camera as CameraIcon, Box } from 'lucide-react-native';
import { Canvas, useLoader } from '@react-three/fiber/native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';

interface ARViewProps {
  model: any;
  objectName: string;
  onARReady?: (ready: boolean) => void;
  showAnimation?: boolean;
  style?: StyleProp<ViewStyle>;
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

function Model({ model }: { model: any }) {
  const asset = Asset.fromModule(model);
  const gltf = useLoader(GLTFLoader, asset.uri || asset.localUri || '');
  return <primitive object={gltf.scene} scale={0.2} position={[0, 0, -1]} />;
}

export default function ARView({ model, objectName, onARReady, showAnimation, style }: ARViewProps) {
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    if (device) onARReady?.(true);
  }, [device, onARReady]);

  if (Platform.OS === 'web') {
    return <EmojiFallback objectName={objectName} showAnimation={showAnimation} />;
  }

  if (!device) {
    return <View style={[{ flex: 1, backgroundColor: '#000' }, style]} />;
  }

  return (
    <View style={[{ flex: 1 }, style]}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive />
      <Canvas style={StyleSheet.absoluteFill} onCreated={() => onARReady?.(true)}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model model={model} />
        </Suspense>
      </Canvas>
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
});
