/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, RefreshCcw, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { Station } from '../types';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expirationDate: string) => void;
  station: Station;
}

export default function RefillModal({ isOpen, onClose, onSubmit, station }: RefillModalProps) {
  const [expirationDate, setExpirationDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(expirationDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-8 py-5 bg-slate-50 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-800 tracking-tight text-sm">Replace Bottle</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{station.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 focus:outline-none">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col items-center justify-center mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="p-4 bg-white rounded-full shadow-sm text-blue-600 mb-4 animate-pulse">
              <RefreshCcw size={32} />
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase text-blue-400 tracking-widest mb-1">Target Volume</div>
              <div className="text-3xl font-extrabold text-blue-800">{station.initialVolume} ml</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Set New Expiration Date</label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-center font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tight mt-2 italic">
                * clinical safety protocol: verify date on bottle label
              </p>
            </div>
          </div>

          <div className="mt-10">
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <RefreshCcw size={18} />
              Confirm Replacement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
