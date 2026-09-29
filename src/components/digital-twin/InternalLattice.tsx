import { useMemo } from 'react';
import * as THREE from 'three';
import type { DigitalTwinState } from './DigitalTwinTypes';

interface InternalLatticeProps {
  state: DigitalTwinState;
  explodedProgress: number;
}

export function InternalLattice({ state, explodedProgress }: InternalLatticeProps) {
  // Generate 8 radial kinematic truss struts connecting Core to Outer Gimbal
  const strutGeometries = useMemo(() => {
    const vectors = [
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(-0.5, 0.5, 0.5),
      new THREE.Vector3(0.5, -0.5, 0.5),
      new THREE.Vector3(-0.5, -0.5, 0.5),
      new THREE.Vector3(0.5, 0.5, -0.5),
      new THREE.Vector3(-0.5, 0.5, -0.5),
      new THREE.Vector3(0.5, -0.5, -0.5),
      new THREE.Vector3(-0.5, -0.5, -0.5),
    ];

    return vectors.map((dir) => {
      const start = dir.clone().multiplyScalar(0.7);
      const end = dir.clone().multiplyScalar(1.5);
      const curve = new THREE.LineCurve3(start, end);
      return new THREE.TubeGeometry(curve, 12, 0.022, 8, false);
    });
  }, []);

  const isWire = state === 'wireframe' || state === 'blueprint';
  const isXray = state === 'xray';
  const isAnalysis = state === 'analysis';
  const isBlueprint = state === 'blueprint';

  const strutColor = isBlueprint
    ? '#00D4FF'
    : isAnalysis
    ? '#10B981'
    : isXray
    ? '#38BDF8'
    : '#4A5568'; // Anodized gunmetal steel

  return (
    <group scale={1 + explodedProgress * 0.3}>
      {strutGeometries.map((geo, idx) => (
        <mesh key={idx} geometry={geo}>
          <meshPhysicalMaterial
            color={strutColor}
            metalness={0.85}
            roughness={0.3}
            transparent={isXray || isWire}
            opacity={isXray ? 0.35 : 0.9}
            wireframe={isWire}
          />
        </mesh>
      ))}

      {/* Spherical Rod End Joints */}
      {[
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [0.5, -0.5, 0.5],
        [-0.5, -0.5, 0.5],
        [0.5, 0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
        [-0.5, -0.5, -0.5],
      ].map((pt, i) => (
        <mesh key={i} position={pt.map((c) => c * 1.5) as [number, number, number]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color={isBlueprint ? '#00D4FF' : '#00D4FF'}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
