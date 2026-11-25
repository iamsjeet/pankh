import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

export interface AerospaceSceneProps {
  scrollProgressRef?: React.MutableRefObject<number>;
  className?: string;
}

interface OrbitPathDef {
  id: string;
  radius: number;
  rotation: [number, number, number];
  speed: number;
  callsign: string;
  telemetry: string;
  color: string;
}

const ORBIT_PATHS: OrbitPathDef[] = [
  {
    id: 'UBL',
    radius: 2.12,
    rotation: [Math.PI / 2.35, 0.22, 0.1],
    speed: 0.4,
    callsign: 'BTC 2937 • UZ221',
    telemetry: 'FL360 • TCAS RA',
    color: '#88B04B',
  },
  {
    id: 'AF447',
    radius: 2.45,
    rotation: [Math.PI / 3.1, -0.38, 0.24],
    speed: -0.29,
    callsign: 'AFR 447 • TASIL',
    telemetry: 'FL350 • ALT LAW 2B',
    color: '#D6D3C9',
  },
  {
    id: 'CHRK',
    radius: 2.74,
    rotation: [Math.PI / 1.85, 0.55, -0.18],
    speed: 0.22,
    callsign: 'SVA 763 • G460',
    telemetry: 'FL140 • CORRIDOR',
    color: '#6E9436',
  },
];

