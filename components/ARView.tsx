import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';

interface ARViewProps {
  objectName: string;
  onARReady?: (ready: boolean) => void;
  showAnimation?: boolean;
}

export default function ARView({ objectName, onARReady, showAnimation }: ARViewProps) {
  const [isReady, setIsReady] = useState(false);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const objectRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const onContextCreate = async (gl: WebGLRenderingContext) => {
    if (Platform.OS === 'web') return;

    try {
      // Initialize Three.js renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 3);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create simple objects based on objectName
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      switch (objectName) {
        case 'apple':
          geometry = new THREE.SphereGeometry(0.5, 32, 32);
          material = new THREE.MeshPhongMaterial({ color: 0xff4444 });
          break;
        case 'chair':
          geometry = new THREE.BoxGeometry(1, 1.5, 1);
          material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
          break;
        case 'book':
          geometry = new THREE.BoxGeometry(0.8, 1.2, 0.1);
          material = new THREE.MeshPhongMaterial({ color: 0x4444ff });
          break;
        case 'car':
          geometry = new THREE.BoxGeometry(2, 0.8, 1);
          material = new THREE.MeshPhongMaterial({ color: 0x444444 });
          break;
        case 'house':
          geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
          material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
          material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);
      objectRef.current = mesh;

      setIsReady(true);
      onARReady?.(true);

      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);

        if (objectRef.current) {
          // Gentle rotation
          objectRef.current.rotation.y += 0.01;

          // Animation for correct answers
          if (showAnimation) {
            const time = Date.now() * 0.005;
            objectRef.current.position.y = Math.sin(time) * 0.2;
            objectRef.current.rotation.x = Math.sin(time) * 0.1;
          }
        }

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      animate();
    } catch (error) {
      console.error('AR initialization error:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webText}>
          AR functionality available on mobile devices
        </Text>
        <Text style={styles.objectName}>
          Object: {objectName}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
      {!isReady && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>
            Initializing AR...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glView: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  webText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 16,
  },
  objectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1976D2',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});