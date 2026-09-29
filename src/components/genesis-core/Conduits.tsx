import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreState } from './useCoreState';

interface ConduitsProps {
  coreState: CoreState;
  overdrive?: boolean;
}

export function Conduits({ coreState, overdrive = false }: ConduitsProps) {
  const pulsesRef = useRef<THREE.Group>(null!);

  // Define 6 3D Catmull-Rom curves reaching from Nucleus boundary (~0.6) to Gyro-Rings (~1.2 - 1.7)
  const curves = useMemo(() => {
    const vectorsList = [
      // To Ring 1 (+X, +Y)
      [new THREE.Vector3(0.3, 0.4, 0.3), new THREE.Vector3(0.7, 0.8, 0.6), new THREE.Vector3(1.0, 0.6, 0.0)],
      // To Ring 1 (-X, -Y)
      [new THREE.Vector3(-0.3, -0.4, -0.3), new THREE.Vector3(-0.7, -0.8, -0.6), new THREE.Vector3(-1.0, -0.6, 0.0)],
      // To Ring 2 (+Y, +Z)
      [new THREE.Vector3(0.0, 0.4, 0.4), new THREE.Vector3(0.5, 0.9, 0.9), new THREE.Vector3(0.0, 1.4, 0.5)],
      // To Ring 2 (-Y, -Z)
      [new THREE.Vector3(0.0, -0.4, -0.4), new THREE.Vector3(-0.5, -0.9, -0.9), new THREE.Vector3(0.0, -1.4, -0.5)],
      // To Ring 3 (+Z, +X)
      [new THREE.Vector3(0.4, 0.0, 0.4), new THREE.Vector3(0.9, 0.5, 1.1), new THREE.Vector3(1.2, 0.0, 1.3)],
      // To Ring 3 (-Z, -X)
      [new THREE.Vector3(-0.4, 0.0, -0.4), new THREE.Vector3(-0.9, -0.5, -1.1), new THREE.Vector3(-1.2, 0.0, -1.3)],
    ];

    return vectorsList.map((pts) => new THREE.CatmullRomCurve3(pts));
  }, []);

  // Conduit guide tubes
  const tubeGeometries = useMemo(() => {
    return curves.map((curve) => new THREE.TubeGeometry(curve, 28, 0.016, 8, false));
  }, [curves]);

  // Pulse spheres traveling along each conduit
  const pulseSpheres = useMemo(() => {
    return curves.map(() => new THREE.SphereGeometry(0.045, 12, 12));
  }, [curves]);

  useFrame((state) => {
    if (!pulsesRef.current) return;

    const time = state.clock.elapsedTime;
    const isMechanical = coreState === 'mechanical';
    const isFusion = coreState === 'fusion';
    const isNeural = coreState === 'neural';

    // Pulse parameters
    const speed = overdrive ? 1.8 : isNeural ? 1.2 : isFusion ? 0.6 : 0.0;
    const pulseOpacity = isMechanical ? 0.0 : isFusion ? 0.8 : 1.0;

    pulsesRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      if (!mesh) return;

      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, pulseOpacity, 0.1);

      if (isMechanical && !overdrive) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;

      // Animate progress 0 -> 1 along the curve
      const progress = (time * speed + i * 0.18) % 1.0;
      const point = curves[i].getPointAt(progress);
      mesh.position.copy(point);

      // Color shifts from copper (#D4844A) leaving Nucleus to violet (#A855F7) arriving at ring
      const copper = new THREE.Color('#D4844A');
      const violet = new THREE.Color(overdrive ? '#FF3366' : '#A855F7');
      mat.color.copy(copper).lerp(violet, progress);
    });
  });

  const conduitBaseOpacity = coreState === 'mechanical' ? 0.12 : coreState === 'fusion' ? 0.35 : 0.6;

  return (
    <group>
      {/* ─── Static Conduit Guide Tubes ─── */}
      {tubeGeometries.map((geo, idx) => (
        <mesh key={idx} geometry={geo}>
          <meshBasicMaterial
            color="#D4844A"
            transparent
            opacity={conduitBaseOpacity}
            wireframe
          />
        </mesh>
      ))}

      {/* ─── Animated Pulses Traveling Nucleus → Rings ─── */}
      <group ref={pulsesRef}>
        {pulseSpheres.map((geo, idx) => (
          <mesh key={idx} geometry={geo}>
            <meshBasicMaterial
              color="#D4844A"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
