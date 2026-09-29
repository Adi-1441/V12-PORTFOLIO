import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreState } from './useCoreState';

interface SignalFieldProps {
  coreState: CoreState;
  overdrive?: boolean;
}

export function SignalField({ coreState, overdrive = false }: SignalFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  // Device-tier responsive point count: ~700 on desktop, safe WebGL performance
  const pointCount = useMemo(() => {
    if (typeof window === 'undefined') return 600;
    return window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 500 : 750;
  }, []);

  // Generate spherical shell point coordinates
  const [positions, originalPositions, velocities] = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    const orig = new Float32Array(pointCount * 3);
    const vel = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.9 + Math.random() * 0.9; // Radial shell between 1.9 and 2.8

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

      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    return [pos, orig, vel];
  }, [pointCount]);

  // Buffer for procedural connecting lines
  const maxLines = 180;
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [maxLines]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const isMechanical = coreState === 'mechanical';
    const isFusion = coreState === 'fusion';
    const isNeural = coreState === 'neural';

    // Target opacity per state
    let targetPointOpacity = 0.12;
    let targetLineOpacity = 0.0;
    let driftSpeed = 0.4;

    if (isFusion) {
      targetPointOpacity = 0.65;
      targetLineOpacity = 0.35;
      driftSpeed = 0.8;
    } else if (isNeural) {
      targetPointOpacity = 0.95;
      targetLineOpacity = 0.70;
      driftSpeed = 1.4;
    }

    if (overdrive) {
      targetPointOpacity = 1.0;
      targetLineOpacity = 0.9;
      driftSpeed = 2.2;
    }

    // Points material lerp
    const pointsMat = pointsRef.current.material as THREE.PointsMaterial;
    pointsMat.opacity = THREE.MathUtils.lerp(pointsMat.opacity, targetPointOpacity, 0.08);

    // Subtle drift update
    const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < pointCount; i++) {
      const idx = i * 3;
      const wobble = Math.sin(time * driftSpeed + i) * 0.003;
      currentPositions[idx] = originalPositions[idx] + wobble + velocities[idx] * (time % 20);
      currentPositions[idx + 1] = originalPositions[idx + 1] + wobble + velocities[idx + 1] * (time % 20);
      currentPositions[idx + 2] = originalPositions[idx + 2] + wobble + velocities[idx + 2] * (time % 20);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Procedural line connection calculation when in Fusion or Neural state
    if (linesRef.current && (isFusion || isNeural || overdrive)) {
      const lineMat = linesRef.current.material as THREE.LineBasicMaterial;
      lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, targetLineOpacity, 0.08);

      let lineVertexIdx = 0;
      const thresholdSq = (isNeural || overdrive ? 0.65 : 0.45) ** 2;

      // Sample subset of nearby points to connect
      const sampleStride = isNeural ? 2 : 4;
      for (let i = 0; i < pointCount && lineVertexIdx < maxLines * 6; i += sampleStride) {
        const x1 = currentPositions[i * 3];
        const y1 = currentPositions[i * 3 + 1];
        const z1 = currentPositions[i * 3 + 2];

        for (let j = i + 1; j < Math.min(i + 14, pointCount) && lineVertexIdx < maxLines * 6; j++) {
          const dx = x1 - currentPositions[j * 3];
          const dy = y1 - currentPositions[j * 3 + 1];
          const dz = z1 - currentPositions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < thresholdSq) {
            linePositions[lineVertexIdx++] = x1;
            linePositions[lineVertexIdx++] = y1;
            linePositions[lineVertexIdx++] = z1;
            linePositions[lineVertexIdx++] = currentPositions[j * 3];
            linePositions[lineVertexIdx++] = currentPositions[j * 3 + 1];
            linePositions[lineVertexIdx++] = currentPositions[j * 3 + 2];
          }
        }
      }

      // Zero out unused line vertices
      for (let k = lineVertexIdx; k < maxLines * 6; k++) {
        linePositions[k] = 0;
      }

      linesRef.current.geometry.attributes.position.needsUpdate = true;
    } else if (linesRef.current) {
      const lineMat = linesRef.current.material as THREE.LineBasicMaterial;
      lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, 0.0, 0.1);
    }
  });

  return (
    <group>
      {/* ─── Instanced Points Particle Cloud ─── */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color={overdrive ? '#FF3366' : '#A855F7'}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ─── Procedural Synapse Lines ─── */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={coreState === 'neural' ? '#E879F9' : '#A855F7'}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
