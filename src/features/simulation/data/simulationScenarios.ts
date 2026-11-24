import {
  SimulationScenario,
  PlaybackFrame,
  SimulationEvent,
  Position2D,
} from '../types/simulation';

/**
 * Curated Deterministic Simulation Scenarios
 * 
 * PROVENANCE & DATA INTEGRITY NOTICE:
 * This data powers a deterministic playback and branching simulation engine.
 * It is illustrative and scenario-based. It does NOT use an external physics simulator
 * or live air traffic data. Every frame and branch is strictly predefined.
 */

// =========================================================================
// SCENARIO 1: Überlingen Mid-Air Collision (SCEN-2002-UBL)
// =========================================================================

// Initial baseline frames (0s to 45s) up to the decision checkpoint
const ublInitialFrames: PlaybackFrame[] = [];

for (let t = 0; t <= 45; t++) {
  const progress = t / 90; // 0 to 0.5

  // BTC 2937 moves from x=15 to x=40, y=50, heading 270 (flying East to West)
  const btcPos: Position2D = {
    x: Math.round((15 + progress * 50) * 10) / 10,
    y: 50.0,
  };

  // DHX 611 moves from x=50, y=88 to x=50, y=60, heading 005 (flying South to North)
  const dhxPos: Position2D = {
    x: 50.0,
    y: Math.round((88 - progress * 52) * 10) / 10,
  };

  const distNM = Math.max(1.2, Math.round((42 - t * 0.75) * 10) / 10);
  const isTA = t >= 25;
  const isRA = t >= 40;

  ublInitialFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: distNM,
    verticalSeparationFT: 0,
    activeAlert: isRA
      ? 'TCAS RESOLUTION ADVISORY ACTIVE'
      : isTA
      ? 'TCAS TRAFFIC ADVISORY'
      : undefined,
    aircraft: {
      BTC2937: {
        id: 'BTC2937',
        callsign: 'BTC 2937',
        type: 'Tu-154M',
        position: btcPos,
        altitude: 36000,
        altitudeFormatted: 'FL360',
        heading: 270,
        speed: 460,
        verticalSpeed: 0,
        verticalSpeedFormatted: 'Level (0 FPM)',
        status: isRA ? 'TCAS_RA_CLIMB' : isTA ? 'TCAS_TA' : 'NORMAL',
        trail: [],
      },
      DHX611: {
        id: 'DHX611',
        callsign: 'DHX 611',
        type: 'B757-200PF',
        position: dhxPos,
        altitude: 36000,
        altitudeFormatted: 'FL360',
        heading: 5,
        speed: 475,
        verticalSpeed: 0,
        verticalSpeedFormatted: 'Level (0 FPM)',
        status: isRA ? 'TCAS_RA_DESCEND' : isTA ? 'TCAS_TA' : 'NORMAL',
        trail: [],
      },
    },
  });
}

// Initial Events up to checkpoint
const ublInitialEvents: SimulationEvent[] = [
  {
    id: 'SIM-EVT-01',
    timestamp: 0,
    timestampFormatted: 'T+00:00',
    title: 'Airspace En-Route Cruise Established',
    description: 'BTC 2937 and DHX 611 cruising level at FL360 on crossing corridors UZ221 and UN850.',
    category: 'RADAR',
    provenance: 'RECORDED',
  },
  {
    id: 'SIM-EVT-02',
    timestamp: 25,
    timestampFormatted: 'T+00:25',
    title: 'TCAS Traffic Advisory (TA) Generated',
    description: 'Separation drops below 25 NM. Both cockpits receive acoustic "TRAFFIC, TRAFFIC".',
    category: 'TCAS_ADVISORY',
    provenance: 'RECORDED',
  },
  {
    id: 'SIM-EVT-03',
    timestamp: 40,
    timestampFormatted: 'T+00:40',
    title: 'Coordinated TCAS Resolution Advisories (RA)',
    description: 'DHX 611 receives "DESCEND, DESCEND"; BTC 2937 receives "CLIMB, CLIMB".',
    category: 'TCAS_ADVISORY',
    provenance: 'RECORDED',
  },
  {
    id: 'SIM-EVT-04',
    timestamp: 45,
    timestampFormatted: 'T+00:45',
    title: 'Zurich ATC Issues Conflicting Descent Command',
    description: 'Controller instructs: "BTC 2937, descend flight level 350, expedite descend!"',
    category: 'CHECKPOINT',
    provenance: 'RECORDED',
  },
];

