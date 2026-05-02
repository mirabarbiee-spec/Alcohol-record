/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Station } from '../types';

interface LoggingModalProps {
  station: Station;
  onClose: () => void;
  onRecord: (volume: number) => void;
}

export default function LoggingModal({ station, onClose, onRecord }: LoggingModalProps) {
  const [volume, setVolume] = useState(station.currentVolume);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecord(volume);
    onClose();
  };

  const usagePreview = station.currentVolume - volume;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-8 py-5 bg-slate-50 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-800 tracking-tight text-sm">Usage Sync</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{station.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="text-center mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Previous Volume</div>
            <div className="text-3xl font-extrabold text-slate-800">{station.currentVolume} ml</div>
          </div>

          <div className="space-y-6">
            <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-blue-600">Enter Remaining Volume (ml)</label>
            <div className="flex justify-center">
               <input 
                 type="number"
                 autoFocus
                 className="bg-white border text-blue-600 border-slate-200 rounded-2xl px-6 py-4 text-4xl font-extrabold w-48 text-center focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                 value={volume}
                 onChange={(e) => setVolume(parseInt(e.target.value) || 0)}
               />
            </div>
            <input 
              type="range"
              min="0"
              max={station.initialVolume}
              step="1"
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
            />
          </div>

          <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100 border-dashed text-center">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Consumption Delta</div>
            <div className={cn(
              "text-xl font-extrabold",
              usagePreview < 0 ? 'text-red-500' : 'text-emerald-600'
            )}>
               {usagePreview > 0 ? `-${usagePreview}` : usagePreview < 0 ? `+${Math.abs(usagePreview)}` : '0'} ml
            </div>
          </div>

          <div className="mt-8">
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Check size={18} />
              Validate & Sync
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
