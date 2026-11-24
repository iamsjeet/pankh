import { Incident } from '../types/incident';

/**
 * Curated Candidate Research Incidents (Demo Benchmarks)
 * 
 * DATA PROVENANCE NOTICE:
 * Every record, timeline event, and evidence finding contains explicit provenance classifications:
 * - REPORTED_FACT: Ground truth reported in factual investigation chapters.
 * - OFFICIAL_FINDING: Official determinations by state accident investigation boards (BFU, BEA, DGCA, NTSB).
 * - CONTRIBUTING_FACTOR: Systemic, organizational, or human factor finding from final report.
 * - UNKNOWN_OR_UNRESOLVED: Acknowledged ambiguities, data gaps, or unrecoverable telemetry.
 * - DEMO_DATA: Clearly designated illustrative demonstration markers.
 */
export const CURATED_INCIDENTS: Incident[] = [
  {
    id: 'DEMO-2002-UBL',
    title: 'Überlingen Mid-Air Collision: TCAS RA vs ATC Conflict',
    subtitle: 'Conflicting resolution advisories at FL360 in Zurich ACC Airspace',
    date: '2002-07-01',
    location: {
      name: 'Überlingen (Lake Constance)',
      country: 'Germany / Swiss Airspace border',
      fir: 'EDGG / LSAS (Zurich ACC Sector)',
      coordinates: { lat: 47.7667, lng: 9.1667 },
    },
    aircraft: [
      {
        type: 'Tupolev Tu-154M',
        model: 'Tu-154M',
        operator: 'Bashkirian Airlines (BTC 2937)',
        registration: 'RA-85816',
        flightNumber: 'BTC 2937',
        flightPhase: 'En-route Cruise',
        altitude: 'FL360 (36,000 FT)',
        airspeed: 'Mach 0.80 (460 KT TAS)',
        heading: '274° Westbound',
        squawk: 'Squawk 7520',
        tcasEquipment: 'Honeywell TCAS II (Version 7.0)',
        fmsMode: 'NAV / ALT HOLD',
        crewComplement: 'Captain, First Officer, Navigator, Flight Engineer, Copilot in training',
      },
      {
        type: 'Boeing 757-200PF',
        model: 'B757-23APF',
        operator: 'DHL Aviation (DHX 611)',
        registration: 'A9C-DHL',
        flightNumber: 'DHX 611',
        flightPhase: 'En-route Cruise',
        altitude: 'FL360 (36,000 FT)',
        airspeed: 'Mach 0.81 (475 KT TAS)',
        heading: '004° Northbound',
        squawk: 'Squawk 6117',
        tcasEquipment: 'Honeywell TCAS II (Version 7.0)',
        fmsMode: 'LNAV / VNAV ALT',
        crewComplement: 'Captain, First Officer',
      },
    ],
    category: 'Mid-Air Collision & Loss of Separation',
    severity: 'Catastrophic',
    summary:
      'Bashkirian Flight 2937 and DHL Flight 611 collided at flight level 360 over Überlingen, Germany. The Bashkirian crew complied with a Swiss air traffic controller verbal instruction to descend, while their TCAS II system generated a Climb advisory. Concurrently, the DHL crew complied with a TCAS Descend advisory, placing both aircraft on converging descent trajectories.',
    executiveSummary: {
      overview:
        'On 1 July 2002 at 21:35:32 UTC, a Russian passenger airliner (Tu-154M) and an American-built cargo transport (B757-200PF) collided mid-air in uncontrolled convergence at FL360 over Überlingen near Lake Constance.',
      safetyIssue:
        'Systemic contradiction between national air traffic regulations and ICAO operational procedures regarding whether flight crews should prioritize onboard TCAS Resolution Advisories (RA) or conflicting verbal ATC instructions.',
      outcome:
        'Complete loss of both aircraft with 71 fatalities. The disaster prompted a worldwide amendment to ICAO Annex 2 mandating that pilots must strictly follow TCAS RA advisories over conflicting air traffic controller instructions.',
    },
    source: {
      organization: 'BFU (German Federal Bureau of Aircraft Accident Investigation)',
      reportTitle: 'Investigation Report: Mid-Air Collision Überlingen / Lake Constance',
      reportDocumentId: 'BFU AX001-1-2/02',
      isOfficialReport: true,
      publishedYear: 2004,
    },
    provenance: {
      isDemo: true,
      verificationStatus: 'DEMO_BENCHMARK',
      disclaimer:
        'Curated candidate benchmark for TCAS RA logic vs ATC command conflict research. Derived from official BFU Final Report AX001-1-2/02.',
    },
    keyFactors: [
      'Conflicting TCAS Climb RA and ATC verbal descent instruction',
      'Single controller managing two frequency workstations',
      'Optical Collision Warning (STCA) was deactivated for maintenance',
      'Air traffic control telephone lines inoperative',
    ],
    timeline: [
      {
        id: 'EVT-UBL-01',
        timestamp: '21:30:11 UTC',
        relativeSeconds: -321,
        title: 'Initial Convergence on Corridors UZ221 and UN850',
        description:
          'BTC 2937 (FL360, heading 274°) and DHX 611 (FL360, heading 004°) establish steady cruise on crossing trajectories at intersection point near Lake Constance.',
        category: 'RADAR_TRACK',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'Both',
        flightParameters: { altitude: 'FL360', airspeed: 'Mach 0.80', heading: 'Crossing' },
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.1 History of the Flight',
          page: 6,
          agency: 'BFU',
        },
      },
      {
        id: 'EVT-UBL-02',
        timestamp: '21:34:34 UTC',
        relativeSeconds: -58,
        title: 'TCAS Traffic Advisory (TA) Generated',
        description:
          'Both aircraft receive visual and acoustic Traffic Advisories (TA) indicating converging traffic within 40 seconds of closest point of approach.',
        category: 'SYSTEM_ALERT',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'Both',
        flightParameters: { altitude: 'FL360 / FL360', verticalSpeed: '0 FPM' },
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.1 History of the Flight',
          page: 8,
          agency: 'BFU',
        },
      },
      {
        id: 'EVT-UBL-03',
        timestamp: '21:34:42 UTC',
        relativeSeconds: -50,
        title: 'Coordinated TCAS Resolution Advisories (RA)',
        description:
          'TCAS transponder data exchange triggers coordinated RAs: DHX 611 receives "DESCEND, DESCEND", while BTC 2937 receives "CLIMB, CLIMB".',
        category: 'SYSTEM_ALERT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'Both',
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.18.2 TCAS Event Recording',
          page: 72,
          agency: 'BFU',
        },
      },
      {
        id: 'EVT-UBL-04',
        timestamp: '21:34:49 UTC',
        relativeSeconds: -43,
        title: 'Zurich ATC Issues Conflicting Descent Clearance',
        description:
          'Zurich controller, unaware of TCAS advisories and managing an approach at Friedrichshafen on a second console, commands BTC 2937 to "descend flight level 350, expedite".',
        category: 'ATC_COMMUNICATION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'BTC 2937',
        flightParameters: { altitude: 'FL360', verticalSpeed: '-1,500 FPM initiated' },
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.1 History of the Flight',
          page: 9,
          agency: 'BFU',
        },
      },
      {
        id: 'EVT-UBL-05',
        timestamp: '21:34:56 UTC',
        relativeSeconds: -36,
        title: 'BTC 2937 TCAS Issues "INCREASE CLIMB" Reversal',
        description:
          'Because BTC 2937 was descending contrary to the initial Climb RA, TCAS logic sensed worsening geometry and escalated to an acoustic "INCREASE CLIMB, INCREASE CLIMB".',
        category: 'SYSTEM_ALERT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'BTC 2937',
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '2.2 Analysis of Flight Crew Actions',
          page: 91,
          agency: 'BFU',
        },
      },
      {
        id: 'EVT-UBL-06',
        timestamp: '21:35:03 UTC',
        relativeSeconds: -29,
        title: 'Second ATC Descent Instruction Confirms Error',
        description:
          'Controller repeats descent instruction to BTC 2937 with incorrect traffic position report: "Check traffic at 2 o\'clock", whereas DHX 611 was approaching from 10 o\'clock.',
        category: 'ATC_COMMUNICATION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'BTC 2937',
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.1 History of the Flight',
          page: 10,
          agency: 'BFU',
        },
      },
      {
        id: 'EVT-UBL-07',
        timestamp: '21:35:32 UTC',
        relativeSeconds: 0,
        title: 'Mid-Air Impact at FL348',
        description:
          'DHX 611 vertical stabilizer slices through the fuselage of BTC 2937 at an altitude of 34,890 feet. Both aircraft break up in flight.',
        category: 'COLLISION_EVENT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'Both',
        flightParameters: { altitude: 'FL348 (34,890 FT)', airspeed: '480 KT' },
        sourceReference: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.1 History of the Flight',
          page: 12,
          agency: 'BFU',
        },
      },
    ],
    evidence: [
      {
        id: 'EVD-UBL-01',
        category: 'REPORTED_FACT',
        claim: 'BTC 2937 crew responded to ATC descent clearance rather than TCAS Climb RA.',
        detail:
          'Flight Data Recorder (FDR) and Cockpit Voice Recorder (CVR) confirm that the Russian flight crew initiated pitch-down within 2 seconds of the controller command, disengaging the autopilot and pitching into a 1,800 fpm descent.',
        source: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.11 Flight Recorders',
          page: 38,
          agency: 'BFU',
        },
        provenance: 'REPORTED_FACT',
      },
      {
        id: 'EVD-UBL-02',
        category: 'OFFICIAL_FINDING',
        claim: 'Swiss Air Navigation Services (Skyguide) operating procedures permitted solo controller staffing during maintenance.',
        detail:
          'The BFU concluded that Skyguide operational management had tolerated single-person night shifts during periods when major ground surveillance and communications systems were simultaneously taken offline for maintenance.',
        source: {
          document: 'BFU Report AX001-1-2/02',
          section: '3.2 Causes / Contributing Factors',
          page: 114,
          agency: 'BFU',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-UBL-03',
        category: 'CONTRIBUTING_FACTOR',
        claim: 'Lack of unified international protocol on pilot TCAS authority.',
        detail:
          'Russian flight operations manual (FOM) contained ambiguous wording suggesting pilot discretion between ATC and TCAS, whereas Boeing/FAA manuals strictly mandated prioritizing TCAS RAs.',
        source: {
          document: 'BFU Report AX001-1-2/02',
          section: '2.3 Systemic Air Navigation Rules',
          page: 98,
          agency: 'BFU',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-UBL-04',
        category: 'CONTRIBUTING_FACTOR',
        claim: 'Optical Short-Term Conflict Alert (STCA) was switched off without controller awareness.',
        detail:
          'The automated visual conflict warning on the controller radar display was running in fallback bypass mode due to software servicing, eliminating early warning acoustic alerts at the Zurich ACC workstation.',
        source: {
          document: 'BFU Report AX001-1-2/02',
          section: '1.18.1 Radar Data Processing Systems',
          page: 64,
          agency: 'BFU',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-UBL-05',
        category: 'UNKNOWN_OR_UNRESOLVED',
        claim: 'Controller psychological latency and fatigue metrics at the moment of handover.',
        detail:
          'While post-accident assessments established that the controller had worked consecutive hours without relief, exact physiological cognitive impairment was not measurable from available recorded data.',
        source: {
          document: 'BFU Report AX001-1-2/02',
          section: '2.1 Human Factors Analysis',
          page: 84,
          agency: 'BFU',
        },
        provenance: 'HUMAN_ASSUMPTION',
        verificationNotes: 'Classified under human assumption due to absence of real-time bio-telemetry.',
      },
    ],
    simulationReady: true,
    interactiveBranchingAvailable: true,
    timelineEventCount: 7,
  },
  {
    id: 'DEMO-2009-AF447',
    title: 'Air France Flight 447: High Altitude Pitot Icing & Aerodynamic Stall',
    subtitle: 'Unreliable airspeed indications in Intertropical Convergence Zone at FL350',
    date: '2009-06-01',
    location: {
      name: 'Atlantic Ocean (Equatorial Sector)',
      country: 'International Airspace',
      fir: 'SBAO (Atlántico Oceanic FIR)',
      coordinates: { lat: 3.0658, lng: -30.5628 },
    },
    aircraft: [
      {
        type: 'Airbus A330-203',
        model: 'A330-200',
        operator: 'Air France (AFR 447)',
        registration: 'F-GZCP',
        flightNumber: 'AFR 447',
        flightPhase: 'En-route Cruise',
        altitude: 'FL350 (35,000 FT)',
        airspeed: 'Mach 0.82 (initial) dropping to 60 KT (deep stall)',
        heading: '001° Northbound',
        squawk: 'Squawk 0422',
        tcasEquipment: 'TCAS II (Thales Avionics)',
        fmsMode: 'NAV / ALT CRZ',
        crewComplement: 'Captain (resting), Relief Pilot (monitoring), Co-Pilot (pilot flying)',
      },
    ],
    category: 'Sensor Discrepancy & Aerodynamic Stall',
    severity: 'Catastrophic',
    summary:
      'Air France 447 encountered convective weather and supercooled liquid droplets in the Intertropical Convergence Zone. Ice crystals clogged all three pitot probes for approximately one minute, disabling autopilot and auto-thrust. Flight crew nose-up pitch inputs provoked a prolonged high-altitude aerodynamic stall.',
    executiveSummary: {
      overview:
        'On 1 June 2009 at 02:14 UTC, an Airbus A330 operating a scheduled flight from Rio de Janeiro to Paris crashed into the Atlantic Ocean after entering an aerodynamic stall at FL380 from which the crew did not recover.',
      safetyIssue:
        'Temporary obstruction of Pitot probes by high-density ice crystals causing sudden airspeed disagreement, disconnection of automated flight systems, and crew failure to diagnose stall conditions.',
      outcome:
        'Loss of aircraft with 228 fatalities. Led to redesign of Thales pitot tubes, mandatory upset recovery training (UPRT) across global commercial aviation, and new regulations on stall warning displays at high angles of attack.',
    },
    source: {
      organization: 'BEA (Bureau d’Enquêtes et d’Analyses, France)',
      reportTitle: 'Final Report on the Accident on 1st June 2009 to the Airbus A330-203, F-GZCP',
      reportDocumentId: 'BEA f-cp090601',
      isOfficialReport: true,
      publishedYear: 2012,
    },
    provenance: {
      isDemo: true,
      verificationStatus: 'DEMO_BENCHMARK',
      disclaimer:
        'Curated candidate benchmark for aerodynamic sensor discrepancy, alternate law transitions and stall recovery research. Derived from official BEA Final Report.',
    },
    keyFactors: [
      'Temporary blockage of Pitot probes by ice crystals',
      'Transition from Normal to Alternate Law without stall protections',
      'Persistent nose-up sidestick command despite stall warnings',
      'Lack of situational awareness regarding aerodynamic stall onset',
    ],
    timeline: [
      {
        id: 'EVT-AF447-01',
        timestamp: '02:10:05 UTC',
        relativeSeconds: -265,
        title: 'Autopilot Disconnection & Pitot Tube Icing',
        description:
          'Ice crystals clog the three Thales Pitot probes within seconds. Measured airspeed drops abruptly from 274 KT to 52 KT. Autopilot and auto-thrust disconnect automatically.',
        category: 'SYSTEM_ALERT',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'AFR 447',
        flightParameters: { altitude: 'FL350', airspeed: '52 KT (Erroneous)', heading: '001°' },
        sourceReference: {
          document: 'BEA Final Report f-cp090601',
          section: '1.16.2 Flight Control Reconfiguration',
          page: 68,
          agency: 'BEA',
        },
      },
      {
        id: 'EVT-AF447-02',
        timestamp: '02:10:07 UTC',
        relativeSeconds: -263,
        title: 'Flight Control Law Degradation to Alternate 2B',
        description:
          'Due to invalid airspeed data, the fly-by-wire computers transition from Normal Law to Alternate 2B Law. High angle-of-attack protection and pitch trim protections are lost.',
        category: 'SYSTEM_ALERT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'AFR 447',
        sourceReference: {
          document: 'BEA Final Report f-cp090601',
          section: '1.16.2 Flight Control Reconfiguration',
          page: 70,
          agency: 'BEA',
        },
      },
      {
        id: 'EVT-AF447-03',
        timestamp: '02:10:16 UTC',
        relativeSeconds: -254,
        title: 'Nose-Up Sidestick Input & Climb to FL380',
        description:
          'The Pilot Flying (PF) applies nose-up pitch commands on the right sidestick. The aircraft initiates a rapid zoom climb at up to 7,000 fpm, climbing from FL350 to FL380.',
        category: 'FLIGHT_CREW_ACTION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'AFR 447',
        flightParameters: { altitude: 'Climbing through FL375', verticalSpeed: '+7,000 FPM' },
        sourceReference: {
          document: 'BEA Final Report f-cp090601',
          section: '2.1 Analysis of Flight Crew Behavior',
          page: 168,
          agency: 'BEA',
        },
      },
      {
        id: 'EVT-AF447-04',
        timestamp: '02:10:51 UTC',
        relativeSeconds: -219,
        title: 'Initial Continuous Stall Warning Triggers',
        description:
          'Angle of attack exceeds the stall warning threshold. Acoustic "STALL, STALL" cricket horn sounds continuously in the cockpit for 54 seconds.',
        category: 'SYSTEM_ALERT',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'AFR 447',
        sourceReference: {
          document: 'BEA Final Report f-cp090601',
          section: '1.16.4 Stall Warning System Logic',
          page: 82,
          agency: 'BEA',
        },
      },
      {
        id: 'EVT-AF447-05',
        timestamp: '02:11:45 UTC',
        relativeSeconds: -165,
        title: 'Aerodynamic Stall & Trimmable Horizontal Stabilizer (THS) Full Up',
        description:
          'The aircraft enters a developed aerodynamic stall. Autotrim system drives the THS stabilizer to 13° pitch-up, locking the aircraft into a deep stall attitude.',
        category: 'SYSTEM_ALERT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'AFR 447',
        flightParameters: { altitude: 'FL380 (Peak)', verticalSpeed: '-10,000 FPM descending' },
        sourceReference: {
          document: 'BEA Final Report f-cp090601',
          section: '2.2 Aerodynamic Analysis',
          page: 184,
          agency: 'BEA',
        },
      },
      {
        id: 'EVT-AF447-06',
        timestamp: '02:14:28 UTC',
        relativeSeconds: 0,
        title: 'Ocean Surface Impact at High Vertical Speed',
        description:
          'Aircraft impacts the sea surface with 16° pitch-up attitude, zero bank, but a descent rate of nearly 11,000 feet per minute (152 KT forward, 10,900 fpm vertical).',
        category: 'COLLISION_EVENT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'AFR 447',
        flightParameters: { altitude: '0 FT', verticalSpeed: '-10,912 FPM' },
        sourceReference: {
          document: 'BEA Final Report f-cp090601',
          section: '1.12 Wreckage and Impact Information',
          page: 44,
          agency: 'BEA',
        },
      },
    ],
    evidence: [
      {
        id: 'EVD-AF447-01',
        category: 'REPORTED_FACT',
        claim: 'Pitot tubes were obstructed by ice crystals for approximately 56 seconds.',
        detail:
          'FDR recorded recovery of valid airspeed on left and right probes after approximately 56 seconds, confirming obstruction was temporary and reversible.',
        source: {
          document: 'BEA Final Report f-cp090601',
          section: '1.16.1 Pitot Probes History',
          page: 58,
          agency: 'BEA',
        },
        provenance: 'REPORTED_FACT',
      },
      {
        id: 'EVD-AF447-02',
        category: 'OFFICIAL_FINDING',
        claim: 'Stall warning logic inhibited audio below 60 knots indicated airspeed.',
        detail:
          'When forward airspeed dropped below 60 knots, the system treated angle-of-attack values as invalid, silencing the stall warning; when pilot pitched down, airspeed increased above 60 kt, perversely sounding the warning again.',
        source: {
          document: 'BEA Final Report f-cp090601',
          section: '2.1.2 Warning System Ambiguities',
          page: 174,
          agency: 'BEA',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-AF447-03',
        category: 'CONTRIBUTING_FACTOR',
        claim: 'Lack of cockpit cross-coupling and tactile feedback on passive sidesticks.',
        detail:
          'Because Airbus sidesticks are not mechanically linked and do not back-drive, the pilot monitoring on the left did not perceive that the pilot flying on the right held full backstick for minutes.',
        source: {
          document: 'BEA Final Report f-cp090601',
          section: '2.3 Human-Machine Interface',
          page: 196,
          agency: 'BEA',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-AF447-04',
        category: 'UNKNOWN_OR_UNRESOLVED',
        claim: 'Exact crew mental model regarding why stall was never vocalized.',
        detail:
          'Neither pilot explicitly mentioned the word "stall" during the 3.5-minute descent despite repeated aural warnings. The cognitive rationale remains an expert retrospective hypothesis.',
        source: {
          document: 'BEA Final Report f-cp090601',
          section: '2.4 Psychological & Cognitive Factors',
          page: 202,
          agency: 'BEA',
        },
        provenance: 'HUMAN_ASSUMPTION',
      },
    ],
    simulationReady: true,
    interactiveBranchingAvailable: true,
    timelineEventCount: 6,
  },
  {
    id: 'DEMO-1996-CHRK',
    title: 'Charkhi Dadri Collision: Bidirectional Corridor Altitude Deviation',
    subtitle: 'Head-on convergence at FL140 in airway corridor G460 near Delhi',
    date: '1996-11-12',
    location: {
      name: 'Charkhi Dadri, Haryana',
      country: 'India',
      fir: 'VIDF (Delhi FIR)',
      coordinates: { lat: 28.5925, lng: 76.2711 },
    },
    aircraft: [
      {
        type: 'Boeing 747-168B',
        model: 'B747-100B',
        operator: 'Saudi Arabian Airlines (SVA 763)',
        registration: 'HZ-AIH',
        flightNumber: 'SVA 763',
        flightPhase: 'Climb / Departure',
        altitude: 'FL140 (14,000 FT) cleared climbing',
        airspeed: '310 KT IAS',
        heading: '260° Westbound',
        squawk: 'Squawk 3122',
        tcasEquipment: 'Not equipped (pre-mandate)',
        fmsMode: 'Standard VOR/DME RNAV',
        crewComplement: 'Captain, First Officer, Flight Engineer',
      },
      {
        type: 'Ilyushin Il-76TD',
        model: 'Il-76TD',
        operator: 'Kazakhstan Airlines (KZA 1907)',
        registration: 'UN-76435',
        flightNumber: 'KZA 1907',
        flightPhase: 'Terminal Descent',
        altitude: 'FL140 (assigned FL150)',
        airspeed: '280 KT IAS',
        heading: '080° Eastbound',
        squawk: 'Squawk 4612',
        tcasEquipment: 'Not equipped (pre-mandate)',
        fmsMode: 'Manual flight via electromechanical instruments in metric units',
        crewComplement: 'Captain, First Officer, Navigator, Radio Operator, Flight Engineer',
      },
    ],
    category: 'Mid-Air Collision & Loss of Separation',
    severity: 'Catastrophic',
    summary:
      'Saudi Arabian Flight 763 (departing Delhi for Dhahran, cleared climbing to FL140) and Kazakhstan Airlines Flight 1907 (inbound to Delhi, cleared descending to FL150) collided head-on in airway G460. The Ilyushin crew descended below assigned altitude FL150 into the flight path of the climbing Boeing 747.',
    executiveSummary: {
      overview:
        'On 12 November 1996 at 18:40 IST (13:10 UTC), a departing Boeing 747 and an inbound Ilyushin Il-76 collided head-on at FL140 over the town of Charkhi Dadri, Haryana, approximately 75 km west of New Delhi.',
      safetyIssue:
        'Unauthorized descent by an inbound transport aircraft on a single bidirectional airway corridor without Secondary Surveillance Radar (SSR) Mode C altitude verification.',
      outcome:
        'Deadliest mid-air collision in aviation history (349 fatalities). Spurred the mandatory adoption of TCAS II on commercial airliners worldwide and rapid installation of SSR monopulse radar across Indian airspace.',
    },
    source: {
      organization: 'DGCA India / Lahoti Commission of Inquiry',
      reportTitle: 'Report of the Court of Inquiry on Mid-Air Collision near Charkhi Dadri',
      reportDocumentId: 'DGCA Lahoti Report 1997',
      isOfficialReport: true,
      publishedYear: 1997,
    },
    provenance: {
      isDemo: true,
      verificationStatus: 'DEMO_BENCHMARK',
      disclaimer:
        'Curated candidate benchmark for terminal corridor altitude compliance and procedural separation research. Derived from the Lahoti Commission Investigation Report.',
    },
    keyFactors: [
      'Unintentional altitude descent by inbound aircraft to FL140',
      'Absence of secondary surveillance radar (SSR) at Delhi ATC at the time',
      'Language comprehension challenges between radio operator and flight deck',
      'Single bidirectional airway corridor for departures and arrivals',
    ],
    timeline: [
      {
        id: 'EVT-CHRK-01',
        timestamp: '13:04 UTC',
        title: 'SVA 763 Cleared to Depart Delhi on Airway G460',
        description:
          'Saudi 763 departs Runway 28 at Indira Gandhi International Airport, cleared climbing via DPN VOR on airway G460 to FL140.',
        category: 'ATC_COMMUNICATION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'SVA 763',
        flightParameters: { altitude: 'Climbing through 8,000 FT', heading: '260°' },
        sourceReference: {
          document: 'Lahoti Inquiry Report',
          section: 'Chapter 2 Factual Information',
          page: 14,
          agency: 'DGCA India',
        },
      },
      {
        id: 'EVT-CHRK-02',
        timestamp: '13:07 UTC',
        title: 'KZA 1907 Cleared to Descend to FL150',
        description:
          'Delhi approach clears inbound Kazakhstan 1907 to descend to FL150. Controller instructs KZA 1907 to maintain FL150 due to opposite-direction climbing traffic at FL140.',
        category: 'ATC_COMMUNICATION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'KZA 1907',
        flightParameters: { altitude: 'Descending through FL160', heading: '080°' },
        sourceReference: {
          document: 'Lahoti Inquiry Report',
          section: 'Chapter 2 Factual Information',
          page: 18,
          agency: 'DGCA India',
        },
      },
      {
        id: 'EVT-CHRK-03',
        timestamp: '13:09:40 UTC',
        title: 'KZA 1907 Descends Below Assigned Altitude FL150',
        description:
          'CVR analysis shows the Kazakh aircraft continued descending past FL150 to FL140. The radio operator was translating ATC communications, while pilots were flying in metric altimeter units.',
        category: 'FLIGHT_CREW_ACTION',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'KZA 1907',
        flightParameters: { altitude: 'FL141 (14,100 FT)', verticalSpeed: '-900 FPM' },
        sourceReference: {
          document: 'Lahoti Inquiry Report',
          section: 'Chapter 4 Analysis',
          page: 62,
          agency: 'DGCA India',
        },
      },
      {
        id: 'EVT-CHRK-04',
        timestamp: '13:10:20 UTC',
        title: 'Head-On Impact at FL140 in Cloud Layer',
        description:
          'The tail and left wing of the Kazakh Il-76 sliced through the left wing and cabin of the Saudi 747 in IMC conditions. Both aircraft plunged into fields near Charkhi Dadri.',
        category: 'COLLISION_EVENT',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'Both',
        flightParameters: { altitude: 'FL140 (14,000 FT)', airspeed: '590 KT closure rate' },
        sourceReference: {
          document: 'Lahoti Inquiry Report',
          section: 'Chapter 5 Findings',
          page: 78,
          agency: 'DGCA India',
        },
      },
    ],
    evidence: [
      {
        id: 'EVD-CHRK-01',
        category: 'OFFICIAL_FINDING',
        claim: 'Kazakh crew inadvertently descended to 14,000 feet instead of holding assigned 15,000 feet.',
        detail:
          'FDR analysis recovered from the Ilyushin 76 confirmed level-off at 13,700 feet before a panicked last-second climb pullup was executed seconds before collision.',
        source: {
          document: 'Lahoti Inquiry Report',
          section: 'Flight Data Recorder Evaluation',
          page: 54,
          agency: 'DGCA India',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-CHRK-02',
        category: 'CONTRIBUTING_FACTOR',
        claim: 'Communication latency and cockpit division of duties.',
        detail:
          'Only the radio operator held operational English proficiency; pilots operated exclusively in Russian and relied on delayed verbal translation while reading metric instruments.',
        source: {
          document: 'Lahoti Inquiry Report',
          section: 'Human Factor and Cockpit Resource Management',
          page: 70,
          agency: 'DGCA India',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-CHRK-03',
        category: 'REPORTED_FACT',
        claim: 'Delhi Airport was operating with primary radar only; SSR with Mode C was not yet active.',
        detail:
          'The air traffic controller had only a two-dimensional blip on the primary radar screen without automated altitude verification.',
        source: {
          document: 'Lahoti Inquiry Report',
          section: 'Air Traffic Services Infrastructure',
          page: 32,
          agency: 'DGCA India',
        },
        provenance: 'REPORTED_FACT',
      },
      {
        id: 'EVD-CHRK-04',
        category: 'UNKNOWN_OR_UNRESOLVED',
        claim: 'Specific cloud thickness and visual meteorological line of sight between aircraft.',
        detail:
          'Ground witnesses reported overcast cloud layer at FL130-FL150, but exact visual range between cockpits at dusk could not be definitively reconstructed.',
        source: {
          document: 'Lahoti Inquiry Report',
          section: 'Meteorological Data',
          page: 26,
          agency: 'DGCA India',
        },
        provenance: 'HUMAN_ASSUMPTION',
      },
    ],
    simulationReady: true,
    interactiveBranchingAvailable: true,
    timelineEventCount: 4,
  },
  {
    id: 'DEMO-2017-SFO',
    title: 'San Francisco Taxiway Overflight: Nighttime Visual Approach Alignment',
    subtitle: 'Narrow runway-taxiway confusion during parallel visual approach to Runway 28R',
    date: '2017-07-07',
    location: {
      name: 'San Francisco International Airport (KSFO)',
      country: 'United States',
      fir: 'KZOA (Oakland ARTCC)',
      coordinates: { lat: 37.6213, lng: -122.379 },
    },
    aircraft: [
      {
        type: 'Airbus A320-211',
        model: 'A320-200',
        operator: 'Air Canada (ACA 759)',
        registration: 'C-FKCK',
        flightNumber: 'ACA 759',
        flightPhase: 'Final Visual Approach',
        altitude: '59 FT AGL at lowest point',
        airspeed: '136 KT',
        heading: '284°',
        squawk: 'Squawk 2411',
        tcasEquipment: 'TCAS II (Honeywell)',
        fmsMode: 'FMS LOC / VISUAL 28R',
        crewComplement: 'Captain, First Officer',
      },
    ],
    category: 'Runway & Ground Safety',
    severity: 'Serious Incident',
    summary:
      'Air Canada 759, cleared to land on Runway 28R at KSFO, inadvertently lined up with parallel Taxiway C, where four fully loaded commercial aircraft were queued awaiting takeoff. The crew initiated a go-around, passing approximately 59 feet above the ground aircraft.',
    executiveSummary: {
      overview:
        'On 7 July 2017 at 23:56 PDT, Air Canada Flight 759 lined up with parallel Taxiway C instead of Runway 28R during a visual approach to San Francisco International Airport.',
      safetyIssue:
        'Parallel runway illusion and pilot expectation bias caused by temporary closure and dark-out of Runway 28L.',
      outcome:
        'Timely go-around averted what would have been a catastrophic ground collision with four loaded airliners carrying over 1,000 passengers.',
    },
    source: {
      organization: 'NTSB (National Transportation Safety Board, USA)',
      reportTitle: 'Taxiway Overflight: Air Canada Flight 759 at San Francisco International Airport',
      reportDocumentId: 'NTSB/AIR-18/01',
      isOfficialReport: true,
      publishedYear: 2018,
    },
    provenance: {
      isDemo: true,
      verificationStatus: 'DEMO_BENCHMARK',
      disclaimer:
        'Curated candidate benchmark for visual alignment and low-altitude go-around decision point research. Derived from NTSB Final Report.',
    },
    keyFactors: [
      'Adjacent runway (28L) closure and darkened lighting conditions',
      'Visual misidentification of Taxiway C as Runway 28R',
      'Surface detection system alert late response',
      'Timely pilot go-around execution',
    ],
    timeline: [
      {
        id: 'EVT-SFO-01',
        timestamp: '23:55:40 PDT',
        title: 'Cleared for Visual Approach Runway 28R',
        description:
          'SFO Tower clears ACA 759 to land on Runway 28R. Runway 28L is closed with lights extinguished and an illuminated flashing white "X" at the threshold.',
        category: 'ATC_COMMUNICATION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'ACA 759',
        flightParameters: { altitude: '800 FT AGL', airspeed: '142 KT', heading: '284°' },
        sourceReference: {
          document: 'NTSB/AIR-18/01',
          section: '1.1 History of Flight',
          page: 2,
          agency: 'NTSB',
        },
      },
      {
        id: 'EVT-SFO-02',
        timestamp: '23:56:01 PDT',
        title: 'Crew Misidentifies Taxiway C as Runway 28R',
        description:
          'The pilots mistake illuminated Runway 28R for 28L, and consequently mistake Taxiway C (which had four waiting passenger jets) for Runway 28R.',
        category: 'FLIGHT_CREW_ACTION',
        provenance: 'OFFICIAL_FINDING',
        aircraftInvolved: 'ACA 759',
        flightParameters: { altitude: '300 FT AGL', airspeed: '138 KT' },
        sourceReference: {
          document: 'NTSB/AIR-18/01',
          section: '2.1 Approach Alignment Analysis',
          page: 38,
          agency: 'NTSB',
        },
      },
      {
        id: 'EVT-SFO-03',
        timestamp: '23:56:22 PDT',
        title: 'Go-Around Initiated at 59 Feet AGL',
        description:
          'Pilots of United Airlines 1 (waiting on taxiway) turn on landing lights and radio "Where is this guy going?". Air Canada crew simultaneously applies takeoff/go-around thrust, overflying the line of aircraft by 59 feet.',
        category: 'FLIGHT_CREW_ACTION',
        provenance: 'REPORTED_FACT',
        aircraftInvolved: 'ACA 759',
        flightParameters: { altitude: '59 FT AGL (Minimum Altitude)', airspeed: '136 KT' },
        sourceReference: {
          document: 'NTSB/AIR-18/01',
          section: '1.1 History of Flight',
          page: 6,
          agency: 'NTSB',
        },
      },
    ],
    evidence: [
      {
        id: 'EVD-SFO-01',
        category: 'REPORTED_FACT',
        claim: 'Minimum separation between ACA 759 and Boeing 787 on Taxiway C was 59 feet.',
        detail:
          'Radar and video analysis confirmed lowest wheel height of 59 feet AGL while passing over the vertical stabilizer of Philippine Airlines Flight 115.',
        source: {
          document: 'NTSB/AIR-18/01',
          section: '1.11 Flight Track Reconstruction',
          page: 22,
          agency: 'NTSB',
        },
        provenance: 'REPORTED_FACT',
      },
      {
        id: 'EVD-SFO-02',
        category: 'OFFICIAL_FINDING',
        claim: 'Flight crew did not tune the ILS frequency for electronic glidepath guidance during the visual approach.',
        detail:
          'Had the crew backed up the visual approach with the available instrument landing system frequency, the lateral localizer deviation needle would have alerted them to the alignment error.',
        source: {
          document: 'NTSB/AIR-18/01',
          section: '2.2 Procedural Adherence',
          page: 44,
          agency: 'NTSB',
        },
        provenance: 'OFFICIAL_FINDING',
      },
      {
        id: 'EVD-SFO-03',
        category: 'CONTRIBUTING_FACTOR',
        claim: 'Tower controller was preoccupied with coordinating an off-airport vehicle transfer.',
        detail:
          'The local controller was looking away from the radar display during the critical 12 seconds prior to the go-around initiation.',
        source: {
          document: 'NTSB/AIR-18/01',
          section: '2.3 Air Traffic Control Oversight',
          page: 52,
          agency: 'NTSB',
        },
        provenance: 'OFFICIAL_FINDING',
      },
    ],
    simulationReady: true,
    interactiveBranchingAvailable: true,
    timelineEventCount: 3,
  },
];
