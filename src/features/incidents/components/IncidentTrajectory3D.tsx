import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface IncidentTrajectory3DProps {
  incidentId: string;
  className?: string;
}

const TrajectoryContent: React.FC<{ incidentId: string; isVisible: boolean }> = ({
  incidentId,
  isVisible,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const markerARef = useRef<THREE.Mesh>(null);
  const markerBRef = useRef<THREE.Mesh>(null);

  const paths = useMemo(() => {
    if (incidentId.includes('UBL')) {
      return {
        pathA: [
          [-2.2, 0.2, 0],
          [-0.8, 0.2, 0],
          [0, -0.15, 0],
          [1.6, -0.5, 0],
        ] as [number, number, number][],
        pathB: [
          [0, 0.2, -2.2],
          [0, 0.2, -0.8],
          [0, -0.15, 0],
          [0, -0.6, 1.6],
        ] as [number, number, number][],
        conflict: [0, -0.15, 0] as [number, number, number],
      };
    }
    if (incidentId.includes('AF447')) {
      return {
        pathA: [
          [-2.2, 0.1, 0],
          [-0.9, 0.1, 0],
          [-0.1, 0.75, 0],
          [0.9, -0.1, 0],
          [1.9, -1.15, 0],
        ] as [number, number, number][],
        pathB: null,
        conflict: [-0.1, 0.75, 0] as [number, number, number],
      };
    }
    if (incidentId.includes('CHRK')) {
      return {
        pathA: [
          [-2.2, -0.5, 0],
          [-0.9, -0.15, 0],
          [0, 0, 0],
          [1.6, 0.1, 0],
        ] as [number, number, number][],
        pathB: [
          [2.2, 0.55, 0.08],
          [0.9, 0.25, 0.04],
          [0, 0, 0],
          [-1.6, -0.1, 0],
        ] as [number, number, number][],
        conflict: [0, 0, 0] as [number, number, number],
      };
    }
    // SFO visual approach offset
    return {
      pathA: [
        [-2.2, 0.75, -0.35],
        [-0.8, 0.35, -0.35],
        [0.4, -0.15, -0.35],
        [1.8, 0.45, 0],
      ] as [number, number, number][],
      pathB: [
        [-2.2, -0.2, 0.3],
        [2.2, -0.2, 0.3],
      ] as [number, number, number][],
      conflict: [0.4, -0.15, -0.35] as [number, number, number],
    };
  }, [incidentId]);

  useFrame((state, delta) => {
    if (!isVisible || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.28 + 0.35;

    const u = (t * 0.32) % 1;
    if (markerARef.current && paths.pathA.length >= 2) {
      const idx = Math.min(paths.pathA.length - 2, Math.floor(u * (paths.pathA.length - 1)));
      const localU = u * (paths.pathA.length - 1) - idx;
      const p0 = paths.pathA[idx];
      const p1 = paths.pathA[idx + 1];
      markerARef.current.position.set(
        THREE.MathUtils.lerp(p0[0], p1[0], localU),
        THREE.MathUtils.lerp(p0[1], p1[1], localU),
        THREE.MathUtils.lerp(p0[2], p1[2], localU)
      );
    }

    if (markerBRef.current && paths.pathB && paths.pathB.length >= 2) {
      const idx = Math.min(paths.pathB.length - 2, Math.floor(u * (paths.pathB.length - 1)));
      const localU = u * (paths.pathB.length - 1) - idx;
      const p0 = paths.pathB[idx];
      const p1 = paths.pathB[idx + 1];
      markerBRef.current.position.set(
        THREE.MathUtils.lerp(p0[0], p1[0], localU),
        THREE.MathUtils.lerp(p0[1], p1[1], localU),
        THREE.MathUtils.lerp(p0[2], p1[2], localU)
      );
    }
    void delta;
  });

  return (
    <group ref={groupRef}>
      {/* Reference Airspace Grid Plane */}
      <gridHelper args={[5, 10, '#2B2F34', '#222529']} position={[0, -1.2, 0]} />

      {/* Trajectory A */}
      <Line points={paths.pathA} color="#C8F169" lineWidth={2.5} />
      <mesh ref={markerARef}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshBasicMaterial color="#C8F169" />
      </mesh>

      {/* Trajectory B */}
      {paths.pathB && (
        <>
          <Line points={paths.pathB} color="#F3F1EB" lineWidth={2} dashed dashSize={0.14} gapSize={0.08} />
          <mesh ref={markerBRef}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshBasicMaterial color="#F3F1EB" />
          </mesh>
        </>
      )}

      {/* Locus / Conflict Marker */}
      <mesh position={paths.conflict}>
        <ringGeometry args={[0.14, 0.18, 24]} />
        <meshBasicMaterial color="#DC2626" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const IncidentTrajectory3D: React.FC<IncidentTrajectory3DProps> = ({
  incidentId,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768);
    const observer = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (reduced) {
    return (
      <div ref={ref} className={`flex items-center justify-center bg-obsidian-950 ${className}`}>
        <span className="text-2xs font-mono text-stone-400">3D TRAJECTORY PREVIEW ({incidentId})</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative bg-obsidian-950 ${className}`}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [2.8, 2.1, 3.4], fov: 40 }} frameloop={isVisible ? 'always' : 'never'}>
        <ambientLight intensity={0.7} />
        <TrajectoryContent incidentId={incidentId} isVisible={isVisible} />
        <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.06} />
      </Canvas>
    </div>
  );
};
