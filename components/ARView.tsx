import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GLView } from 'expo-gl';
import ExpoTHREE, { Renderer, AR } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Camera as CameraIcon, Box } from 'lucide-react-native';

interface ARViewProps {
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

export default function ARView({ model, objectName, onARReady, showAnimation }: ARViewProps) {
  const [ready, setReady] = useState(false);
  const requestRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();

  useEffect(() => {
    return () => {
      if (Platform.OS !== 'web') {
        AR.stopAsync();
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    await AR.startAsync(gl);
    AR.setPlaneDetection?.(AR.PlaneDetectionTypes?.Horizontal);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = ExpoTHREE?.AR?.createARCamera
      ? ExpoTHREE.AR.createARCamera(width, height, 0.01, 1000)
      : new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.matrixAutoUpdate = false;
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    const asset = Asset.fromModule(model);
    await asset.downloadAsync();
    const loader = new GLTFLoader();
    let obj: THREE.Object3D | null = null;
    try {
      const gltf = await loader.loadAsync(asset.localUri || '');
      obj = gltf.scene;
      obj.position.z = -0.5;
      obj.scale.set(0.2, 0.2, 0.2);
      scene.add(obj);
    } catch (e) {
      console.warn('Failed to load GLTF', e);
    }

    onARReady?.(true);
    setReady(true);

    const render = () => {
      const frame = AR.getCurrentFrame?.();
      if (frame?.camera) {
        const { transform, projectionMatrix } = frame.camera as any;
        if (transform) {
          camera.matrix.fromArray(transform);
          camera.updateMatrixWorld(true);
        }
        if ((camera as any).projectionMatrix && projectionMatrix) {
          (camera as any).projectionMatrix.fromArray(projectionMatrix);
        }
        if (obj && frame.anchors?.length && !obj.userData.placed) {
          const anchor: any = frame.anchors[0];
          if (anchor.center) {
            obj.position.set(anchor.center.x, anchor.center.y, anchor.center.z);
            obj.userData.placed = true;
          }
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderer.setAnimationLoop(render);
  };

  if (Platform.OS === 'web') {
    return <EmojiFallback objectName={objectName} showAnimation={showAnimation} />;
  }

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
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
