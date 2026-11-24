import React, { useState } from 'react';
import {
  Plane,
  Compass,
  Gauge,
  Layers,
  Radio,
  Cpu,
  Users,
  Shield,
  Activity,
} from 'lucide-react';
import { AircraftRecord } from '@/features/incidents/types/incident';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface AircraftInfoPanelProps {
  aircraftList: AircraftRecord[];
}

export const AircraftInfoPanel: React.FC<AircraftInfoPanelProps> = ({ aircraftList }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedAircraft = aircraftList[selectedIndex] || aircraftList[0];

  return (
    <div className="space-y-4">
      {/* Multi-Aircraft Tab Selector */}
      {aircraftList.length > 1 && (
        <div className="flex items-center gap-2 p-1.5 rounded-panel bg-navy-900/90 border border-navy-700/80">
          <span className="text-2xs font-mono uppercase tracking-wider text-slate-400 px-2 shrink-0">
            Aircraft Involved ({aircraftList.length}):
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {aircraftList.map((ac, idx) => (
              <button
                key={ac.flightNumber || ac.type + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 select-none',
                  selectedIndex === idx
                    ? 'bg-navy-800 text-cyan-300 border border-cyan-500/40 font-semibold shadow-glow-cyan-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850 border border-transparent'
                )}
              >
                <Plane className="w-3.5 h-3.5 shrink-0" />
                <span>{ac.flightNumber || ac.operator}</span>
                <span className="text-2xs text-slate-500">({ac.model})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Aircraft Technical Dossier */}
      {selectedAircraft && (
        <div className="p-5 rounded-panel panel-surface border border-navy-700/80 space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-panel bg-navy-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-glow-cyan-sm">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-base text-white">
                    {selectedAircraft.type}
                  </h3>
                  <Badge variant="mono" size="sm">
                    {selectedAircraft.model}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Operator: <strong className="text-slate-200">{selectedAircraft.operator}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-2xs">
              <span className="text-slate-400">Tail Registration:</span>
              <span className="px-2 py-0.5 rounded bg-navy-900 border border-navy-700 text-cyan-300 font-bold">
                {selectedAircraft.registration || 'Not available'}
              </span>
            </div>
          </div>

          {/* Structured Telemetry & Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-mono">
            {/* Flight Phase */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-cyan-400" />
                Flight Phase
              </span>
              <strong className="text-white block font-semibold">
                {selectedAircraft.flightPhase || 'Not available'}
              </strong>
            </div>

            {/* Cruising Altitude */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-emerald-400" />
                Altitude
              </span>
              <strong className="text-white block font-semibold">
                {selectedAircraft.altitude || 'Not available'}
              </strong>
            </div>

            {/* Indicated / True Airspeed */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Gauge className="w-3 h-3 text-amber-400" />
                Airspeed
              </span>
              <strong className="text-white block font-semibold">
                {selectedAircraft.airspeed || 'Not available'}
              </strong>
            </div>

            {/* Heading Vector */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-aviation-400" />
                Heading
              </span>
              <strong className="text-white block font-semibold">
                {selectedAircraft.heading || 'Not available'}
              </strong>
            </div>

            {/* Squawk Code */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-purple-400" />
                Transponder / Squawk
              </span>
              <strong className="text-white block font-semibold">
                {selectedAircraft.squawk || 'Not available'}
              </strong>
            </div>

            {/* TCAS Avionics */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-cyan-400" />
                TCAS Avionics
              </span>
              <strong className="text-white block font-semibold truncate" title={selectedAircraft.tcasEquipment}>
                {selectedAircraft.tcasEquipment || 'Not available'}
              </strong>
            </div>

            {/* FMS / Automation Mode */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1 sm:col-span-2">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-slate-400" />
                Autoflight & FMS Mode
              </span>
              <strong className="text-slate-200 block font-semibold">
                {selectedAircraft.fmsMode || 'Not available'}
              </strong>
            </div>

            {/* Crew Complement */}
            <div className="p-3 rounded bg-navy-900/60 border border-navy-800 space-y-1 sm:col-span-2 lg:col-span-1">
              <span className="text-2xs uppercase text-slate-500 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-slate-400" />
                Flight Crew Complement
              </span>
              <strong className="text-slate-200 block font-semibold truncate" title={selectedAircraft.crewComplement}>
                {selectedAircraft.crewComplement || 'Not available'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