// =========================================================================
// BRANCH A: Recommended Standard (Follow TCAS Climb RA -> Safe Separation)
// =========================================================================
const branchTcasClimbFrames: PlaybackFrame[] = [];
for (let t = 46; t <= 85; t++) {
  const p = (t - 45) / 40; // 0 to 1

  // BTC climbs from FL360 to FL372
  const btcAlt = Math.min(37200, Math.round(36000 + p * 1500));
  // DHX descends from FL360 to FL346
  const dhxAlt = Math.max(34600, Math.round(36000 - p * 1600));

  const vertSep = btcAlt - dhxAlt;
  const distNM = Math.max(0.4, Math.round(Math.abs(18 - (t - 45) * 0.9) * 10) / 10);

  branchTcasClimbFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: distNM,
    verticalSeparationFT: vertSep,
    activeAlert: t > 70 ? 'CONFLICT RESOLVED • SAFE PASSING' : 'TCAS RA EXECUTION IN PROGRESS',
    aircraft: {
      BTC2937: {
        id: 'BTC2937',
        callsign: 'BTC 2937',
        type: 'Tu-154M',
        position: { x: Math.round((40 + p * 25) * 10) / 10, y: 50.0 },
        altitude: btcAlt,
        altitudeFormatted: `FL${Math.round(btcAlt / 100)}`,
        heading: 270,
        speed: 460,
        verticalSpeed: 1800,
        verticalSpeedFormatted: '+1,800 FPM (Climbing)',
        status: t > 70 ? 'SAFE' : 'TCAS_RA_CLIMB',
        trail: [],
      },
      DHX611: {
        id: 'DHX611',
        callsign: 'DHX 611',
        type: 'B757-200PF',
        position: { x: 50.0, y: Math.round((60 - p * 28) * 10) / 10 },
        altitude: dhxAlt,
        altitudeFormatted: `FL${Math.round(dhxAlt / 100)}`,
        heading: 5,
        speed: 475,
        verticalSpeed: -1900,
        verticalSpeedFormatted: '-1,900 FPM (Descending)',
        status: t > 70 ? 'SAFE' : 'TCAS_RA_DESCEND',
        trail: [],
      },
    },
  });
}

// =========================================================================
// BRANCH B: Historical Reference (Comply with ATC Descent -> Collision at FL348)
// =========================================================================
const branchHistoricalAtcFrames: PlaybackFrame[] = [];
for (let t = 46; t <= 75; t++) {
  const p = (t - 45) / 30; // 0 to 1

  // Both aircraft descend into FL348!
  const btcAlt = Math.max(34890, Math.round(36000 - p * 1300));
  const dhxAlt = Math.max(34890, Math.round(36000 - p * 1400));
  const vertSep = Math.abs(btcAlt - dhxAlt);
  const distNM = Math.max(0.0, Math.round((12 - p * 12) * 10) / 10);

  const isCollision = t >= 72;

  branchHistoricalAtcFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: distNM,
    verticalSeparationFT: vertSep,
    activeAlert: isCollision
      ? 'MID-AIR COLLISION OCCURRED AT FL348'
      : 'CRITICAL CONFLICT • VERTICAL SEPARATION DEGRADING',
    aircraft: {
      BTC2937: {
        id: 'BTC2937',
        callsign: 'BTC 2937',
        type: 'Tu-154M',
        position: { x: Math.round((40 + p * 10) * 10) / 10, y: 50.0 },
        altitude: btcAlt,
        altitudeFormatted: `FL${Math.round(btcAlt / 100)}`,
        heading: 270,
        speed: 460,
        verticalSpeed: -1800,
        verticalSpeedFormatted: '-1,800 FPM (Descending contrary to RA)',
        status: isCollision ? 'IMPACT' : 'CONFLICT',
        trail: [],
      },
      DHX611: {
        id: 'DHX611',
        callsign: 'DHX 611',
        type: 'B757-200PF',
        position: { x: 50.0, y: Math.round((60 - p * 10) * 10) / 10 },
        altitude: dhxAlt,
        altitudeFormatted: `FL${Math.round(dhxAlt / 100)}`,
        heading: 5,
        speed: 475,
        verticalSpeed: -1900,
        verticalSpeedFormatted: '-1,900 FPM (Descending per TCAS RA)',
        status: isCollision ? 'IMPACT' : 'CONFLICT',
        trail: [],
      },
    },
  });
}

// =========================================================================
// BRANCH C: Tactical Alternative (Immediate Lateral Vector Turn)
// =========================================================================
const branchLateralTurnFrames: PlaybackFrame[] = [];
for (let t = 46; t <= 80; t++) {
  const p = (t - 45) / 35; // 0 to 1

  // BTC turns right heading 325, holds FL360
  const btcPos: Position2D = {
    x: Math.round((40 + p * 20) * 10) / 10,
    y: Math.round((50 - p * 16) * 10) / 10,
  };
  const dhxPos: Position2D = {
    x: 50.0,
    y: Math.round((60 - p * 22) * 10) / 10,
  };

  const btcAlt = 36000;
  const dhxAlt = Math.max(34800, Math.round(36000 - p * 1400));
  const vertSep = btcAlt - dhxAlt;

  branchLateralTurnFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: 2.8,
    verticalSeparationFT: vertSep,
    activeAlert: t > 65 ? 'LATERAL SEPARATION MAINTAINED' : 'LATERAL RADAR VECTOR EVASION',
    aircraft: {
      BTC2937: {
        id: 'BTC2937',
        callsign: 'BTC 2937',
        type: 'Tu-154M',
        position: btcPos,
        altitude: btcAlt,
        altitudeFormatted: 'FL360',
        heading: 325,
        speed: 460,
        verticalSpeed: 0,
        verticalSpeedFormatted: 'Level (Turning Right HDG 325°)',
        status: t > 65 ? 'SAFE' : 'EXPEDITE',
        trail: [],
      },
      DHX611: {
        id: 'DHX611',
        callsign: 'DHX 611',
        type: 'B757-200PF',
        position: dhxPos,
        altitude: dhxAlt,
        altitudeFormatted: `FL${Math.round(dhxAlt / 100)}`,
        heading: 5,
        speed: 475,
        verticalSpeed: -1900,
        verticalSpeedFormatted: '-1,900 FPM (Descending per TCAS RA)',
        status: t > 65 ? 'SAFE' : 'TCAS_RA_DESCEND',
        trail: [],
      },
    },
  });
}

