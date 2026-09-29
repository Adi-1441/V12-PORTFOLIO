import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   TURBINE SCENE — High-Fidelity 3D Engineering System
   Fullscreen Background Digital Twin with Multi-Stage
   Compressor, Stators, Combustor, Multi-Stage Turbines,
   Shaft, Bearings, and Dynamic Visual States:
   REALISTIC | WIREFRAME | X-RAY | BLUEPRINT | FLOW FIELD | EXPLODED | INSPECTION
   ═══════════════════════════════════════════════════════ */

export type TurbineState =
  | 'realistic'
  | 'wireframe'
  | 'xray'
  | 'blueprint'
  | 'flowfield'
  | 'exploded'
  | 'inspection';

interface TurbineSceneProps {
  accelerate?: boolean;
  visualState?: TurbineState;
}

// ─── Twisted Aerodynamic Airfoil Blade ───
function AirfoilBlade({
  angle,
  radius,
  length,
  rootWidth,
  tipWidth,
  twistAngle,
  camber,
  material,
}: {
  angle: number;
  radius: number;
  length: number;
  rootWidth: number;
  tipWidth: number;
  twistAngle: number;
  camber: number;
  material: THREE.Material;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    // Generate curved aerodynamic airfoil cross-section via custom geometry
    const geom = new THREE.BufferGeometry();
    const spanSteps = 4;
    const chordSteps = 6;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i <= spanSteps; i++) {
      const spanFrac = i / spanSteps;
      const currentRadius = radius + spanFrac * length;
      const currentWidth = THREE.MathUtils.lerp(rootWidth, tipWidth, spanFrac);
      const currentTwist = twistAngle * (1 - spanFrac * 0.4);

      for (let j = 0; j <= chordSteps; j++) {
        const chordFrac = (j / chordSteps - 0.5);
        // Cambered aerodynamic profile
        const x = chordFrac * currentWidth;
        const camberDisplace = Math.sin((j / chordSteps) * Math.PI) * camber * currentWidth;
        const z = camberDisplace;

        // Apply twist rotation around spanwise axis
        const cosT = Math.cos(currentTwist);
        const sinT = Math.sin(currentTwist);
        const twistedX = x * cosT - z * sinT;
        const twistedZ = x * sinT + z * cosT;

        vertices.push(twistedX, spanFrac * length, twistedZ);
        uvs.push(j / chordSteps, spanFrac);
      }
    }

    for (let i = 0; i < spanSteps; i++) {
      for (let j = 0; j < chordSteps; j++) {
        const a = i * (chordSteps + 1) + j;
        const b = (i + 1) * (chordSteps + 1) + j;
        const c = (i + 1) * (chordSteps + 1) + (j + 1);
        const d = i * (chordSteps + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [radius, length, rootWidth, tipWidth, twistAngle, camber]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
      rotation={[0, -angle + Math.PI / 2, Math.PI / 2]}
    />
  );
}

// ─── Rotor Stage with Blades & Machined Disc ───
function RotorStage({
  bladeCount,
  discRadius,
  bladeLength,
  rootWidth,
  tipWidth,
  twistAngle,
  camber = 0.12,
  speed,
  direction,
  zOffset,
  explodedOffset,
  material,
  discMaterial,
}: {
  bladeCount: number;
  discRadius: number;
  bladeLength: number;
  rootWidth: number;
  tipWidth: number;
  twistAngle: number;
  camber?: number;
  speed: number;
  direction: number;
  zOffset: number;
  explodedOffset: number;
  material: THREE.Material;
  discMaterial: THREE.Material;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * speed * direction;
    }
  });

  const angles = useMemo(() => {
    return Array.from({ length: bladeCount }, (_, i) => (i / bladeCount) * Math.PI * 2);
  }, [bladeCount]);

  return (
    <group position={[0, 0, zOffset + explodedOffset]}>
      <group ref={groupRef}>
        {/* Central Machined Rotor Disc with Beveled Rim */}
        <mesh material={discMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[discRadius, discRadius * 0.98, 0.08, 36]} />
        </mesh>
        {/* Dovetail Blade Lock Ring */}
        <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[discRadius, 0.018, 8, 36]} />
        </mesh>

        {/* Aerodynamic Blades */}
        {angles.map((ang, i) => (
          <AirfoilBlade
            key={i}
            angle={ang}
            radius={discRadius}
            length={bladeLength}
            rootWidth={rootWidth}
            tipWidth={tipWidth}
            twistAngle={twistAngle}
            camber={camber}
            material={material}
          />
        ))}
      </group>
    </group>
  );
}

