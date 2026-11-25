import React, { useState } from 'react';
import { Plane, Compass, Gauge, Layers, Radio, Cpu, Users, Shield, Activity } from 'lucide-react';
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
      {aircraftList.length > 1 && (
        <div className="flex items-center gap-2 p-2 rounded-panel bg-sand-100 border border-obsidian-950/12">
          <span className="text-2xs font-mono uppercase tracking-wider text-stone-500 px-2 shrink-0">
            Aircraft ({aircraftList.length}):
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {aircraftList.map((ac, idx) => (
              <button
                key={ac.flightNumber || ac.type + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  'px-3 py-1.5 rounded-subtle text-xs font-mono transition-all flex items-center gap-1.5 select-none border',
                  selectedIndex === idx
                    ? 'bg-obsidian-950 text-lime-400 border-obsidian-950 font-semibold'
                    : 'bg-sand-25 text-stone-600 border-obsidian-950/10 hover:text-obsidian-950'
                )}
              >
                <Plane className="w-3.5 h-3.5 shrink-0" />
                <span>{ac.flightNumber || ac.operator}</span>
                <span className="opacity-70 text-2xs">({ac.model})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedAircraft && (
        <div className="p-5 rounded-card panel-surface space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-obsidian-950/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-panel bg-obsidian-950 text-lime-400 flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-semibold text-base text-obsidian-950">
                    {selectedAircraft.type}
                  </h3>
                  <Badge variant="mono" size="sm">
                    {selectedAircraft.model}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-stone-500">
                  Operator: <strong className="text-obsidian-950">{selectedAircraft.operator}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-2xs">
              <span className="text-stone-500">Registration:</span>
              <span className="px-2 py-0.5 rounded-subtle bg-sand-100 border border-obsidian-950/15 text-obsidian-950 font-bold">
                {selectedAircraft.registration || 'Not available'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-mono">
            {[
              { icon: Activity, label: 'Flight Phase', val: selectedAircraft.flightPhase },
              { icon: Layers, label: 'Altitude', val: selectedAircraft.altitude },
              { icon: Gauge, label: 'Airspeed', val: selectedAircraft.airspeed },
              { icon: Compass, label: 'Heading', val: selectedAircraft.heading },
              { icon: Radio, label: 'Transponder / Squawk', val: selectedAircraft.squawk },
              { icon: Shield, label: 'TCAS Avionics', val: selectedAircraft.tcasEquipment },
              { icon: Cpu, label: 'Autoflight & FMS Mode', val: selectedAircraft.fmsMode },
              { icon: Users, label: 'Flight Crew Complement', val: selectedAircraft.crewComplement },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-subtle bg-sand-100/70 border border-obsidian-950/10 space-y-1"
              >
                <span className="text-2xs uppercase text-stone-500 flex items-center gap-1.5">
                  <item.icon className="w-3 h-3 text-obsidian-950" />
                  {item.label}
                </span>
                <strong className="text-obsidian-950 block font-semibold truncate" title={item.val}>
                  {item.val || 'Not available'}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