// Complete Scenario Definition
export const UBERLINGEN_SCENARIO: SimulationScenario = {
  id: 'SCEN-2002-UBL',
  incidentId: 'HIST-2002-UBL',
  title: 'Überlingen Airspace Convergence: TCAS RA vs ATC Conflict',
  scenarioType: 'DECISION_BRANCHING_SCENARIO',
  provenance: 'ILLUSTRATIVE',
  userRole: 'BTC 2937 Pilot Flying (Flight Crew Commander)',
  durationSeconds: 90,
  initialConditions: {
    airspace: 'Zurich ACC Sector / Lake Constance Airway Crossing (UZ221 & UN850)',
    weather: 'Night VMC, clear skies, unlimited visibility, light high-altitude winds',
    trafficDensity: 'Two heavy transport aircraft on perpendicular crossing tracks at FL360',
    surveillance: 'Secondary Radar active; Optical Short-Term Conflict Alert (STCA) offline for maintenance',
  },
  briefing: {
    overview:
      'You are piloting Bashkirian Airlines Flight 2937 (Tu-154M) cruising westbound at FL360 over Lake Constance. On a perpendicular northbound track at the identical flight level is DHL Flight 611 (B757-200PF). As separation diminishes, your onboard TCAS II system and the Swiss air traffic controller issue contradictory avoidance commands at the exact same second.',
    objectives: [
      'Experience how contradictory automation alerts and verbal clearances created severe cognitive conflict.',
      'Encounter the pivotal decision checkpoint at T+00:45 when TCAS and ATC diverge.',
      'Evaluate the geometric outcome of following TCAS Climb vs following ATC Descent.',
    ],
    roleDescription:
      'As Pilot Flying, you must decide whether to adhere strictly to your onboard TCAS Resolution Advisory (Climb) or comply with an urgent verbal ATC descent instruction from Zurich radar.',
    disclaimer:
      'ILLUSTRATIVE RESEARCH SCENARIO: Predefined deterministic playback designed for algorithmic safety analysis. Not a certified flight simulator or operational pilot training device.',
  },
  aircraftList: [
    {
      id: 'BTC2937',
      callsign: 'BTC 2937',
      type: 'Tupolev Tu-154M',
      operator: 'Bashkirian Airlines',
      initialAltitude: 'FL360 (36,000 FT)',
      color: '#00f0ff', // Electric cyan
    },
    {
      id: 'DHX611',
      callsign: 'DHX 611',
      type: 'Boeing 757-200PF',
      operator: 'DHL Aviation',
      initialAltitude: 'FL360 (36,000 FT)',
      color: '#f59e0b', // Restrained amber
    },
  ],
  referencePoints: [
    { id: 'UBERLINGEN', name: 'UBERLINGEN (Conflict Locus)', position: { x: 50, y: 50 }, type: 'CONFLICT_POINT' },
    { id: 'KEMPT', name: 'KEMPT VOR', position: { x: 50, y: 30 }, type: 'WAYPOINT' },
    { id: 'TRASAD', name: 'TRASAD INT', position: { x: 25, y: 50 }, type: 'WAYPOINT' },
    { id: 'ZURICH', name: 'ZURICH ACC', position: { x: 25, y: 80 }, type: 'AIRPORT' },
  ],
  initialFrames: ublInitialFrames,
  initialEvents: ublInitialEvents,
  checkpoints: [
    {
      id: 'CHK-UBL-01',
      timestamp: 45,
      timestampFormatted: 'T+00:45 (21:34:49 UTC)',
      title: 'Contradictory Avoidance Command Checkpoint',
      situationBrief:
        'Your onboard TCAS II annunciates an aural "CLIMB, CLIMB" Resolution Advisory. At the exact same second, Zurich ATC transmits on your frequency: "BTC 2937, descend flight level 350, expedite descend!"\n\nDHL 611 has received a coordinated TCAS "DESCEND, DESCEND" and is already executing a 2,000 fpm descent.',
      userRole: 'BTC 2937 Pilot Flying (Flight Commander)',
      contextAlert: 'CONTRADICTORY COMMAND: TCAS Commands CLIMB vs ATC Commands DESCEND',
      options: [
        {
          id: 'OPT-UBL-TCAS',
          branchId: 'BRANCH_TCAS_CLIMB',
          title: 'Option A: Follow TCAS Climb RA (Standard Practice)',
          description:
            'Disregard the verbal ATC descent instruction; pitch up to satisfy the green TCAS fly-to arc and report "BTC 2937, TCAS Climb" to the controller.',
          optionType: 'RECOMMENDED_STANDARD',
          consequenceSummary:
            'Both aircraft follow coordinated transponder guidance: BTC climbs while DHX descends, maximizing vertical separation rate.',
        },
        {
          id: 'OPT-UBL-ATC',
          branchId: 'BRANCH_HISTORICAL_ATC',
          title: 'Option B: Follow ATC Verbal Descent (Historical Action)',
          description:
            'Comply with the human air traffic controller instruction to descend to FL350 expedite, overriding the TCAS Climb resolution advisory.',
          optionType: 'HISTORICAL_ACTION',
          consequenceSummary:
            'Both aircraft enter a simultaneous rapid descent toward FL348, closing vertical clearance to zero.',
        },
        {
          id: 'OPT-UBL-TURN',
          branchId: 'BRANCH_LATERAL_TURN',
          title: 'Option C: Execute Immediate Lateral Radar Turn',
          description:
            'Hold current altitude FL360 and immediately execute a 55° right bank heading turn (HDG 325°) to evade the converging crossing corridor.',
          optionType: 'TACTICAL_ALTERNATIVE',
          consequenceSummary:
            'Lateral separation is rapidly established before vertical intersection, averting catastrophic impact with reduced margins.',
        },
      ],
    },
  ],
  branches: {
    BRANCH_TCAS_CLIMB: {
      id: 'BRANCH_TCAS_CLIMB',
      checkpointId: 'CHK-UBL-01',
      title: 'Hypothetical Branch: Standard TCAS RA Adherence',
      description:
        'The Russian flight crew pitched up following the TCAS Climb guidance. BTC 2937 climbed through FL372 while DHX 611 descended to FL346.',
      frames: branchTcasClimbFrames,
      events: [
        {
          id: 'EVT-BR-A1',
          timestamp: 48,
          timestampFormatted: 'T+00:48',
          title: 'Crew Selects TCAS Climb Execution',
          description: 'Autopilot disengaged; pilot initiates +1,800 fpm pitch up into green TCAS arc.',
          category: 'CREW_RESPONSE',
          provenance: 'HYPOTHETICAL',
          aircraftId: 'BTC2937',
        },
        {
          id: 'EVT-BR-A2',
          timestamp: 65,
          timestampFormatted: 'T+01:05',
          title: 'Vertical Divergence Rate Exceeds 3,700 FPM',
          description: 'Vertical separation expands to 1,800 ft as aircraft pass intersection point.',
          category: 'RADAR',
          provenance: 'HYPOTHETICAL',
        },
        {
          id: 'EVT-BR-A3',
          timestamp: 75,
          timestampFormatted: 'T+01:15',
          title: 'Safe Separation Achieved',
          description: 'Conflict resolved. Vertical clearance = 2,400 ft. TCAS announces "CLEAR OF CONFLICT".',
          category: 'OUTCOME',
          provenance: 'HYPOTHETICAL',
        },
      ],
      outcome: {
        classification: 'SAFE_SEPARATION',
        title: 'Safe Separation Maintained via TCAS Priority',
        summary:
          'By prioritizing the onboard TCAS II Resolution Advisory over contrary ATC verbal instructions, BTC 2937 climbed to FL372 while DHX 611 descended to FL346. Vertical clearance at the crossing point reached 2,400 feet.',
        minHorizontalSeparation: '0.4 NM (Crossing overflight)',
        minVerticalSeparation: '2,400 FT (Safe margin exceeds 1,000 ft standard)',
        isHistoricalBranch: false,
        learningPoints: [
          'TCAS II algorithms calculate mutually coordinated opposite-sense advisories (one aircraft climbs, the other descends).',
          'Human controllers lack instantaneous visibility into airborne TCAS RA generation unless Mode S downlink is operational.',
          'ICAO Annex 2 was officially amended after 2002 to mandate that pilots must never disobey a TCAS RA in favor of ATC.',
        ],
        comparisonWithReference:
          'In contrast to the historical crash where both aircraft descended into FL348, following the TCAS Climb advisory guaranteed over 2,400 ft of vertical separation.',
      },
    },

    BRANCH_HISTORICAL_ATC: {
      id: 'BRANCH_HISTORICAL_ATC',
      checkpointId: 'CHK-UBL-01',
      title: 'Historical Reference Branch: ATC Compliance & Dual Descent',
      description:
        'The flight crew complied with the Zurich controller descent clearance. Both aircraft descended simultaneously, resulting in a mid-air impact at FL348.',
      frames: branchHistoricalAtcFrames,
      events: [
        {
          id: 'EVT-BR-B1',
          timestamp: 48,
          timestampFormatted: 'T+00:48',
          title: 'Crew Follows ATC Descent Instruction',
          description: 'Flight crew pitches down into 1,800 fpm descent, contrary to TCAS Climb command.',
          category: 'CREW_RESPONSE',
          provenance: 'RECORDED',
          aircraftId: 'BTC2937',
        },
        {
          id: 'EVT-BR-B2',
          timestamp: 55,
          timestampFormatted: 'T+00:55',
          title: 'TCAS Issues Reversal: "INCREASE CLIMB"',
          description: 'TCAS logic senses worsening geometry and commands maximum climb rate. Crew remains in descent.',
          category: 'TCAS_ADVISORY',
          provenance: 'RECORDED',
          aircraftId: 'BTC2937',
        },
        {
          id: 'EVT-BR-B3',
          timestamp: 72,
          timestampFormatted: 'T+01:12',
          title: 'Mid-Air Collision at FL348',
          description: 'DHX 611 vertical stabilizer strikes the fuselage of BTC 2937 at 34,890 ft.',
          category: 'OUTCOME',
          provenance: 'RECORDED',
        },
      ],
      outcome: {
        classification: 'CATASTROPHIC_COLLISION',
        title: 'Catastrophic Mid-Air Impact at FL348 (Historical Outcome)',
        summary:
          'Because both aircraft executed simultaneous descent maneuvers, vertical separation degraded to zero. At T+01:12 (21:35:32 UTC), the tail fin of the Boeing 757 sliced through the fuselage of the Tu-154 at FL348.',
        minHorizontalSeparation: '0.0 NM (Direct impact)',
        minVerticalSeparation: '0 FT (Loss of all separation)',
        isHistoricalBranch: true,
        learningPoints: [
          'Conflicting human ATC commands directly nullified the automated mathematical coordination of TCAS II.',
          'National regulatory ambiguities in flight operations manuals allowed pilots to believe they had discretion to override TCAS.',
          'The tragedy proved that automated collision avoidance systems cannot function if one aircraft disobeys the resolution sense.',
        ],
        comparisonWithReference:
          'This is the documented historical sequence recorded by the BFU accident investigation.',
      },
    },

    BRANCH_LATERAL_TURN: {
      id: 'BRANCH_LATERAL_TURN',
      checkpointId: 'CHK-UBL-01',
      title: 'Hypothetical Branch: Emergency Lateral Vector Evasion',
      description:
        'The flight crew maintained FL360 and executed a sharp 55° right turn heading 325° away from the crossing track.',
      frames: branchLateralTurnFrames,
      events: [
        {
          id: 'EVT-BR-C1',
          timestamp: 48,
          timestampFormatted: 'T+00:48',
          title: 'Crew Initiates Emergency Right Turn',
          description: 'BTC 2937 rolls into a 30° bank right turn toward HDG 325°, holding FL360 level.',
          category: 'CREW_RESPONSE',
          provenance: 'HYPOTHETICAL',
          aircraftId: 'BTC2937',
        },
        {
          id: 'EVT-BR-C2',
          timestamp: 65,
          timestampFormatted: 'T+01:05',
          title: 'DHX 611 Descends Beneath Lateral Track',
          description: 'DHX 611 descends through FL350 per TCAS RA while lateral divergence increases.',
          category: 'RADAR',
          provenance: 'HYPOTHETICAL',
        },
        {
          id: 'EVT-BR-C3',
          timestamp: 75,
          timestampFormatted: 'T+01:15',
          title: 'Near Mid-Air Collision Avoided',
          description: 'Lateral separation stabilized at 2.8 NM with 1,200 ft vertical clearance.',
          category: 'OUTCOME',
          provenance: 'HYPOTHETICAL',
        },
      ],
      outcome: {
        classification: 'NEAR_MID_AIR_COLLISION',
        title: 'Loss of Separation with Lateral Collision Evasion',
        summary:
          'Holding altitude and executing an emergency right vector established lateral divergence before the crossing point. While separation fell below the required 5 NM radar standard, physical collision was avoided with 2.8 NM lateral and 1,200 ft vertical clearance.',
        minHorizontalSeparation: '2.8 NM (Below 5 NM standard separation)',
        minVerticalSeparation: '1,200 FT (Marginal separation)',
        isHistoricalBranch: false,
        learningPoints: [
          'Lateral turns require time to develop significant displacement at high cruising speeds (Mach 0.80).',
          'TCAS II operates strictly in the vertical plane (Climb/Descend); lateral TCAS maneuvers were not supported by Version 7.0.',
          'While this action averted physical impact, following the vertical TCAS RA remains the globally certified standard.',
        ],
        comparisonWithReference:
          'Averted the collision, but provided lower margins of safety than following the vertical TCAS Climb advisory.',
      },
    },
  },
  referenceBranchId: 'BRANCH_HISTORICAL_ATC',
};


