/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Station, AreaType } from '../types';

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Station>) => void;
  initialData?: Station | null;
}

export default function StationModal({ isOpen, onClose, onSubmit, initialData }: StationModalProps) {
  const [formData, setFormData] = useState<Partial<Station>>({
    name: '',
    areaType: AreaType.PatientRoom,
    expirationDate: '',
    initialVolume: 500,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        areaType: initialData.areaType,
        expirationDate: initialData.expirationDate,
        initialVolume: initialData.initialVolume,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-800 tracking-tight">{initialData ? 'Update Station' : 'Deploy New Station'}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Clinical Infrastructure Component</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location Identity</label>
            <input 
              required
              type="text"
              placeholder="e.g., Room 402 Bed A"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Classification</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-tight text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.areaType}
                onChange={(e) => setFormData({ ...formData, areaType: e.target.value as AreaType })}
              >
                {Object.values(AreaType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expiry Vector</label>
              <input 
                required
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-slate-600 focus:outline-none"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Allocation Volume (ml)</label>
            <div className="relative">
              <input 
                required
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-600 focus:outline-none"
                value={formData.initialVolume}
                onChange={(e) => setFormData({ ...formData, initialVolume: parseInt(e.target.value) })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Milliliters</span>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              Abort
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Commit Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
