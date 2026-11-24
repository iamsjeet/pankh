import { CuratedAnswer, SuggestedQuestion } from '../types/assistant';

/**
 * Curated Deterministic Knowledge Base
 * 
 * DESIGN PRINCIPLES:
 * 1. Curated answers explicitly cite existing evidence IDs (e.g. EVD-UBL-01) from the incident's dataset.
 * 2. Every statement maintains strict provenance tracking (REPORTED_FACT vs OFFICIAL_FINDING vs HUMAN_ASSUMPTION).
 * 3. Confidence scores are derived from whether the official investigation reached unanimous forensic consensus.
 * 4. Transparent fallbacks trigger when queries fall outside curated evidence.
 */

export const CURATED_SUGGESTED_QUESTIONS: Record<string, SuggestedQuestion[]> = {
  'HIST-2002-UBL': [
    {
      id: 'Q-UBL-01',
      question: 'What caused the collision between BTC 2937 and DHX 611?',
      category: 'CAUSE',
      intentKey: 'UBL_PRIMARY_CAUSE',
    },
    {
      id: 'Q-UBL-02',
      question: 'Why did the Russian crew follow the controller instead of TCAS?',
      category: 'SYSTEMS',
      intentKey: 'UBL_TCAS_VS_ATC',
    },
    {
      id: 'Q-UBL-03',
      question: 'Can you explain the chronological sequence of events before impact?',
      category: 'TIMELINE',
      intentKey: 'UBL_TIMELINE',
    },
    {
      id: 'Q-UBL-04',
      question: 'What organizational and ground radar failures contributed to the accident?',
      category: 'CONTRIBUTING_FACTORS',
      intentKey: 'UBL_CONTRIBUTING_FACTORS',
    },
    {
      id: 'Q-UBL-05',
      question: 'What did the German BFU investigation officially conclude?',
      category: 'EVIDENCE',
      intentKey: 'UBL_OFFICIAL_FINDINGS',
    },
    {
      id: 'Q-UBL-06',
      question: 'What safety regulations were amended to prevent recurrence?',
      category: 'PREVENTION',
      intentKey: 'UBL_PREVENTION_LESSONS',
    },
    {
      id: 'Q-UBL-07',
      question: 'Which facts or psychological metrics remain uncertain?',
      category: 'EVIDENCE',
      intentKey: 'UBL_UNCERTAINTIES',
    },
  ],

  'HIST-2009-AF447': [
    {
      id: 'Q-AF447-01',
      question: 'What caused Air France 447 to crash in the Atlantic Ocean?',
      category: 'CAUSE',
      intentKey: 'AF447_PRIMARY_CAUSE',
    },
    {
      id: 'Q-AF447-02',
      question: 'How did the Pitot tube icing trigger the loss of flight protections?',
      category: 'SYSTEMS',
      intentKey: 'AF447_PITOT_ALTERNATE_LAW',
    },
    {
      id: 'Q-AF447-03',
      question: 'Why did the flight crew hold nose-up sidestick during the stall?',
      category: 'CONTRIBUTING_FACTORS',
      intentKey: 'AF447_CREW_BEHAVIOR',
    },
    {
      id: 'Q-AF447-04',
      question: 'Why did the stall warning horn stop sounding when airspeed dropped below 60 knots?',
      category: 'SYSTEMS',
      intentKey: 'AF447_STALL_WARNING_LOGIC',
    },
    {
      id: 'Q-AF447-05',
      question: 'What did the French BEA investigation officially conclude?',
      category: 'EVIDENCE',
      intentKey: 'AF447_OFFICIAL_FINDINGS',
    },
    {
      id: 'Q-AF447-06',
      question: 'What aspects of crew cognitive awareness remain unresolved?',
      category: 'EVIDENCE',
      intentKey: 'AF447_UNCERTAINTIES',
    },
  ],

  'HIST-1996-CHRK': [
    {
      id: 'Q-CHRK-01',
      question: 'What caused the mid-air collision over Charkhi Dadri?',
      category: 'CAUSE',
      intentKey: 'CHRK_PRIMARY_CAUSE',
    },
    {
      id: 'Q-CHRK-02',
      question: 'Why did the Kazakh Il-76 descend below assigned altitude FL150?',
      category: 'CONTRIBUTING_FACTORS',
      intentKey: 'CHRK_ALTITUDE_DEVIATION',
    },
    {
      id: 'Q-CHRK-03',
      question: 'What role did the absence of Secondary Surveillance Radar (SSR) play?',
      category: 'SYSTEMS',
      intentKey: 'CHRK_RADAR_INFRASTRUCTURE',
    },
    {
      id: 'Q-CHRK-04',
      question: 'What did the Lahoti Commission Court of Inquiry conclude?',
      category: 'EVIDENCE',
      intentKey: 'CHRK_OFFICIAL_FINDINGS',
    },
    {
      id: 'Q-CHRK-05',
      question: 'What changes were mandated in Indian and global airspace following this disaster?',
      category: 'PREVENTION',
      intentKey: 'CHRK_PREVENTION_LESSONS',
    },
  ],

  'DEMO-2017-SFO': [
    {
      id: 'Q-SFO-01',
      question: 'What happened during Air Canada 759 visual approach at SFO?',
      category: 'CAUSE',
      intentKey: 'SFO_WHAT_HAPPENED',
    },
    {
      id: 'Q-SFO-02',
      question: 'Why did the crew line up with Taxiway C instead of Runway 28R?',
      category: 'CONTRIBUTING_FACTORS',
      intentKey: 'SFO_VISUAL_ILLUSION',
    },
    {
      id: 'Q-SFO-03',
      question: 'How close did the aircraft come to the four passenger planes on the taxiway?',
      category: 'EVIDENCE',
      intentKey: 'SFO_SEPARATION_FACTS',
    },
    {
      id: 'Q-SFO-04',
      question: 'What did the NTSB investigation conclude regarding procedural adherence?',
      category: 'EVIDENCE',
      intentKey: 'SFO_OFFICIAL_FINDINGS',
    },
  ],
  // Backward compatibility aliases for previous demo routes
  'DEMO-2002-UBL': [],
  'DEMO-2009-AF447': [],
  'DEMO-1996-CHRK': [],
};

