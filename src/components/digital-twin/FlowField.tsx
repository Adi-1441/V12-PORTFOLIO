import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DigitalTwinState } from './DigitalTwinTypes';

interface FlowFieldProps {
  state: DigitalTwinState;
}

export function FlowField({ state }: FlowFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const pulsesRef = useRef<THREE.Group>(null!);

  const particleCount = 420;

  const [positions, initialPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const init = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.1 + Math.random() * 1.5;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return [pos, init, vel];
  }, [particleCount]);

  useFrame((clockState) => {
    if (!pointsRef.current) return;
    const time = clockState.clock.elapsedTime;

    const isFlow = state === 'flow';
    const isInspection = state === 'inspection';
    const isAnalysis = state === 'analysis';

    const targetOpacity = isFlow ? 0.95 : isInspection ? 0.75 : isAnalysis ? 0.6 : 0.25;
    const pMat = pointsRef.current.material as THREE.PointsMaterial;
    pMat.opacity = THREE.MathUtils.lerp(pMat.opacity, targetOpacity, 0.08);

    // Color adaptation
    const targetColor = isInspection
      ? new THREE.Color('#F59E0B')
      : isAnalysis
      ? new THREE.Color('#38BDF8')
      : new THREE.Color('#00D4FF');
    pMat.color.lerp(targetColor, 0.1);

    // Particle vector drift
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speed = isFlow ? 2.2 : 0.8;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      posArr[idx] = initialPositions[idx] + Math.sin(time * speed + i) * 0.04;
      posArr[idx + 1] = initialPositions[idx + 1] + Math.cos(time * speed + i * 1.2) * 0.04;
      posArr[idx + 2] = initialPositions[idx + 2] + Math.sin(time * speed + i * 0.7) * 0.04;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* ─── Instanced Vector Field Particles ─── */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color="#00D4FF"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ─── Computational Streamline Guides (Active in Flow mode) ─── */}
      {state === 'flow' && (
        <group ref={pulsesRef}>
          {[1.4, 1.8, 2.2].map((rad, i) => (
            <lineSegments key={i}>
              <edgesGeometry args={[new THREE.RingGeometry(rad, rad + 0.01, 48)]} />
              <lineBasicMaterial color="#00D4FF" transparent opacity={0.4} />
            </lineSegments>
          ))}
        </group>
      )}
    </group>
  );
}
