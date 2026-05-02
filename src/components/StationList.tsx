/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Edit2, Trash2, PenLine, Beaker, MapPin, AlertCircle, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Station, AreaType } from '../types';
import LoggingModal from './LoggingModal';
import RefillModal from './RefillModal';

interface StationListProps {
  stations: Station[];
  onEdit: (station: Station) => void;
  onDelete: (id: string) => void;
  onRecord: (id: string, volume: number) => void;
  onRefill: (id: string, expirationDate: string) => void;
}

export default function StationList({ stations, onEdit, onDelete, onRecord, onRefill }: StationListProps) {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [refillStationId, setRefillStationId] = useState<string | null>(null);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest mb-1">Priority Monitoring List</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Global ward distribution state</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Filter by: Area Type</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Location Identity</th>
              <th className="px-8 py-5">Classification</th>
              <th className="px-8 py-5">Volume Status</th>
              <th className="px-8 py-5">Expiration Vector</th>
              <th className="px-8 py-5 text-right">System Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {stations.map((station) => {
              const isLow = station.currentVolume < 100;
              const expDate = new Date(station.expirationDate);
              const isNearExp = expDate.getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

              return (
                <tr key={station.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2.5 rounded-lg shadow-sm border",
                        isLow ? "bg-red-500 border-red-400 text-white" : "bg-slate-100 border-slate-200 text-slate-400"
                      )}>
                        <Beaker size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{station.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">UID: {station.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {station.areaType}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                        <span className={isLow ? "text-red-500" : "text-slate-500"}>{station.currentVolume}ml</span>
                        <span className="text-slate-300">/ 500ml</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            isLow ? "bg-red-500" : "bg-blue-500"
                          )}
                          style={{ width: `${(station.currentVolume / station.initialVolume) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-xs font-bold",
                        isNearExp ? "text-amber-600" : "text-slate-600"
                      )}>
                        {station.expirationDate}
                      </span>
                      {isNearExp && <span className="text-[9px] font-bold uppercase text-amber-500 tracking-tighter">Replace Required</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedStationId(station.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Record Usage"
                      >
                        <PenLine size={16} />
                      </button>
                      <button 
                        onClick={() => setRefillStationId(station.id)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Replace Bottle"
                      >
                        <RefreshCcw size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit(station)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        title="Edit Station"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(station.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {stations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 text-slate-900 text-center">
            <Beaker size={64} strokeWidth={1} className="mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No Active Stations Configured</p>
          </div>
        )}
      </div>

      {selectedStationId && (
        <LoggingModal 
          station={stations.find(s => s.id === selectedStationId)!}
          onClose={() => setSelectedStationId(null)}
          onRecord={(volume) => onRecord(selectedStationId, volume)}
        />
      )}

      {refillStationId && (
        <RefillModal 
          isOpen={!!refillStationId}
          onClose={() => setRefillStationId(null)}
          onSubmit={(date) => onRefill(refillStationId, date)}
          station={stations.find(s => s.id === refillStationId)!}
        />
      )}
    </div>
  );
}