// =========================================================================
// SCENARIO 2: Charkhi Dadri Mid-Air Collision (SCEN-1996-CHRK)
// =========================================================================

const chrkInitialFrames: PlaybackFrame[] = [];
for (let t = 0; t <= 30; t++) {
  const p = t / 60;
  // SVA 763 climbs westbound: x from 20 to 45, y=50, heading 260
  const svaPos: Position2D = { x: Math.round((20 + p * 50) * 10) / 10, y: 50.0 };
  // KZA 1907 descends eastbound: x from 80 to 55, y=50, heading 080
  const kzaPos: Position2D = { x: Math.round((80 - p * 50) * 10) / 10, y: 50.0 };
  const dist = Math.max(3.0, Math.round((38 - t * 1.1) * 10) / 10);
  const kzaAlt = Math.max(15000, Math.round(18000 - t * 100));
  const svaAlt = Math.min(14000, Math.round(11000 + t * 100));

  chrkInitialFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: dist,
    verticalSeparationFT: kzaAlt - svaAlt,
    activeAlert: t >= 20 ? 'OPPOSITE DIRECTION TRAFFIC ON AIRWAY G460' : undefined,
    aircraft: {
      SVA763: {
        id: 'SVA763',
        callsign: 'SVA 763',
        type: 'Boeing 747-168B',
        position: svaPos,
        altitude: svaAlt,
        altitudeFormatted: `FL${Math.round(svaAlt / 100)}`,
        heading: 260,
        speed: 310,
        verticalSpeed: 1000,
        verticalSpeedFormatted: '+1,000 FPM (Climbing to FL140)',
        status: 'NORMAL',
        trail: [],
      },
      KZA1907: {
        id: 'KZA1907',
        callsign: 'KZA 1907',
        type: 'Ilyushin Il-76TD',
        position: kzaPos,
        altitude: kzaAlt,
        altitudeFormatted: `FL${Math.round(kzaAlt / 100)}`,
        heading: 80,
        speed: 280,
        verticalSpeed: -1000,
        verticalSpeedFormatted: '-1,000 FPM (Descending to FL150)',
        status: t >= 25 ? 'CONFLICT' : 'NORMAL',
        trail: [],
      },
    },
  });
}

