import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCoreState } from './useCoreState';
import { Nucleus } from './Nucleus';
import { GyroRings } from './GyroRings';
import { SignalField } from './SignalField';
import { Conduits } from './Conduits';

interface GenesisCoreProps {
  pointerPos?: { x: number; y: number };
}

export function GenesisCore({ pointerPos = { x: 0, y: 0 } }: GenesisCoreProps) {
  const group = useRef<THREE.Group>(null!);
  const targetTilt = useRef({ x: 0, y: 0 });
  const { state, view, material, overdrive, bootProgress, isBooting, cycleState, skipBoot } = useCoreState();

  // Pointer position clamped to +/- 8 degrees (in radians: ~0.14 rad)
  useEffect(() => {
    targetTilt.current = {
      x: pointerPos.x * 0.14,
      y: -pointerPos.y * 0.14,
    };
  }, [pointerPos]);

  // Time of day lighting color tint calculation (Bonus Feature 4)
  const hour = new Date().getHours();
  // Warm tint (11:00 - 16:00), Cool tint (20:00 - 05:00)
  const isNight = hour >= 20 || hour < 6;
  const keyLightColor = isNight ? '#8FA3D4' : '#FFE8D6';

  useFrame((three, delta) => {
    if (!group.current) return;

    // Idle overall rotation (~24s per revolution)
    const baseRotSpeed = overdrive ? 1.8 : 1.0;
    group.current.rotation.y += delta * ((Math.PI * 2) / 24) * baseRotSpeed;

    // Organic breathing pulse: 1.00 -> 1.02 over 4s
    const breathe = 1 + Math.sin(three.clock.elapsedTime * (Math.PI / 2)) * 0.02;

    // Boot scale multiplier (scales in from 0 during boot)
    const bootScale = Math.min(1, Math.max(0.001, bootProgress));
    group.current.scale.setScalar(breathe * bootScale);

    // Damped cursor tilt (lerp factor 0.08)
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetTilt.current.y,
      0.08
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetTilt.current.x,
      0.08
    );
  });

  const handlePointerDown = () => {
    if (isBooting) {
      skipBoot();
      return;
    }
    cycleState();
  };

  return (
    <group ref={group} onPointerDown={handlePointerDown}>
      {/* Dynamic Lighting System */}
      <ambientLight intensity={overdrive ? 1.2 : 0.8} />
      <directionalLight position={[6, 8, 6]} intensity={1.8} color={keyLightColor} />
      <pointLight position={[-5, -4, -4]} intensity={0.9} color={state === 'neural' ? '#A855F7' : '#D4844A'} />
      <pointLight position={[0, 0, 0]} intensity={state === 'fusion' ? 1.5 : 0.4} color="#E879F9" />

      {/* Layer 1: The Nucleus */}
      <Nucleus
        coreState={state}
        view={view}
        materialType={material}
        overdrive={overdrive}
        scaleProgress={Math.min(1, bootProgress * 1.2)}
      />

      {/* Layer 2: The Gyro-Rings */}
      <GyroRings
        coreState={state}
        view={view}
        materialType={material}
        overdrive={overdrive}
        bootProgress={bootProgress}
      />

      {/* Layer 3: The Signal Field */}
      <SignalField coreState={state} overdrive={overdrive} />

      {/* Layer 4: The Conduits */}
      <Conduits coreState={state} overdrive={overdrive} />
    </group>
  );
}
