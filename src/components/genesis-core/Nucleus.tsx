import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreState, CoreView, CoreMaterialType } from './useCoreState';

interface NucleusProps {
  coreState: CoreState;
  view: CoreView;
  materialType: CoreMaterialType;
  overdrive?: boolean;
  scaleProgress?: number;
}

const MATERIAL_PRESETS: Record<CoreMaterialType, { color: string; metalness: number; roughness: number }> = {
  copper: { color: '#D4844A', metalness: 0.92, roughness: 0.28 },
  titanium: { color: '#8F949D', metalness: 0.88, roughness: 0.35 },
  aluminum: { color: '#D2D6DC', metalness: 0.95, roughness: 0.22 },
  carbon: { color: '#25262B', metalness: 0.35, roughness: 0.45 },
};

export function Nucleus({ coreState, view, materialType, overdrive = false, scaleProgress = 1 }: NucleusProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.LineSegments>(null!);
  const pointsRef = useRef<THREE.Points>(null!);

  const targetMaterialProps = MATERIAL_PRESETS[materialType] || MATERIAL_PRESETS.copper;

  // Particle cloud for Neural dissolution
  const particleCount = 240;
  const [particlesPos, particlesOriginal] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const orig = new Float32Array(particleCount * 3);
    const radius = 0.55;
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * radius;
      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow independent nucleus tumbling
    const rotSpeed = overdrive ? 1.8 : 0.4;
    meshRef.current.rotation.x += delta * rotSpeed * 0.5;
    meshRef.current.rotation.y += delta * rotSpeed;

    // Exploded view offset
    const targetY = view === 'exploded' ? -0.8 : 0;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);

    // Dynamic state interpolation
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (mat) {
      const isNeural = coreState === 'neural';
      const isFusion = coreState === 'fusion';
      const isBlueprint = view === 'blueprint';

      // Opacity: solid in mechanical/fusion, dissolves toward zero in neural
      const targetOpacity = isNeural ? 0.05 : 1.0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
      mat.transparent = true;
      mat.wireframe = isBlueprint;

      // Color and emissive tint
      const baseCol = new THREE.Color(overdrive ? '#FF3366' : targetMaterialProps.color);
      mat.color.lerp(baseCol, 0.1);
      mat.metalness = THREE.MathUtils.lerp(mat.metalness, targetMaterialProps.metalness, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, targetMaterialProps.roughness, 0.1);

      const targetEmissive = isFusion 
        ? new THREE.Color('#A855F7').multiplyScalar(0.4) 
        : overdrive 
          ? new THREE.Color('#FF3366').multiplyScalar(0.6) 
          : new THREE.Color('#000000');
      mat.emissive.lerp(targetEmissive, 0.08);
    }

    // Neural particle cloud handling
    if (pointsRef.current) {
      pointsRef.current.rotation.copy(meshRef.current.rotation);
      pointsRef.current.position.copy(meshRef.current.position);
      const pointsMat = pointsRef.current.material as THREE.PointsMaterial;
      const targetPointOpacity = coreState === 'neural' ? (overdrive ? 1.0 : 0.85) : 0.0;
      pointsMat.opacity = THREE.MathUtils.lerp(pointsMat.opacity, targetPointOpacity, 0.1);
      pointsMat.transparent = true;

      // Gentle particle vibration in neural state
      if (coreState === 'neural' || overdrive) {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const time = state.clock.elapsedTime * 3;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          positions[idx] = particlesOriginal[idx] + Math.sin(time + i) * 0.03;
          positions[idx + 1] = particlesOriginal[idx + 1] + Math.cos(time + i * 1.3) * 0.03;
          positions[idx + 2] = particlesOriginal[idx + 2] + Math.sin(time + i * 0.7) * 0.03;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }

    // Wireframe overlay for circuit etching in Fusion
    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
      wireRef.current.position.copy(meshRef.current.position);
      const wireMat = wireRef.current.material as THREE.LineBasicMaterial;
      const targetWireOpacity = coreState === 'fusion' ? 0.75 : (view === 'blueprint' ? 0.9 : 0.08);
      wireMat.opacity = THREE.MathUtils.lerp(wireMat.opacity, targetWireOpacity, 0.08);
      wireMat.color.lerp(new THREE.Color(coreState === 'fusion' ? '#E879F9' : '#D4844A'), 0.08);
    }
  });

  return (
    <group scale={scaleProgress}>
      {/* Solid Faceted Dodecahedron Mesh */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.62, 0]} />
        <meshPhysicalMaterial
          color={targetMaterialProps.color}
          metalness={targetMaterialProps.metalness}
          roughness={targetMaterialProps.roughness}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          reflectivity={0.9}
        />
      </mesh>

      {/* Wireframe Geometric Edges (Circuit etching in Fusion, Blueprint lines) */}
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[new THREE.DodecahedronGeometry(0.625, 0)]} />
        <lineBasicMaterial color="#D4844A" transparent opacity={0.1} linewidth={1.5} />
      </lineSegments>

      {/* Neural Dissolution Point Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color={overdrive ? '#FF3366' : '#A855F7'}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
