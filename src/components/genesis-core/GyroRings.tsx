import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreState, CoreView, CoreMaterialType } from './useCoreState';

interface GyroRingsProps {
  coreState: CoreState;
  view: CoreView;
  materialType: CoreMaterialType;
  overdrive?: boolean;
  bootProgress?: number;
}

const MATERIAL_PRESETS: Record<CoreMaterialType, { color: string; metalness: number; roughness: number }> = {
  copper: { color: '#D4844A', metalness: 0.90, roughness: 0.28 },
  titanium: { color: '#8F949D', metalness: 0.88, roughness: 0.35 },
  aluminum: { color: '#D2D6DC', metalness: 0.95, roughness: 0.22 },
  carbon: { color: '#25262B', metalness: 0.35, roughness: 0.45 },
};

export function GyroRings({
  coreState,
  view,
  materialType,
  overdrive = false,
  bootProgress = 1,
}: GyroRingsProps) {
  const ring1Ref = useRef<THREE.Group>(null!);
  const ring2Ref = useRef<THREE.Group>(null!);
  const ring3Ref = useRef<THREE.Group>(null!);

  const matProps = MATERIAL_PRESETS[materialType] || MATERIAL_PRESETS.copper;

  useFrame((_, delta) => {
    const mult = overdrive ? 2.5 : 1.0;

    // Independent authentic rotation periods: ~14s, 22s, 31s
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * ((Math.PI * 2) / 14) * mult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * ((Math.PI * 2) / 22) * mult;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * ((Math.PI * 2) / 31) * mult;
    }

    // Exploded view separation offsets
    const isExploded = view === 'exploded';
    const targetSeparation = isExploded ? 0.75 : 0;

    // Boot progress assembly lerp
    // When booting (progress < 1), rings fly in from offset positions
    const bootOffset = (1 - Math.min(bootProgress, 1)) * 4.0;

    if (ring1Ref.current) {
      ring1Ref.current.position.x = THREE.MathUtils.lerp(
        ring1Ref.current.position.x,
        (isExploded ? targetSeparation : 0) + bootOffset * 0.8,
        0.08
      );
    }
    if (ring2Ref.current) {
      ring2Ref.current.position.y = THREE.MathUtils.lerp(
        ring2Ref.current.position.y,
        (isExploded ? targetSeparation * 1.2 : 0) - bootOffset * 1.1,
        0.08
      );
    }
    if (ring3Ref.current) {
      ring3Ref.current.position.z = THREE.MathUtils.lerp(
        ring3Ref.current.position.z,
        (isExploded ? -targetSeparation : 0) + bootOffset * 0.9,
        0.08
      );
    }
  });

  const isBlueprint = view === 'blueprint';
  const isNeural = coreState === 'neural';
  const isFusion = coreState === 'fusion';

  // Target ring opacity and edge brightness
  const targetRingOpacity = isNeural ? 0.22 : 0.95;
  const edgeColor = isFusion ? '#E879F9' : (isBlueprint ? '#F2A65A' : '#D4844A');
  const edgeOpacity = isBlueprint ? 0.95 : (isFusion ? 0.85 : 0.35);

  return (
    <group>
      {/* ─── Ring 1 (Inner Armillary: Radius ~1.15) ─── */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.15, 0.045, 20, 64]} />
          <meshPhysicalMaterial
            color={matProps.color}
            metalness={matProps.metalness}
            roughness={matProps.roughness}
            transparent
            opacity={targetRingOpacity}
            wireframe={isBlueprint}
            clearcoat={0.4}
          />
        </mesh>
        {/* Machined edge highlight */}
        <lineSegments>
          <edgesGeometry args={[new THREE.TorusGeometry(1.15, 0.046, 12, 48)]} />
          <lineBasicMaterial
            color={edgeColor}
            transparent
            opacity={edgeOpacity}
            linewidth={1.2}
          />
        </lineSegments>
      </group>

      {/* ─── Ring 2 (Middle Armillary: Radius ~1.45) ─── */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[1.45, 0.05, 20, 72]} />
          <meshPhysicalMaterial
            color={matProps.color}
            metalness={matProps.metalness}
            roughness={matProps.roughness}
            transparent
            opacity={targetRingOpacity}
            wireframe={isBlueprint}
            clearcoat={0.4}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.TorusGeometry(1.45, 0.051, 12, 48)]} />
          <lineBasicMaterial
            color={edgeColor}
            transparent
            opacity={edgeOpacity}
            linewidth={1.2}
          />
        </lineSegments>
      </group>

      {/* ─── Ring 3 (Outer Armillary: Radius ~1.78) ─── */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[1.78, 0.055, 24, 80]} />
          <meshPhysicalMaterial
            color={matProps.color}
            metalness={matProps.metalness}
            roughness={matProps.roughness}
            transparent
            opacity={targetRingOpacity}
            wireframe={isBlueprint}
            clearcoat={0.4}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.TorusGeometry(1.78, 0.056, 14, 52)]} />
          <lineBasicMaterial
            color={edgeColor}
            transparent
            opacity={edgeOpacity}
            linewidth={1.2}
          />
        </lineSegments>
      </group>

      {/* ─── Blueprint Dimension Callouts (Visible in Blueprint mode) ─── */}
      {isBlueprint && (
        <group>
          {/* Dimension Ring Guide */}
          <lineSegments>
            <edgesGeometry args={[new THREE.RingGeometry(1.85, 1.86, 64)]} />
            <lineBasicMaterial color="#D4844A" transparent opacity={0.4} />
          </lineSegments>
        </group>
      )}
    </group>
  );
}
