import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlaybackFrame, ReferencePoint, AircraftTelemetry, SimulationBranch } from '../types/simulation';
import { cn } from '@/utils/cn';

export interface AirspaceCanvas3DProps {
  currentFrame: PlaybackFrame | null;
  referencePoints: ReferencePoint[];
  selectedAircraftId: string;
  onSelectAircraft: (id: string) => void;
  previewBranch?: SimulationBranch | null;
  className?: string;
}

const getStatusColor = (status: AircraftTelemetry['status']) => {
  switch (status) {
    case 'TCAS_RA_CLIMB':
      return '#A8C96D';
    case 'TCAS_RA_DESCEND':
      return '#FBBF24';
    case 'TCAS_TA':
      return '#F59E0B';
    case 'IMPACT':
      return '#EF4444';
    case 'SAFE':
      return '#88B04B';
    case 'CONFLICT':
      return '#DC2626';
    default:
      return '#F3F1EB';
  }
};

const AircraftMesh3D: React.FC<{
  ac: AircraftTelemetry;
  pos3D: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}> = ({ ac, pos3D, isSelected, onSelect }) => {
  const color = getStatusColor(ac.status);
  // Convert heading (0=North/-Z, 90=East/+X) to Y rotation
  const yawRad = -((ac.heading - 90) * Math.PI) / 180;
  // Subtle pitch based on vertical speed
  const pitchRad = THREE.MathUtils.clamp((ac.verticalSpeed || 0) / 8000, -0.25, 0.25);

  return (
    <group>
      {/* Altitude drop-line to ground plane (y = -1.8) */}
      <Line
        points={[pos3D, [pos3D[0], -1.8, pos3D[2]]]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.35}
        dashed
        dashSize={0.12}
        gapSize={0.08}
      />

      {/* Ground shadow dot */}
      <mesh position={[pos3D[0], -1.79, pos3D[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>

      {/* 3D Aircraft Geometry */}
      <group
        position={pos3D}
        rotation={[0, yawRad, pitchRad]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Fuselage */}
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.44, 8]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.5} />
        </mesh>
        {/* Wings */}
        <mesh position={[-0.04, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.25, 1, 2.6]}>
          <coneGeometry args={[0.12, 0.26, 3]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.5} />
        </mesh>
        {/* Tail fin */}
        <mesh position={[-0.18, 0.07, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Selection Ring */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.32, 0.36, 28]} />
            <meshBasicMaterial color="#C8F169" side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Crisp Callsign & Altitude Tag */}
        <Html position={[0, 0.32, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className="px-2 py-0.5 rounded bg-obsidian-950/90 border border-white/15 text-[10px] font-mono whitespace-nowrap text-sand-50 shadow-sm">
            <span className="font-bold" style={{ color }}>
              {ac.callsign}
            </span>{' '}
            <span className="text-stone-400">• {ac.altitudeFormatted}</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

const AirspaceSceneContent: React.FC<AirspaceCanvas3DProps> = ({
  currentFrame,
  referencePoints,
  selectedAircraftId,
  onSelectAircraft,
  previewBranch,
}) => {
  const aircraftList: AircraftTelemetry[] = useMemo(() => {
    if (!currentFrame || !currentFrame.aircraft) return [];
    return Object.values(currentFrame.aircraft);
  }, [currentFrame]);

  // Compute dynamic altitude baseline so both FL360 (36,000 ft) and FL140 (14,000 ft) map cleanly into [-1.2, +1.8]
  const baseAltitude = useMemo(() => {
    if (aircraftList.length === 0) return 35000;
    const sum = aircraftList.reduce((acc, a) => acc + a.altitude, 0);
    return sum / aircraftList.length;
  }, [aircraftList]);

  const mapPos = (xPct: number, yPct: number, altFt: number): [number, number, number] => {
    const x = ((xPct - 50) / 50) * 4.2;
    const z = ((yPct - 50) / 50) * 4.2;
    const y = THREE.MathUtils.clamp(((altFt - baseAltitude) / 1500) * 0.9 + 0.1, -1.3, 2.1);
    return [x, y, z];
  };

  const mappedAircraft = useMemo(
    () =>
      aircraftList.map((ac) => ({
        ac,
        pos3D: mapPos(ac.position.x, ac.position.y, ac.altitude),
      })),
    [aircraftList, baseAltitude]
  );

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 5]} intensity={1.2} color="#F3F1EB" />
      <pointLight position={[-4, 3, -4]} intensity={0.6} color="#C8F169" />

      {/* 3D Airspace Sector Grid */}
      <gridHelper args={[9, 18, '#3D4248', '#222529']} position={[0, -1.8, 0]} />

      {/* Reference Waypoints */}
      {referencePoints.map((pt) => {
        const rx = ((pt.position.x - 50) / 50) * 4.2;
        const rz = ((pt.position.y - 50) / 50) * 4.2;
        return (
          <group key={pt.id} position={[rx, -1.78, rz]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[
                  pt.type === 'CONFLICT_POINT' ? 0.2 : 0.1,
                  pt.type === 'CONFLICT_POINT' ? 0.25 : 0.13,
                  20,
                ]}
              />
              <meshBasicMaterial
                color={pt.type === 'CONFLICT_POINT' ? '#DC2626' : '#747570'}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Projected Branch Preview Trajectory (when hovering/selecting a decision option) */}
      {previewBranch && previewBranch.frames.length > 1 && (() => {
        const primaryAcId = selectedAircraftId || Object.keys(previewBranch.frames[0].aircraft)[0];
        const pts = previewBranch.frames
          .filter((_, i) => i % 2 === 0 || i === previewBranch.frames.length - 1)
          .map((f) => {
            const ac = f.aircraft[primaryAcId] || Object.values(f.aircraft)[0];
            return ac ? mapPos(ac.position.x, ac.position.y, ac.altitude) : null;
          })
          .filter(Boolean) as [number, number, number][];

        if (pts.length < 2) return null;
        const previewColor =
          previewBranch.outcome.classification === 'CATASTROPHIC_COLLISION'
            ? '#EF4444'
            : previewBranch.outcome.classification === 'SAFE_SEPARATION'
            ? '#88B04B'
            : '#D6D3C9';

        return (
          <Line
            points={pts}
            color={previewColor}
            lineWidth={2.5}
            dashed
            dashSize={0.22}
            gapSize={0.12}
          />
        );
      })()}

      {/* 3D Aircraft */}
      {mappedAircraft.map(({ ac, pos3D }) => (
        <AircraftMesh3D
          key={ac.id}
          ac={ac}
          pos3D={pos3D}
          isSelected={ac.id === selectedAircraftId}
          onSelect={() => onSelectAircraft(ac.id)}
        />
      ))}

      {/* Separation Vector Between Two Primary Aircraft */}
      {mappedAircraft.length >= 2 && (
        <group>
          <Line
            points={[mappedAircraft[0].pos3D, mappedAircraft[1].pos3D]}
            color={
              (currentFrame?.separationDistanceNM ?? 10) < 5 ? '#EF4444' : '#C8F169'
            }
            lineWidth={1.75}
            dashed
            dashSize={0.18}
            gapSize={0.1}
          />
          <Html
            position={[
              (mappedAircraft[0].pos3D[0] + mappedAircraft[1].pos3D[0]) / 2,
              (mappedAircraft[0].pos3D[1] + mappedAircraft[1].pos3D[1]) / 2 + 0.2,
              (mappedAircraft[0].pos3D[2] + mappedAircraft[1].pos3D[2]) / 2,
            ]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-2 py-0.5 rounded bg-obsidian-850/95 border border-lime-400/40 text-[10px] font-mono text-lime-400 whitespace-nowrap">
              {currentFrame?.separationDistanceNM ?? '--'} NM •{' '}
              {currentFrame?.verticalSeparationFT ?? '--'} FT
            </div>
          </Html>
        </group>
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={3.5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 - 0.08}
      />
    </>
  );
};

export const AirspaceCanvas3D: React.FC<AirspaceCanvas3DProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-cursor="orbit"
      className={cn(
        'relative w-full h-full min-h-[420px] bg-obsidian-950 overflow-hidden select-none',
        props.className
      )}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [5.2, 4.0, 6.2], fov: 46 }}
        gl={{ antialias: true, powerPreference: 'default' }}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <AirspaceSceneContent {...props} />
      </Canvas>

      {/* Subtle 3D HUD Notice */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-subtle bg-obsidian-850/90 border border-white/10 text-2xs font-mono text-stone-400 pointer-events-none">
        3D DETERMINISTIC AIRSPACE • DRAG TO ORBIT • SCROLL TO ZOOM
      </div>
    </div>
  );
};