// Branch 1: Level off at assigned FL150 (Safe Separation)
const chrkHoldFrames: PlaybackFrame[] = [];
for (let t = 31; t <= 60; t++) {
  const p = t / 60;
  const svaPos: Position2D = { x: Math.round((20 + p * 50) * 10) / 10, y: 50.0 };
  const kzaPos: Position2D = { x: Math.round((80 - p * 50) * 10) / 10, y: 50.0 };
  const dist = Math.max(0.8, Math.round(Math.abs(50 - (20 + p * 50)) * 2 * 10) / 10);
  chrkHoldFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: dist,
    verticalSeparationFT: 1000,
    activeAlert: t > 45 ? 'TRAFFIC PASSED SAFELY AT FL140' : 'LEVEL FL150 MAINTAINED (1,000 FT VERTICAL SEPARATION)',
    aircraft: {
      SVA763: {
        id: 'SVA763',
        callsign: 'SVA 763',
        type: 'Boeing 747-168B',
        position: svaPos,
        altitude: 14000,
        altitudeFormatted: 'FL140',
        heading: 260,
        speed: 310,
        verticalSpeed: 0,
        verticalSpeedFormatted: 'Level FL140',
        status: 'SAFE',
        trail: [],
      },
      KZA1907: {
        id: 'KZA1907',
        callsign: 'KZA 1907',
        type: 'Ilyushin Il-76TD',
        position: kzaPos,
        altitude: 15000,
        altitudeFormatted: 'FL150',
        heading: 80,
        speed: 280,
        verticalSpeed: 0,
        verticalSpeedFormatted: 'Level FL150 (ATC Cleared)',
        status: 'SAFE',
        trail: [],
      },
    },
  });
}