// ─── Stator Guide Vanes (Stationary Swirl Control) ───
function StatorStage({
  vaneCount,
  innerRadius,
  outerRadius,
  zOffset,
  explodedOffset,
  material,
}: {
  vaneCount: number;
  innerRadius: number;
  outerRadius: number;
  zOffset: number;
  explodedOffset: number;
  material: THREE.Material;
}) {
  const vanes = useMemo(() => {
    return Array.from({ length: vaneCount }, (_, i) => (i / vaneCount) * Math.PI * 2);
  }, [vaneCount]);

  const length = outerRadius - innerRadius;

  return (
    <group position={[0, 0, zOffset + explodedOffset]}>
      {/* Outer Shroud Ring */}
      <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[outerRadius, 0.02, 8, 48]} />
      </mesh>
      {/* Inner Diaphragm Ring */}
      <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[innerRadius, 0.015, 8, 36]} />
      </mesh>

      {/* Stationary Airfoil Vanes */}
      {vanes.map((ang, i) => (
        <mesh
          key={i}
          material={material}
          position={[
            Math.cos(ang) * (innerRadius + length / 2),
            Math.sin(ang) * (innerRadius + length / 2),
            0,
          ]}
          rotation={[0, 0, ang - Math.PI / 2 + 0.18]}
        >
          <boxGeometry args={[0.06, length, 0.015]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Aerodynamic Nose Cone (Inlet Spinner) ───
function NoseCone({
  zOffset,
  explodedOffset,
  material,
  speed,
}: {
  zOffset: number;
  explodedOffset: number;
  material: THREE.Material;
  speed: number;
}) {
  const coneRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (coneRef.current) {
      coneRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group position={[0, 0, zOffset + explodedOffset]} ref={coneRef}>
      {/* Tapered Parabolic Nose Cone */}
      <mesh material={material} position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.38, 0.7, 32]} />
      </mesh>
      {/* Center Titanium Tip Point */}
      <mesh material={material} position={[0, 0, 0.72]}>
        <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>
      {/* Fastener Ring */}
      <mesh material={material} position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.015, 8, 32]} />
      </mesh>
    </group>
  );
}