const GlobeEnvironment: React.FC<{
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgressRef: React.MutableRefObject<number>;
  isVisible: boolean;
}> = ({ pointerRef, scrollProgressRef, isVisible }) => {
  const rootRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const trackerRefs = useRef<(THREE.Group | null)[]>([]);
  const [hoveredOrbit, setHoveredOrbit] = useState<string | null>(null);
  const [selectedTracker, setSelectedTracker] = useState<string | null>('UBL');
  const [globeHovered, setGlobeHovered] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Volumetric-feeling directional + Fresnel atmospheric shader (no flat black disc)
  const globeShaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColorCore: { value: new THREE.Color('#141618') },
          uColorMid: { value: new THREE.Color('#25292E') },
          uColorRim: { value: new THREE.Color('#88B04B') },
          uLightDir: { value: new THREE.Vector3(0.6, 0.7, 0.5).normalize() },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColorCore;
          uniform vec3 uColorMid;
          uniform vec3 uColorRim;
          uniform vec3 uLightDir;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float diffuse = max(dot(normal, uLightDir), 0.0);
            vec3 halfVec = normalize(uLightDir + viewDir);
            float spec = pow(max(dot(normal, halfVec), 0.0), 28.0);
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.4);

            vec3 base = mix(uColorCore, uColorMid, diffuse * 0.85);
            base += vec3(0.84, 0.83, 0.79) * spec * 0.16;
            vec3 finalCol = mix(base, uColorRim, fresnel * 0.52);
            gl_FragColor = vec4(finalCol, 0.98);
          }
        `,
        transparent: true,
      }),
    []
  );

  // Sparse atmospheric spatial particles (88 points)
  const particlePositions = useMemo(() => {
    const count = 88;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.9 + ((i * 37) % 100) / 40;
      const theta = (i * 2.39996) % (Math.PI * 2);
      const phi = Math.acos(2 * ((i * 19) % 100) / 100 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!isVisible || !rootRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const scroll = scrollProgressRef.current;

    if (pulse > 0) {
      setPulse((p) => Math.max(0, p - dt * 2.2));
    }

    // Asymmetric right-side placement in Hero, smoothly gliding during scroll
    const pointerDist = Math.hypot(pointerRef.current.x, pointerRef.current.y);
    const proximityBoost = Math.max(0, 1 - pointerDist) * 0.035;
    const targetRotY = t * 0.055 + pointerRef.current.x * 0.38 + scroll * 1.35;
    const targetRotX = 0.2 + pointerRef.current.y * 0.2 - scroll * 0.22;

    const targetScale = (globeHovered ? 1.025 : 1.0) + proximityBoost + Math.sin(scroll * Math.PI) * 0.16 + pulse * 0.04;
    const targetPosX = 1.28 - scroll * 0.25;
    const targetPosY = -0.04 - scroll * 0.12;

    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, dt * 2.6);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetRotX, dt * 2.6);
    rootRef.current.position.x = THREE.MathUtils.lerp(rootRef.current.position.x, targetPosX, dt * 2.6);
    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, targetPosY, dt * 2.6);
    rootRef.current.scale.setScalar(THREE.MathUtils.lerp(rootRef.current.scale.x, targetScale, dt * 3));

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.022;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.04;
    }

    ORBIT_PATHS.forEach((orbit, idx) => {
      const tracker = trackerRefs.current[idx];
      if (!tracker) return;
      const angle = t * orbit.speed + idx * 2.1;
      tracker.position.set(Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0);
      tracker.rotation.z = angle + Math.PI / 2;
    });
  });

  return (
    <group ref={rootRef} position={[1.02, -0.04, 0]}>
      {/* Sculpted Shaded Globe Core */}
      <mesh
        material={globeShaderMaterial}
        onPointerOver={(e) => {
          e.stopPropagation();
          setGlobeHovered(true);
        }}
        onPointerOut={() => setGlobeHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setPulse(1);
        }}
      >
        <sphereGeometry args={[1.54, 48, 48]} />
      </mesh>

      {/* Outer Geodesic Wireframe */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.57, 3]} />
        <meshBasicMaterial
          color="#88B04B"
          wireframe
          transparent
          opacity={globeHovered ? 0.22 : 0.13}
        />
      </mesh>

      {/* Secondary Inner Meridian Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.82, 0.005, 8, 120]} />
        <meshBasicMaterial color="#D6D3C9" transparent opacity={0.22} />
      </mesh>

      {/* Outer Segmented Telemetry Datum Ring */}
      <mesh ref={outerRingRef} rotation={[0.18, Math.PI / 3.5, 0]}>
        <torusGeometry args={[1.95, 0.004, 8, 120]} />
        <meshBasicMaterial color="#747570" transparent opacity={0.28} />
      </mesh>

      {/* Interactive Orbital Flight Trajectories & Tracking Objects */}
      {ORBIT_PATHS.map((orbit, idx) => {
        const isOrbitHovered = hoveredOrbit === orbit.id;
        const isTrackerSelected = selectedTracker === orbit.id;

        return (
          <group key={orbit.id} rotation={orbit.rotation}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredOrbit(orbit.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredOrbit(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTracker(isTrackerSelected ? null : orbit.id);
              }}
            >
              <torusGeometry args={[orbit.radius, isOrbitHovered ? 0.014 : 0.007, 10, 128]} />
              <meshBasicMaterial
                color={orbit.color}
                transparent
                opacity={isOrbitHovered || isTrackerSelected ? 0.88 : 0.42}
              />
            </mesh>

            <group
              ref={(el) => {
                trackerRefs.current[idx] = el;
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredOrbit(orbit.id);
                setSelectedTracker(orbit.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredOrbit(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTracker(orbit.id);
                setPulse(0.75);
              }}
            >
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.06, 0.2, 4]} />
                <meshBasicMaterial color={orbit.color} />
              </mesh>

              {(isTrackerSelected || isOrbitHovered) && (
                <Html position={[0, 0.22, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                  <div className="px-2.5 py-1 rounded bg-obsidian-950/95 border border-[#88B04B]/45 text-[10px] font-mono text-sand-50 whitespace-nowrap shadow-lg">
                    <div className="text-[#A8C96D] font-semibold">{orbit.callsign}</div>
                    <div className="text-stone-400">{orbit.telemetry}</div>
                  </div>
                </Html>
              )}
            </group>
          </group>
        );
      })}

      {/* Sparse Atmospheric Spatial Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.024} color="#D6D3C9" transparent opacity={0.28} sizeAttenuation />
      </points>
    </group>
  );
};

export const AerospaceOrbitalScene: React.FC<AerospaceSceneProps> = ({
  scrollProgressRef: externalScrollRef,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const internalScrollRef = useRef(0);
  const scrollRef = externalScrollRef || internalScrollRef;
  const [isVisible, setIsVisible] = useState(true);
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.innerWidth < 768;
    if (reduced || smallScreen) {
      setUseStaticFallback(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (useStaticFallback || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  if (useStaticFallback) {
    return (
      <div
        ref={containerRef}
        className={`relative flex items-center justify-center bg-obsidian-950 ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 320 320" className="w-72 h-72 sm:w-96 sm:h-96 opacity-90">
          <defs>
            <radialGradient id="staticGlobeSage" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#25292E" />
              <stop offset="85%" stopColor="#141618" />
              <stop offset="100%" stopColor="#88B04B" stopOpacity="0.45" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="160" r="84" fill="url(#staticGlobeSage)" stroke="rgba(136,176,75,0.35)" strokeWidth="1" />
          <ellipse cx="160" cy="160" rx="142" ry="44" fill="none" stroke="#88B04B" strokeWidth="1.5" transform="rotate(-18 160 160)" />
          <ellipse cx="160" cy="160" rx="122" ry="56" fill="none" stroke="rgba(214,211,201,0.28)" strokeWidth="1" transform="rotate(24 160 160)" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-cursor="orbit"
      onPointerMove={handlePointerMove}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 5.4], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 6, 4]} intensity={1.25} color="#F3F1EB" />
        <pointLight position={[-4, -2, 3]} intensity={0.6} color="#88B04B" />
        <GlobeEnvironment
          pointerRef={pointerRef}
          scrollProgressRef={scrollRef}
          isVisible={isVisible}
        />
        <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};