// Branch 2: Historical Descent below FL150 to FL140 (Collision)
const chrkHistoricalFrames: PlaybackFrame[] = [];
for (let t = 31; t <= 60; t++) {
  const p = t / 60;
  const svaPos: Position2D = { x: Math.round((20 + p * 50) * 10) / 10, y: 50.0 };
  const kzaPos: Position2D = { x: Math.round((80 - p * 50) * 10) / 10, y: 50.0 };
  const dist = t >= 48 ? 0 : Math.max(0, Math.round((18 - (t - 30) * 1.0) * 10) / 10);
  const kzaAlt = Math.max(14000, Math.round(15000 - (t - 30) * 60));
  chrkHistoricalFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: dist,
    verticalSeparationFT: Math.max(0, kzaAlt - 14000),
    activeAlert: t >= 48 ? 'MIDAIR COLLISION AT FL140' : 'UNAUTHORIZED DESCENT THROUGH FL140',
    aircraft: {
      SVA763: {
        id: 'SVA763',
        callsign: 'SVA 763',
        type: 'Boeing 747-168B',
        position: svaPos,
        altitude: 14000,
        altitudeFormatted: 'FL140',
        heading: 260,
        speed: 310,
        verticalSpeed: 0,
        status: t >= 48 ? 'IMPACT' : 'NORMAL',
        trail: [],
      },
      KZA1907: {
        id: 'KZA1907',
        callsign: 'KZA 1907',
        type: 'Ilyushin Il-76TD',
        position: kzaPos,
        altitude: kzaAlt,
        altitudeFormatted: `FL${Math.round(kzaAlt / 100)}`,
        heading: 80,
        speed: 280,
        verticalSpeed: -900,
        status: t >= 48 ? 'IMPACT' : 'CONFLICT',
        trail: [],
      },
    },
  });
}

// Branch 3: Lateral Evasion off airway corridor
const chrkLateralFrames: PlaybackFrame[] = [];
for (let t = 31; t <= 60; t++) {
  const p = t / 60;
  const svaPos: Position2D = { x: Math.round((20 + p * 50) * 10) / 10, y: 50.0 };
  const kzaPos: Position2D = { x: Math.round((80 - p * 50) * 10) / 10, y: Math.round((50 - (t - 30) * 0.8) * 10) / 10 };
  chrkLateralFrames.push({
    timestamp: t,
    timestampFormatted: `T+00:${t < 10 ? '0' + t : t}`,
    separationDistanceNM: 3.2,
    verticalSeparationFT: 0,
    activeAlert: 'LATERAL DEVIATION OFF AIRWAY G460 CENTERLINE',
    aircraft: {
      SVA763: {
        id: 'SVA763',
        callsign: 'SVA 763',
        type: 'Boeing 747-168B',
        position: svaPos,
        altitude: 14000,
        altitudeFormatted: 'FL140',
        heading: 260,
        speed: 310,
        verticalSpeed: 0,
        status: 'SAFE',
        trail: [],
      },
      KZA1907: {
        id: 'KZA1907',
        callsign: 'KZA 1907',
        type: 'Ilyushin Il-76TD',
        position: kzaPos,
        altitude: 14000,
        altitudeFormatted: 'FL140',
        heading: 110,
        speed: 280,
        verticalSpeed: 0,
        status: 'SAFE',
        trail: [],
      },
    },
  });
}