// Wire aliases to share identical question objects
CURATED_SUGGESTED_QUESTIONS['DEMO-2002-UBL'] = CURATED_SUGGESTED_QUESTIONS['HIST-2002-UBL'];
CURATED_SUGGESTED_QUESTIONS['DEMO-2009-AF447'] = CURATED_SUGGESTED_QUESTIONS['HIST-2009-AF447'];
CURATED_SUGGESTED_QUESTIONS['DEMO-1996-CHRK'] = CURATED_SUGGESTED_QUESTIONS['HIST-1996-CHRK'];


export const CURATED_ANSWERS: CuratedAnswer[] = [
  // ==========================================
  // INCIDENT 1: DEMO-2002-UBL (Überlingen)
  // ==========================================
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_PRIMARY_CAUSE',
    keywords: ['cause', 'what caused', 'why did they collide', 'crash cause', 'how did it happen', 'summary'],
    answer:
      'The collision over Überlingen was caused by contradictory avoidance guidance presented simultaneously to the two flight crews [EVD-UBL-01]. While both aircrafts’ onboard TCAS II systems coordinated an automated separation maneuver—ordering DHL 611 to descend and Bashkirian 2937 to climb—the Swiss air traffic controller verbally instructed Bashkirian 2937 to descend immediately [EVD-UBL-01]. The Russian crew obeyed the controller rather than their TCAS Climb alert, placing both jets on a synchronized descent path that intersected at FL348 [EVD-UBL-02].',
    evidenceIds: ['EVD-UBL-01', 'EVD-UBL-02'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'Why did the Russian crew follow the controller instead of TCAS?',
      'What organizational and ground radar failures contributed to the accident?',
      'What safety regulations were amended to prevent recurrence?',
    ],
  },
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_TCAS_VS_ATC',
    keywords: ['tcas', 'atc', 'controller', 'obeyed', 'priority', 'manual', 'rules', 'follow', 'pilot discretion'],
    answer:
      'The Bashkirian flight crew complied with the controller because the Russian Flight Operations Manual (FOM) and Soviet-era aviation culture permitted pilot discretion when resolving conflicts between airborne TCAS advisories and ground ATC clearances [EVD-UBL-03]. Western procedures (including DHL’s operations manual) strictly mandated following TCAS RAs unconditionally over ATC instructions [EVD-UBL-03]. When the Zurich controller repeated the urgent descent instruction, the crew assumed the controller possessed superior radar situational awareness [EVD-UBL-01].',
    evidenceIds: ['EVD-UBL-03', 'EVD-UBL-01'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What did the German BFU investigation officially conclude?',
      'Can you explain the chronological sequence of events before impact?',
      'What safety regulations were amended to prevent recurrence?',
    ],
  },
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_TIMELINE',
    keywords: ['timeline', 'chronology', 'sequence', 'seconds', 'what time', 'minutes', 'events'],
    answer:
      'The fatal sequence developed within 58 seconds:\n• 21:34:34 UTC: Both crews received TCAS Traffic Advisories (TA) with aircraft 40 seconds apart [EVD-UBL-01].\n• 21:34:42 UTC: TCAS commanded DHL to descend and Bashkirian to climb [EVD-UBL-01].\n• 21:34:49 UTC: The controller, unaware of the TCAS climb, ordered Bashkirian to descend to FL350 expedite [EVD-UBL-02].\n• 21:34:56 UTC: Bashkirian’s TCAS escalated to an aural "INCREASE CLIMB", but the crew remained in a steep 1,800 fpm descent.\n• 21:35:32 UTC: The aircraft collided at FL348 (34,890 feet) [EVD-UBL-01].',
    evidenceIds: ['EVD-UBL-01', 'EVD-UBL-02'],
    confidence: 'HIGH',
    provenance: 'REPORTED_FACT',
    suggestedFollowUps: [
      'What organizational and ground radar failures contributed to the accident?',
      'What did the German BFU investigation officially conclude?',
    ],
  },
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_CONTRIBUTING_FACTORS',
    keywords: ['contributing', 'factors', 'skyguide', 'maintenance', 'phone', 'single controller', 'workload', 'stca'],
    answer:
      'The BFU identified multiple critical organizational and technical contributors:\n1. A single air traffic controller was managing two separate workstations simultaneously (Zurich ACC en-route and Friedrichshafen approach) [EVD-UBL-02].\n2. The main ground optical Short-Term Conflict Alert (STCA) was deactivated for planned software maintenance without adequate controller notification [EVD-UBL-04].\n3. The main telephone lines to Karlsruhe ACC were inoperative, preventing adjacent German controllers from telephoning Zurich to alert them of the imminent convergence [EVD-UBL-02].',
    evidenceIds: ['EVD-UBL-02', 'EVD-UBL-04'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What did the German BFU investigation officially conclude?',
      'Which facts or psychological metrics remain uncertain?',
    ],
  },
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_OFFICIAL_FINDINGS',
    keywords: ['conclude', 'bfu', 'findings', 'investigation', 'authority', 'report', 'official'],
    answer:
      'The German Federal Bureau of Aircraft Accident Investigation (BFU) concluded that the imminent separation loss was triggered by late ATC instruction, but the mid-air collision directly resulted from Bashkirian Airlines following the controller’s descent rather than their TCAS Climb resolution [EVD-UBL-01, EVD-UBL-02]. The BFU also cited Skyguide management for tolerating degraded technical safety buffers during routine night operations [EVD-UBL-02, EVD-UBL-04].',
    evidenceIds: ['EVD-UBL-01', 'EVD-UBL-02', 'EVD-UBL-04'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What safety regulations were amended to prevent recurrence?',
      'Which facts or psychological metrics remain uncertain?',
    ],
  },
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_PREVENTION_LESSONS',
    keywords: ['prevent', 'prevented', 'lessons', 'icao', 'changes', 'amendment', 'rules changed', 'annex 2', 'regulation', 'regulations', 'regulatory'],
    answer:
      'The accident prompted an immediate global regulatory overhaul. ICAO amended Annex 2 (Rules of the Air) and PANS-ATM worldwide, establishing absolute legal hierarchy: whenever TCAS issues a Resolution Advisory (RA), pilots must follow TCAS immediately regardless of contrary verbal ATC instructions [EVD-UBL-03]. Additionally, air navigation service providers mandated two-person minimum workstation staffing during system maintenance [EVD-UBL-02].',
    evidenceIds: ['EVD-UBL-03', 'EVD-UBL-02'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What caused the collision between BTC 2937 and DHX 611?',
      'Can you explain the chronological sequence of events before impact?',
    ],
  },
  {
    incidentId: 'HIST-2002-UBL',
    intentKey: 'UBL_UNCERTAINTIES',
    keywords: ['uncertain', 'unresolved', 'unknown', 'assumptions', 'human factors', 'fatigue'],
    answer:
      'While investigators confirmed high physical workload, the exact cognitive fatigue level and mental latency of the lone controller at the instant he switched radio frequencies could not be quantitatively measured [EVD-UBL-05]. The exact degree of acoustic confusion inside the Bashkirian cockpit between the Russian language translator and captain also remains an expert retrospective interpretation rather than a sensor-verified fact [EVD-UBL-05].',
    evidenceIds: ['EVD-UBL-05'],
    confidence: 'MODERATE',
    provenance: 'HUMAN_ASSUMPTION',
    suggestedFollowUps: [
      'What caused the collision between BTC 2937 and DHX 611?',
      'What did the German BFU investigation officially conclude?',
    ],
  },

  // ==========================================
  // INCIDENT 2: DEMO-2009-AF447 (Air France 447)
  // ==========================================
  {
    incidentId: 'HIST-2009-AF447',
    intentKey: 'AF447_PRIMARY_CAUSE',
    keywords: ['cause', 'what caused', 'why did it crash', 'stall', 'ocean', 'summary', 'crash cause'],
    answer:
      'Air France 447 crashed into the Atlantic Ocean following a temporary obstruction of all three Pitot probes by ice crystals at FL350 [EVD-AF447-01]. The airspeed disagreement disconnected the autopilot and degraded flight controls to Alternate Law [EVD-AF447-01]. In response, the pilot flying applied persistent, unprompted nose-up sidestick commands, causing the airliner to climb into a deep aerodynamic stall from which the crew never recovered [EVD-AF447-02, EVD-AF447-03].',
    evidenceIds: ['EVD-AF447-01', 'EVD-AF447-02', 'EVD-AF447-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'How did the Pitot tube icing trigger the loss of flight protections?',
      'Why did the flight crew hold nose-up sidestick during the stall?',
      'Why did the stall warning horn stop sounding when airspeed dropped below 60 knots?',
    ],
  },
  {
    incidentId: 'HIST-2009-AF447',
    intentKey: 'AF447_PITOT_ALTERNATE_LAW',
    keywords: ['pitot', 'icing', 'ice crystals', 'alternate law', 'normal law', 'protections', 'autopilot'],
    answer:
      'When high-altitude ice crystals clogged the Thales Pitot probes, measured airspeed dropped from 274 knots to 52 knots within seconds [EVD-AF447-01]. Because the flight computers could no longer trust airspeed data, the fly-by-wire system automatically transitioned from Normal Law to Alternate 2B Law [EVD-AF447-01]. Under Alternate Law, flight envelope protections—such as automatic stall prevention and high angle-of-attack limits—were completely stripped away [EVD-AF447-01, EVD-AF447-02].',
    evidenceIds: ['EVD-AF447-01', 'EVD-AF447-02'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'Why did the flight crew hold nose-up sidestick during the stall?',
      'What did the French BEA investigation officially conclude?',
    ],
  },
  {
    incidentId: 'HIST-2009-AF447',
    intentKey: 'AF447_CREW_BEHAVIOR',
    keywords: ['sidestick', 'backstick', 'nose up', 'pilot flying', 'crew action', 'pitch', 'bonin', 'stick', 'pull', 'pull up', 'pulled', 'co-pilot'],
    answer:
      'The BEA concluded that the pilot flying experienced spatial disorientation and loss of instrument situational awareness after turbulence and autopilot disconnection [EVD-AF447-03]. Because Airbus passive sidesticks are not mechanically linked and do not provide cross-cockpit tactile motion feedback, the pilot monitoring on the left side was completely unaware that the pilot flying on the right side was pulling back on the stick continuously for over three minutes [EVD-AF447-03].',
    evidenceIds: ['EVD-AF447-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'Why did the stall warning horn stop sounding when airspeed dropped below 60 knots?',
      'What aspects of crew cognitive awareness remain unresolved?',
    ],
  },
  {
    incidentId: 'HIST-2009-AF447',
    intentKey: 'AF447_STALL_WARNING_LOGIC',
    keywords: ['stall warning', 'horn', '60 knots', 'cricket', 'logic', 'silenced', 'perverse'],
    answer:
      'The A330 stall warning logic was programmed to consider angle-of-attack (AOA) measurements invalid when forward airspeed fell below 60 knots [EVD-AF447-02]. Consequently, as the aircraft entered an extreme deep stall with forward speed below 60 knots, the continuous stall warning horn went silent. Perversely, whenever the pilots pushed the nose down and gained speed above 60 knots, the stall warning started blaring again, reinforcing the pilot’s mistaken instinct to pull back up [EVD-AF447-02].',
    evidenceIds: ['EVD-AF447-02'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What did the French BEA investigation officially conclude?',
      'What aspects of crew cognitive awareness remain unresolved?',
    ],
  },
  {
    incidentId: 'HIST-2009-AF447',
    intentKey: 'AF447_OFFICIAL_FINDINGS',
    keywords: ['findings', 'bea', 'conclude', 'report', 'official', 'investigation'],
    answer:
      'The French BEA concluded that the accident resulted from a catastrophic breakdown in crew resource management and lack of high-altitude stall recognition following temporary Pitot obstruction [EVD-AF447-01, EVD-AF447-03]. The BEA recommended mandatory replacement of Thales pitot tubes, global adoption of Upset Prevention and Recovery Training (UPRT), and modifications to stall warning systems to prevent audio cutoffs at high angles of attack [EVD-AF447-02].',
    evidenceIds: ['EVD-AF447-01', 'EVD-AF447-02', 'EVD-AF447-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What aspects of crew cognitive awareness remain unresolved?',
      'What caused Air France 447 to crash in the Atlantic Ocean?',
    ],
  },
  {
    incidentId: 'HIST-2009-AF447',
    intentKey: 'AF447_UNCERTAINTIES',
    keywords: ['uncertain', 'unresolved', 'unknown', 'why never vocalized', 'mental model'],
    answer:
      'Investigators could not definitively determine why neither pilot ever vocalized the word "stall" during the 3.5-minute descent despite dozens of audio alarm warnings [EVD-AF447-04]. Whether the crew believed they were in an overspeed dive, experienced total cognitive saturation, or assumed the computer logic had failed entirely remains an expert analytical hypothesis [EVD-AF447-04].',
    evidenceIds: ['EVD-AF447-04'],
    confidence: 'MODERATE',
    provenance: 'HUMAN_ASSUMPTION',
    suggestedFollowUps: [
      'What did the French BEA investigation officially conclude?',
      'Why did the flight crew hold nose-up sidestick during the stall?',
    ],
  },

  // ==========================================
  // INCIDENT 3: DEMO-1996-CHRK (Charkhi Dadri)
  // ==========================================
  {
    incidentId: 'HIST-1996-CHRK',
    intentKey: 'CHRK_PRIMARY_CAUSE',
    keywords: ['cause', 'what caused', 'why did they collide', 'charkhi dadri', 'fl140', 'summary'],
    answer:
      'The Charkhi Dadri collision was caused by Kazakhstan Airlines Flight 1907 descending without authorization below its assigned flight level of FL150 down into FL140 [EVD-CHRK-01]. This placed the inbound Ilyushin 76 directly in the opposing flight path of Saudi Arabian Flight 763, which had been cleared climbing to FL140 along the same single bidirectional airway corridor G460 [EVD-CHRK-01, EVD-CHRK-03].',
    evidenceIds: ['EVD-CHRK-01', 'EVD-CHRK-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'Why did the Kazakh Il-76 descend below assigned altitude FL150?',
      'What role did the absence of Secondary Surveillance Radar (SSR) play?',
      'What did the Lahoti Commission Court of Inquiry conclude?',
    ],
  },
  {
    incidentId: 'HIST-1996-CHRK',
    intentKey: 'CHRK_ALTITUDE_DEVIATION',
    keywords: ['altitude', 'deviation', 'descend', 'kazakh', 'metric', 'communication', 'language', 'radio operator'],
    answer:
      'The Kazakh flight crew descended past FL150 due to severe cockpit workload and communication friction [EVD-CHRK-02]. Only the radio operator possessed operational English proficiency; the pilots spoke only Russian and flew with metric altimeters (meters rather than feet) [EVD-CHRK-02]. Flight data confirmed the aircraft descended to 13,700 feet before the crew realized their error and initiated a panicked pullup right into the Saudi 747 [EVD-CHRK-01].',
    evidenceIds: ['EVD-CHRK-01', 'EVD-CHRK-02'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What role did the absence of Secondary Surveillance Radar (SSR) play?',
      'What changes were mandated in Indian and global airspace following this disaster?',
    ],
  },
  {
    incidentId: 'HIST-1996-CHRK',
    intentKey: 'CHRK_RADAR_INFRASTRUCTURE',
    keywords: ['radar', 'ssr', 'secondary', 'mode c', 'delhi atc', 'controller blip'],
    answer:
      'At the time of the accident, Delhi ATC operated solely on outdated primary surveillance radar [EVD-CHRK-03]. Primary radar displays only a two-dimensional horizontal blip and cannot display aircraft transponder altitude (Mode C) [EVD-CHRK-03]. Consequently, the air traffic controller could see the blips converging, but had no way of knowing the Kazakh transport had descended into the Saudi jet’s assigned altitude [EVD-CHRK-03].',
    evidenceIds: ['EVD-CHRK-03'],
    confidence: 'HIGH',
    provenance: 'REPORTED_FACT',
    suggestedFollowUps: [
      'What did the Lahoti Commission Court of Inquiry conclude?',
      'What changes were mandated in Indian and global airspace following this disaster?',
    ],
  },
  {
    incidentId: 'HIST-1996-CHRK',
    intentKey: 'CHRK_OFFICIAL_FINDINGS',
    keywords: ['findings', 'lahoti', 'court of inquiry', 'report', 'official'],
    answer:
      'The Court of Inquiry presided by Justice Ramesh Chandra Lahoti determined that the sole direct cause of the disaster was the unauthorized descent of the Kazakh transport from assigned FL150 to FL140 [EVD-CHRK-01]. Major systemic contributing factors included inadequate English language skills among foreign flight crews, the hazardous practice of bidirectional routing in congested airspace, and delays in commissioning modern SSR radar systems [EVD-CHRK-02, EVD-CHRK-03].',
    evidenceIds: ['EVD-CHRK-01', 'EVD-CHRK-02', 'EVD-CHRK-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What changes were mandated in Indian and global airspace following this disaster?',
      'What caused the mid-air collision over Charkhi Dadri?',
    ],
  },
  {
    incidentId: 'HIST-1996-CHRK',
    intentKey: 'CHRK_PREVENTION_LESSONS',
    keywords: ['prevention', 'mandate', 'tcas', 'delhi airspace', 'corridor separation', 'ssr installed'],
    answer:
      'The Charkhi Dadri disaster catalyzed critical aviation safety mandates:\n1. DGCA India made TCAS II collision avoidance avionics compulsory for all commercial aircraft operating in Indian airspace [EVD-CHRK-01].\n2. Monopulse Secondary Surveillance Radar (MSSR) with automated altitude display was accelerated and installed across major Indian terminal control areas [EVD-CHRK-03].\n3. High-density bidirectional airways were bifurcated into separate, unidirectional corridors [EVD-CHRK-03].',
    evidenceIds: ['EVD-CHRK-01', 'EVD-CHRK-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What caused the mid-air collision over Charkhi Dadri?',
      'Why did the Kazakh Il-76 descend below assigned altitude FL150?',
    ],
  },

  // ==========================================
  // INCIDENT 4: DEMO-2017-SFO (San Francisco Taxiway)
  // ==========================================
  {
    incidentId: 'DEMO-2017-SFO',
    intentKey: 'SFO_WHAT_HAPPENED',
    keywords: ['what happened', 'sfo', 'air canada', 'taxiway', 'runway', 'near miss', 'summary'],
    answer:
      'During a nighttime visual approach to Runway 28R at San Francisco, the pilots of Air Canada 759 mistook parallel Taxiway C for the runway and initiated descent directly toward four loaded commercial airliners queued for takeoff [EVD-SFO-01]. The crew initiated a last-second go-around, passing approximately 59 feet above the ground aircraft [EVD-SFO-01].',
    evidenceIds: ['EVD-SFO-01'],
    confidence: 'HIGH',
    provenance: 'REPORTED_FACT',
    suggestedFollowUps: [
      'Why did the crew line up with Taxiway C instead of Runway 28R?',
      'How close did the aircraft come to the four passenger planes on the taxiway?',
      'What did the NTSB investigation conclude regarding procedural adherence?',
    ],
  },
  {
    incidentId: 'DEMO-2017-SFO',
    intentKey: 'SFO_VISUAL_ILLUSION',
    keywords: ['why taxiway', 'illusion', '28l', 'closed', 'lights', 'expectation bias', 'line up', 'align', 'why did', 'mistake', 'why', 'align with taxiway', 'line up with taxiway'],
    answer:
      'Runway 28L was closed for construction with all runway lights extinguished [EVD-SFO-01]. The flight crew expected to see two parallel illuminated runways. Seeing illuminated Runway 28R on the left and illuminated Taxiway C on the right, their expectation bias caused them to misidentify Runway 28R as 28L and Taxiway C as 28R [EVD-SFO-02].',
    evidenceIds: ['EVD-SFO-01', 'EVD-SFO-02'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'How close did the aircraft come to the four passenger planes on the taxiway?',
      'What did the NTSB investigation conclude regarding procedural adherence?',
    ],
  },
  {
    incidentId: 'DEMO-2017-SFO',
    intentKey: 'SFO_SEPARATION_FACTS',
    keywords: ['how close', 'feet', 'altitude', 'separation', '59 feet', 'lowest point'],
    answer:
      'Radar, flight data recorder, and surveillance video analysis confirmed that Air Canada 759 descended to a minimum altitude of 59 feet above ground level, clearing the vertical tail stabilizer of Philippine Airlines Flight 115 by less than 14 feet before climbing away [EVD-SFO-01].',
    evidenceIds: ['EVD-SFO-01'],
    confidence: 'HIGH',
    provenance: 'REPORTED_FACT',
    suggestedFollowUps: [
      'What did the NTSB investigation conclude regarding procedural adherence?',
      'Why did the crew line up with Taxiway C instead of Runway 28R?',
    ],
  },
  {
    incidentId: 'DEMO-2017-SFO',
    intentKey: 'SFO_OFFICIAL_FINDINGS',
    keywords: ['ntsb', 'findings', 'procedural', 'ils', 'conclude', 'controller'],
    answer:
      'The NTSB concluded that the probable cause was the flight crew’s misidentification of Taxiway C as Runway 28R [EVD-SFO-01]. Contributing to the incident was the crew’s failure to manually tune the instrument landing system (ILS) localizer to verify electronic runway alignment during the visual approach [EVD-SFO-02], and the tower controller’s brief distraction with an off-airport vehicle transfer [EVD-SFO-03].',
    evidenceIds: ['EVD-SFO-01', 'EVD-SFO-02', 'EVD-SFO-03'],
    confidence: 'HIGH',
    provenance: 'OFFICIAL_FINDING',
    suggestedFollowUps: [
      'What happened during Air Canada 759 visual approach at SFO?',
      'How close did the aircraft come to the four passenger planes on the taxiway?',
    ],
  },
];
