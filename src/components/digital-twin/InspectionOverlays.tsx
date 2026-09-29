import * as THREE from 'three';
import type { DigitalTwinState } from './DigitalTwinTypes';

interface InspectionOverlaysProps {
  state: DigitalTwinState;
}

export function InspectionOverlays({ state }: InspectionOverlaysProps) {
  const isInspection = state === 'inspection';
  const isBlueprint = state === 'blueprint';

  if (!isInspection && !isBlueprint) return null;

  return (
    <group>
      {/* ─── Outer CAD Radius Dimension Ring ─── */}
      <lineSegments>
        <edgesGeometry args={[new THREE.RingGeometry(2.1, 2.11, 64)]} />
        <lineBasicMaterial
          color={isInspection ? '#F59E0B' : '#00D4FF'}
          transparent
          opacity={0.5}
        />
      </lineSegments>

      {/* ─── Orthogonal Alignment Crosshairs ─── */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -2.3, 0, 0,  2.3, 0, 0,
                0, -2.3, 0,  0, 2.3, 0,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isInspection ? '#F59E0B' : '#00D4FF'}
          transparent
          opacity={0.3}
        />
      </lineSegments>

      {/* ─── GD&T Target Reticles ─── */}
      {isInspection && (
        <group>
          {[
            [1.95, 0, 0],
            [-1.95, 0, 0],
            [0, 1.95, 0],
            [0, -1.95, 0],
          ].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <lineSegments>
                <edgesGeometry args={[new THREE.RingGeometry(0.12, 0.13, 16)]} />
                <lineBasicMaterial color="#F59E0B" />
              </lineSegments>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}