export const CHARKHI_DADRI_SCENARIO: SimulationScenario = {
  id: 'SCEN-1996-CHRK',
  incidentId: 'HIST-1996-CHRK',
  title: 'Charkhi Dadri Airway G460 Altimetry Conflict',
  scenarioType: 'DECISION_BRANCHING_SCENARIO',
  provenance: 'REPORT_SUPPORTED',
  userRole: 'KZA 1907 Radio Operator & Flight Crew',
  durationSeconds: 60,
  initialConditions: {
    airspace: 'Delhi FIR / Airway G460 Bidirectional Single-Track Corridor',
    weather: 'Dusk IMC, broken to overcast cloud base at FL130-150',
    trafficDensity: 'Two heavy wide-body transports on reciprocal head-on headings',
    surveillance: 'Primary Radar (ARSR) only; Secondary Surveillance Radar (Mode C) offline/non-operational',
  },
  briefing: {
    overview:
      'You are crew on Kazakhstan Airlines Flight 1907 (Il-76TD) descending into Delhi along Airway G460. Delhi ATC cleared you to descend to FL150 and report reaching, advising that Saudi Flight 763 (B747) is climbing outbound on the identical track to FL140. Altimeter displays in your cockpit are calibrated in meters, requiring real-time imperial conversion.',
    objectives: [
      'Experience the critical hazard of bidirectional single-track airway operations without Mode C radar.',
      'Encounter the pivotal altitude capture checkpoint when passing FL150.',
      'Analyze how altimetry discrepancy and translation latency eliminate vertical buffer.',
    ],
    roleDescription:
      'As crew navigator/radio operator, ensure accurate altitude capture at FL150 before penetrating the outbound flight level FL140.',
    disclaimer:
      'REPORT-SUPPORTED RESEARCH SCENARIO: Telemetry corridor tracks derived from Government of India Court of Inquiry Report (Lahoti Commission). Illustrative aerodynamic visualization.',
  },
  aircraftList: [
    {
      id: 'SVA763',
      callsign: 'SVA 763',
      type: 'Boeing 747-168B',
      operator: 'Saudi Arabian Airlines',
      initialAltitude: 'FL110 climbing to FL140',
      color: '#00f0ff',
    },
    {
      id: 'KZA1907',
      callsign: 'KZA 1907',
      type: 'Ilyushin Il-76TD',
      operator: 'Kazakhstan Airlines',
      initialAltitude: 'FL180 descending to FL150',
      color: '#f59e0b',
    },
  ],
  referencePoints: [
    { id: 'CHARKHI_DADRI', name: 'CHARKHI DADRI (Conflict Point)', position: { x: 50, y: 50 }, type: 'CONFLICT_POINT' },
    { id: 'DPN_VOR', name: 'DELHI DPN VOR', position: { x: 20, y: 50 }, type: 'VOR' },
    { id: 'G460', name: 'AIRWAY G460 CORRIDOR', position: { x: 80, y: 50 }, type: 'WAYPOINT' },
  ],
  initialFrames: chrkInitialFrames,
  initialEvents: [
    {
      id: 'EVT-CD-INIT-1',
      timestamp: 0,
      timestampFormatted: 'T+00:00',
      title: 'Reciprocal Airway Ingress',
      description: 'SVA 763 climbing via G460 to FL140; KZA 1907 descending via G460 to FL150.',
      category: 'ATC_INSTRUCTION',
      provenance: 'RECORDED_DATA',
    },
    {
      id: 'EVT-CD-INIT-2',
      timestamp: 25,
      timestampFormatted: 'T+00:25',
      title: 'Approaching Level-off at FL150',
      description: 'Kazakh Il-76 passes through FL155 descending. Delhi approach re-emphasizes maintaining FL150.',
      category: 'RADAR',
      provenance: 'RECORDED_DATA',
      aircraftId: 'KZA1907',
    },
  ],
  checkpoints: [
    {
      id: 'CHK-CHRK-01',
      timestamp: 30,
      timestampFormatted: 'T+00:30',
      title: 'Level-Off Altitude Capture Checkpoint',
      situationBrief:
        'Your aircraft is descending through FL152. Delhi ATC has issued a strict constraint: "Maintain FL150, reciprocal traffic climbing to FL140." Metric altimeters require holding 4,572 meters.',
      userRole: 'KZA 1907 Radio Operator & Navigator',
      contextAlert: 'CRITICAL CONSTRAINED ALTITUDE: FL150 (Only 1,000 FT vertical separation from SVA 763)',
      options: [
        {
          id: 'OPT-CHRK-HOLD',
          branchId: 'BRANCH_HOLD_FL150',
          title: 'Option A: Hold Assigned FL150 (Level Off per ATC Clearance)',
          description: 'Firmly call out level-off to the pilot flying and level the aircraft at FL150 (4,570 m).',
          optionType: 'RECOMMENDED_STANDARD',
          consequenceSummary: 'Aircraft levels off at FL150. Saudi 747 passes 1,000 feet directly underneath at FL140.',
        },
        {
          id: 'OPT-CHRK-DESCENT',
          branchId: 'BRANCH_HISTORICAL_DESCENT',
          title: 'Option B: Historical Continuation of Descent (Metric Translation Ambiguity)',
          description: 'Continue descent to FL140 due to delayed Russian-to-English translation and metric altimeter misreading.',
          optionType: 'HISTORICAL_ACTION',
          consequenceSummary: 'Descent continues through FL140, placing both aircraft on co-altitude collision course in clouds.',
        },
        {
          id: 'OPT-CHRK-LATERAL',
          branchId: 'BRANCH_LATERAL_EVASION',
          title: 'Option C: Immediate Lateral Turn off Airway Centerline',
          description: 'Execute tactical 30° right turn to establish offset from the bidirectional corridor centerline.',
          optionType: 'TACTICAL_ALTERNATIVE',
          consequenceSummary: 'Displaces aircraft 3.2 NM laterally from G460 centerline, avoiding head-on conflict.',
        },
      ],
    },
  ],
  branches: {
    BRANCH_HOLD_FL150: {
      id: 'BRANCH_HOLD_FL150',
      checkpointId: 'CHK-CHRK-01',
      title: 'Branch A: Level-Off at FL150 Held Successfully',
      description: 'The flight crew leveled off at FL150, preserving standard 1,000-foot vertical separation.',
      frames: chrkHoldFrames,
      events: [
        {
          id: 'EVT-CD-BR1',
          timestamp: 35,
          timestampFormatted: 'T+00:35',
          title: 'Altitude Level-Off Captured',
          description: 'KZA 1907 stabilizes at FL150 with zero vertical speed.',
          category: 'CREW_RESPONSE',
          provenance: 'HYPOTHETICAL',
          aircraftId: 'KZA1907',
        },
        {
          id: 'EVT-CD-BR2',
          timestamp: 48,
          timestampFormatted: 'T+00:48',
          title: 'Traffic Overhead Passage',
          description: 'SVA 763 passes directly beneath KZA 1907 with 1,000 ft vertical clearance.',
          category: 'OUTCOME',
          provenance: 'HYPOTHETICAL',
        },
      ],
      outcome: {
        classification: 'SAFE_SEPARATION',
        title: 'Collision Averted — 1,000 FT Standard Vertical Separation Preserved',
        summary: 'Holding assigned altitude FL150 maintained procedural separation in the bidirectional corridor without radar altitude verification.',
        minHorizontalSeparation: '0.8 NM (Overhead pass)',
        minVerticalSeparation: '1,000 FT (Standard vertical separation)',
        isHistoricalBranch: false,
        learningPoints: [
          'In procedural airspace without Mode C radar, altitude discipline is the sole barrier against mid-air collision.',
          'Metric-to-imperial altimeter conversions require cross-crew verification and dedicated conversion plates.',
          'Bidirectional single-track corridors without dedicated unidirectional routes represent severe systemic risk.',
        ],
        comparisonWithReference: 'Averted the catastrophic collision that occurred when KZA 1907 descended to FL140.',
      },
    },
    BRANCH_HISTORICAL_DESCENT: {
      id: 'BRANCH_HISTORICAL_DESCENT',
      checkpointId: 'CHK-CHRK-01',
      title: 'Branch B: Historical Descent Below FL150',
      description: 'KZA 1907 inadvertently descended to FL140, resulting in head-on impact with SVA 763.',
      frames: chrkHistoricalFrames,
      events: [
        {
          id: 'EVT-CD-BRH1',
          timestamp: 40,
          timestampFormatted: 'T+00:40',
          title: 'Penetration of FL140',
          description: 'KZA 1907 descends through 14,100 FT into cloud deck at 900 fpm.',
          category: 'OUTCOME',
          provenance: 'RECORDED_DATA',
        },
        {
          id: 'EVT-CD-BRH2',
          timestamp: 48,
          timestampFormatted: 'T+00:48',
          title: 'Catastrophic Collision at FL140',
          description: 'Ilyushin 76 left wing cuts through Boeing 747 cabin and wing at 590 knots relative velocity.',
          category: 'OUTCOME',
          provenance: 'REPORT_SUPPORTED',
        },
      ],
      outcome: {
        classification: 'CATASTROPHIC_COLLISION',
        title: 'Mid-Air Collision at FL140 over Charkhi Dadri',
        summary: 'Inadvertent descent below assigned FL150 led to catastrophic impact with opposite-direction traffic at FL140.',
        minHorizontalSeparation: '0.0 NM (Impact)',
        minVerticalSeparation: '0 FT (Co-altitude impact)',
        isHistoricalBranch: true,
        learningPoints: [
          'Prompted India to mandate Secondary Surveillance Radar (SSR) with Mode C and bifurcate bidirectional airways into parallel corridors.',
          'Accelerated the worldwide mandate for airborne TCAS II systems on all commercial aircraft above 5,700 kg.',
          'Standardized mandatory ICAO English language proficiency testing for all international flight crews.',
        ],
        comparisonWithReference: 'Exact historical outcome documented in the Lahoti Commission Court of Inquiry Report.',
      },
    },
    BRANCH_LATERAL_EVASION: {
      id: 'BRANCH_LATERAL_EVASION',
      checkpointId: 'CHK-CHRK-01',
      title: 'Branch C: Lateral Airway Offset',
      description: 'Strategic right turn offset from airway corridor centerline eliminated head-on convergence.',
      frames: chrkLateralFrames,
      events: [
        {
          id: 'EVT-CD-BRL1',
          timestamp: 35,
          timestampFormatted: 'T+00:35',
          title: 'Lateral Evasion Initiated',
          description: 'KZA 1907 turns 30° right, deviating 3.2 NM from airway centerline.',
          category: 'CREW_RESPONSE',
          provenance: 'HYPOTHETICAL',
        },
      ],
      outcome: {
        classification: 'NEAR_MID_AIR_COLLISION',
        title: 'Head-On Convergence Disrupted by Lateral Offset',
        summary: 'Even with descent into FL140, lateral offset provided 3.2 NM lateral buffer, averting physical impact.',
        minHorizontalSeparation: '3.2 NM',
        minVerticalSeparation: '0 FT (Co-altitude but laterally displaced)',
        isHistoricalBranch: false,
        learningPoints: [
          'Strategic Lateral Offset Procedures (SLOP) are now standard practice in procedural oceanic and remote airspace.',
        ],
        comparisonWithReference: 'Averted physical collision despite altitude deviation.',
      },
    },
  },
  referenceBranchId: 'BRANCH_HISTORICAL_DESCENT',
};

// Scenario lookup table by incident ID
export const SCENARIOS_BY_INCIDENT_ID: Record<string, SimulationScenario> = {
  'HIST-2002-UBL': UBERLINGEN_SCENARIO,
  'DEMO-2002-UBL': UBERLINGEN_SCENARIO,
  'HIST-1996-CHRK': CHARKHI_DADRI_SCENARIO,
  'DEMO-1996-CHRK': CHARKHI_DADRI_SCENARIO,
};