// ─── Central Drive Shaft & Bearing Packs ───
function ShaftAssembly({
  length,
  speed,
  material,
  bearingMaterial,
}: {
  length: number;
  speed: number;
  material: THREE.Material;
  bearingMaterial: THREE.Material;
}) {
  const shaftRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (shaftRef.current) {
      shaftRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group>
      {/* Precision Dual-Spool Shaft */}
      <mesh ref={shaftRef} material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, length, 24]} />
      </mesh>

      {/* Roller & Ball Bearing Assemblies */}
      {[-1.2, -0.4, 0.3, 1.1].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          <mesh material={bearingMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.13, 0.028, 12, 24]} />
          </mesh>
          <mesh material={bearingMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.012, 8, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Combustor Casing & Fuel Nozzle Ring ───
function CombustorSection({
  zOffset,
  explodedOffset,
  material,
  nozzleMaterial,
}: {
  zOffset: number;
  explodedOffset: number;
  material: THREE.Material;
  nozzleMaterial: THREE.Material;
}) {
  const nozzles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);
  }, []);

  return (
    <group position={[0, 0, zOffset + explodedOffset]}>
      {/* Combustor Chamber Inner Liner */}
      <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.68, 0.65, 32, 1, true]} />
      </mesh>
      {/* Combustor Chamber Outer Diffuser Shell */}
      <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.92, 0.88, 0.62, 32, 1, true]} />
      </mesh>
      {/* Flange Rings with Hex Fasteners */}
      <mesh material={material} position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.93, 0.02, 8, 36]} />
      </mesh>
      <mesh material={material} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.91, 0.02, 8, 36]} />
      </mesh>

      {/* Fuel Injection Nozzles */}
      {nozzles.map((ang, i) => (
        <mesh
          key={i}
          material={nozzleMaterial}
          position={[Math.cos(ang) * 0.82, Math.sin(ang) * 0.82, 0]}
          rotation={[Math.PI / 2, 0, ang]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Tail Cone (Exhaust Mixer & Nozzle) ───
function ExhaustCone({
  zOffset,
  explodedOffset,
  material,
}: {
  zOffset: number;
  explodedOffset: number;
  material: THREE.Material;
}) {
  return (
    <group position={[0, 0, zOffset + explodedOffset]}>
      {/* Tapered Tail Plug */}
      <mesh material={material} position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.9, 24]} />
      </mesh>
      {/* Outer Nozzle Casing */}
      <mesh material={material} position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.48, 0.5, 32, 1, true]} />
      </mesh>
      {/* Structural Exhaust Struts */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <mesh
          key={i}
          material={material}
          position={[Math.cos(ang) * 0.28, Math.sin(ang) * 0.28, -0.2]}
          rotation={[0, 0, ang]}
        >
          <boxGeometry args={[0.32, 0.02, 0.15]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── CFD Flow Streamlines (for FLOW FIELD state) ───
function FlowFieldStreamlines({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 350;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 0.25 + Math.random() * 0.9;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      spd[i] = 1.8 + Math.random() * 2.5;
    }
    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Stream air back from inlet (+Z) to exhaust (-Z)
      array[i * 3 + 2] -= delta * speeds[i];
      // Swirl around central axis
      const x = array[i * 3];
      const y = array[i * 3 + 1];
      const angDelta = delta * 1.5;
      array[i * 3] = x * Math.cos(angDelta) - y * Math.sin(angDelta);
      array[i * 3 + 1] = x * Math.sin(angDelta) + y * Math.cos(angDelta);

      if (array[i * 3 + 2] < -2.2) {
        array[i * 3 + 2] = 2.2;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00D4FF"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Inspection Reticle Scan Plane (for INSPECTION state) ───
function InspectionLaserPlane({ active }: { active: boolean }) {
  const laserRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!laserRef.current || !active) return;
    // Oscillate laser scan plane along axial length
    laserRef.current.position.z = Math.sin(state.clock.elapsedTime * 1.2) * 1.6;
  });

  if (!active) return null;

  return (
    <group ref={laserRef}>
      {/* Slicing Cyan Scan Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 1.65, 48]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.008, 8, 48]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ─── Full Turbine Digital Twin Assembly ───
function FullTurbineAssembly({
  pointerPos,
  accelerate,
  visualState = 'realistic',
}: {
  pointerPos: { x: number; y: number };
  accelerate: boolean;
  visualState: TurbineState;
}) {
  const rootRef = useRef<THREE.Group>(null!);

  // Speed multiplier
  const baseSpeed = accelerate ? 2.4 : 0.22;
  const isExploded = visualState === 'exploded';

  // Smooth lerp for tilt, subtle vibration & breathing
  useFrame((state) => {
    if (!rootRef.current) return;

    // Subtle pointer parallax tilt
    const targetTiltX = -pointerPos.y * 0.08;
    const targetTiltY = pointerPos.x * 0.12;

    rootRef.current.rotation.x = THREE.MathUtils.lerp(
      rootRef.current.rotation.x,
      targetTiltX + 0.18,
      0.04
    );
    rootRef.current.rotation.y = THREE.MathUtils.lerp(
      rootRef.current.rotation.y,
      targetTiltY,
      0.04
    );

    // Micro mechanical vibration
    const vibrationAmp = accelerate ? 0.006 : 0.0015;
    rootRef.current.position.x = Math.sin(state.clock.elapsedTime * 24) * vibrationAmp;
    rootRef.current.position.y = Math.cos(state.clock.elapsedTime * 28) * vibrationAmp;
  });

  // Dynamic Materials based on visual state
  const materials = useMemo(() => {
    if (visualState === 'wireframe') {
      const wireMat = new THREE.MeshBasicMaterial({
        color: '#00D4FF',
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      return {
        titanium: wireMat,
        steel: wireMat,
        blade: wireMat,
        casing: wireMat,
        bearing: wireMat,
        nozzle: wireMat,
      };
    }

    if (visualState === 'blueprint') {
      const bpMat = new THREE.MeshBasicMaterial({
        color: '#38BDF8',
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const solidBpMat = new THREE.MeshStandardMaterial({
        color: '#0F263E',
        metalness: 0.2,
        roughness: 0.8,
        wireframe: false,
      });
      return {
        titanium: solidBpMat,
        steel: bpMat,
        blade: bpMat,
        casing: bpMat,
        bearing: solidBpMat,
        nozzle: solidBpMat,
      };
    }

    if (visualState === 'xray') {
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: '#00D4FF',
        transparent: true,
        opacity: 0.18,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.85,
        depthWrite: false,
      });
      const glowingCoreMat = new THREE.MeshStandardMaterial({
        color: '#38E1FF',
        emissive: '#00D4FF',
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.2,
      });
      return {
        titanium: glowingCoreMat,
        steel: glowingCoreMat,
        blade: glassMat,
        casing: glassMat,
        bearing: glowingCoreMat,
        nozzle: glowingCoreMat,
      };
    }

    // Default 'realistic', 'flowfield', 'exploded', 'inspection'
    return {
      titanium: new THREE.MeshStandardMaterial({
        color: '#94A3B8',
        metalness: 0.88,
        roughness: 0.22,
      }),
      steel: new THREE.MeshStandardMaterial({
        color: '#475569',
        metalness: 0.92,
        roughness: 0.18,
      }),
      blade: new THREE.MeshStandardMaterial({
        color: '#CBD5E1',
        metalness: 0.94,
        roughness: 0.12,
      }),
      casing: new THREE.MeshStandardMaterial({
        color: '#1E293B',
        metalness: 0.85,
        roughness: 0.35,
        transparent: true,
        opacity: 0.75,
      }),
      bearing: new THREE.MeshStandardMaterial({
        color: '#F59E0B',
        metalness: 0.9,
        roughness: 0.15,
      }),
      nozzle: new THREE.MeshStandardMaterial({
        color: '#00D4FF',
        metalness: 0.8,
        roughness: 0.2,
      }),
    };
  }, [visualState]);

  // Exploded spacing factors along Z
  const expNose = isExploded ? 0.9 : 0;
  const expFan = isExploded ? 0.65 : 0;
  const expStage2 = isExploded ? 0.35 : 0;
  const expStage3 = isExploded ? 0.15 : 0;
  const expCombustor = isExploded ? -0.1 : 0;
  const expHpt = isExploded ? -0.4 : 0;
  const expLpt = isExploded ? -0.7 : 0;
  const expExhaust = isExploded ? -1.05 : 0;

  return (
    <group ref={rootRef} rotation={[0.18, 0, 0]}>
      {/* ─── Volumetric & Engineering Lighting ─── */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 6]} intensity={1.6} color="#F8FAFC" />
      <directionalLight position={[-6, -4, -6]} intensity={0.5} color="#38BDF8" />
      <pointLight position={[0, 0, 2.5]} intensity={1.2} color="#00D4FF" distance={7} />
      <pointLight position={[0, 0, -2.5]} intensity={0.6} color="#F59E0B" distance={5} />

      {/* ─── 1. Central Drive Shaft & Bearing Packs ─── */}
      <ShaftAssembly
        length={3.6}
        speed={baseSpeed * 0.9}
        material={materials.steel}
        bearingMaterial={materials.bearing}
      />

      {/* ─── 2. Aerodynamic Nose Cone (Spinner) ─── */}
      <NoseCone
        zOffset={1.35}
        explodedOffset={expNose}
        material={materials.titanium}
        speed={baseSpeed * 2.2}
      />

      {/* ─── 3. Stage 1: Low-Pressure Fan / Compressor Rotor ─── */}
      <RotorStage
        bladeCount={22}
        discRadius={0.42}
        bladeLength={0.78}
        rootWidth={0.16}
        tipWidth={0.22}
        twistAngle={0.48}
        camber={0.18}
        speed={baseSpeed * 2.2}
        direction={1}
        zOffset={1.15}
        explodedOffset={expFan}
        material={materials.blade}
        discMaterial={materials.titanium}
      />

      {/* Stator Vane Cascade 1 */}
      <StatorStage
        vaneCount={18}
        innerRadius={0.44}
        outerRadius={1.2}
        zOffset={0.92}
        explodedOffset={(expFan + expStage2) / 2}
        material={materials.casing}
      />

      {/* ─── 4. Stage 2: Intermediate-Pressure Compressor ─── */}
      <RotorStage
        bladeCount={28}
        discRadius={0.48}
        bladeLength={0.58}
        rootWidth={0.14}
        tipWidth={0.17}
        twistAngle={0.38}
        camber={0.14}
        speed={baseSpeed * 1.8}
        direction={-1}
        zOffset={0.72}
        explodedOffset={expStage2}
        material={materials.blade}
        discMaterial={materials.titanium}
      />

      {/* Stator Vane Cascade 2 */}
      <StatorStage
        vaneCount={24}
        innerRadius={0.5}
        outerRadius={1.06}
        zOffset={0.52}
        explodedOffset={(expStage2 + expStage3) / 2}
        material={materials.casing}
      />

      {/* ─── 5. Stage 3: High-Pressure Compressor Rotor ─── */}
      <RotorStage
        bladeCount={34}
        discRadius={0.52}
        bladeLength={0.44}
        rootWidth={0.11}
        tipWidth={0.13}
        twistAngle={0.28}
        camber={0.1}
        speed={baseSpeed * 1.4}
        direction={1}
        zOffset={0.32}
        explodedOffset={expStage3}
        material={materials.blade}
        discMaterial={materials.titanium}
      />

      {/* ─── 6. Combustor Section Liner & Fuel Injector Nozzles ─── */}
      <CombustorSection
        zOffset={-0.12}
        explodedOffset={expCombustor}
        material={materials.casing}
        nozzleMaterial={materials.nozzle}
      />

      {/* ─── 7. Stage 4: High-Pressure Turbine (Single-Crystal Superalloy) ─── */}
      <RotorStage
        bladeCount={30}
        discRadius={0.5}
        bladeLength={0.46}
        rootWidth={0.13}
        tipWidth={0.15}
        twistAngle={0.34}
        camber={0.15}
        speed={baseSpeed * 2.0}
        direction={-1}
        zOffset={-0.55}
        explodedOffset={expHpt}
        material={materials.blade}
        discMaterial={materials.titanium}
      />

      {/* Inter-Turbine Stator Vanes */}
      <StatorStage
        vaneCount={26}
        innerRadius={0.48}
        outerRadius={1.02}
        zOffset={-0.72}
        explodedOffset={(expHpt + expLpt) / 2}
        material={materials.casing}
      />

      {/* ─── 8. Stage 5: Low-Pressure Expansion Turbine ─── */}
      <RotorStage
        bladeCount={24}
        discRadius={0.44}
        bladeLength={0.62}
        rootWidth={0.15}
        tipWidth={0.19}
        twistAngle={0.42}
        camber={0.16}
        speed={baseSpeed * 1.2}
        direction={1}
        zOffset={-0.92}
        explodedOffset={expLpt}
        material={materials.blade}
        discMaterial={materials.titanium}
      />

      {/* ─── 9. Exhaust Cone & Tail Mixer ─── */}
      <ExhaustCone
        zOffset={-1.25}
        explodedOffset={expExhaust}
        material={materials.casing}
      />

      {/* ─── 10. Digital Twin State Special Effects ─── */}
      <FlowFieldStreamlines active={visualState === 'flowfield'} />
      <InspectionLaserPlane active={visualState === 'inspection'} />
    </group>
  );
}

// ─── Exported TurbineScene Canvas Wrapper ───
export function TurbineScene({
  accelerate = false,
  visualState = 'realistic',
}: TurbineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'auto' }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 48 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <TurbineAssemblyWrapper
            accelerate={accelerate}
            visualState={visualState}
            pointerRef={pointerRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function TurbineAssemblyWrapper({
  accelerate,
  visualState,
  pointerRef,
}: {
  accelerate: boolean;
  visualState: TurbineState;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}) {
  const posRef = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (pointerRef.current) {
      posRef.current.x = THREE.MathUtils.lerp(posRef.current.x, pointerRef.current.x, 0.05);
      posRef.current.y = THREE.MathUtils.lerp(posRef.current.y, pointerRef.current.y, 0.05);
    }
  });

  return (
    <FullTurbineAssembly
      pointerPos={posRef.current}
      accelerate={accelerate}
      visualState={visualState}
    />
  );
}
