# PANKH — Research Sources, Provenance & Limitations

## 1. Historical Data Sources

The three canonical historical incidents in PANKH are derived from official accident investigation reports:

1. **Überlingen Mid-Air Collision (1 July 2002 — `HIST-2002-UBL`)**
   - **Authority**: German Federal Bureau of Aircraft Accident Investigation (BFU), Report `AX001-1-2/02`.
   - **Reference**: [ICAO Safety Archive PDF](https://www.icao.int/safety/fsix/Documents/sr/reports/02001351_final_report_01.pdf)
2. **Air France Flight 447 (1 June 2009 — `HIST-2009-AF447`)**
   - **Authority**: Bureau d’Enquêtes et d’Analyses (BEA, France), Report `f-cp090601`.
   - **Reference**: [BEA Official Report](https://bea.aero/en/investigation-reports/notified-events/detail/accident-to-the-airbus-a330-203-registered-f-gzcp-and-operated-by-air-france-occured-on-06-01-2009-in-the-atlantic-ocean/)
3. **Charkhi Dadri Mid-Air Collision (12 November 1996 — `HIST-1996-CHRK`)**
   - **Authority**: Government of India Court of Inquiry (Justice Lahoti Commission), Report `No. 1/96`.
   - **Reference**: [Skybrary Archived Copy](https://skybrary.aero/sites/default/files/bookshelf/32383.pdf)

A fourth record, **`DEMO-2017-SFO`**, is retained as a clearly labeled `DEMO_BENCHMARK`.

## 2. Provenance Model

Every incident, timeline event, and evidence finding carries an explicit provenance classification:
- **`REPORTED_FACT`**: Directly documented factual observation from official investigation chapters.
- **`OFFICIAL_FINDING`**: Formal conclusion determined by the state investigation board.
- **`CONTRIBUTING_FACTOR`**: Systemic, organizational, or human-factor contributor identified in the report.
- **`UNKNOWN_OR_UNRESOLVED`**: Explicitly disclosed data gaps or unrecoverable telemetry.
- **`DEMO_DATA` / `DEMO_BENCHMARK`**: Illustrative demonstration records.

## 3. Simulation Fidelity

Simulation scenarios are deterministic, predefined playback sequences—not physical flight simulators. Each scenario and event is tagged with its fidelity level:
- **`RECORDED_DATA`**: Timing and parameters supported by FDR/CVR records.
- **`REPORT_SUPPORTED`**: Sequences derived from official investigation text.
- **`ILLUSTRATIVE`**: Simplified 2D airspace coordinates for visualization.
- **`HYPOTHETICAL`**: Predefined alternative decision branches.

## 4. Current AI & Operational Limitations

- **Deterministic Assistant**: The AI Investigation Assistant does not use a generative LLM. It matches user queries against curated intents and returns honest fallback messages when asked out-of-scope questions.
- **No Operational Use**: PANKH is an academic and portfolio research prototype. It must never be used for air traffic control, flight dispatch, or operational decision-making.
