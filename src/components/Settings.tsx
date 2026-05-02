/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Database, Users, Info } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-8">System Configuration</h2>
            
            <div className="space-y-10">
              <section className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <Shield size={14} className="text-blue-600" /> Administrative Access
                </h3>
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 font-bold">Status: Clinical Protocol Restricted</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">System write permissions require institutional authentication. Public access is currently limited to monitoring and auditing.</p>
                </div>
                <button className="text-xs font-bold uppercase tracking-widest px-6 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200">
                  Modify Permission Matrix
                </button>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <Database size={14} className="text-blue-600" /> Ward Metadata
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Target Patient Days</label>
                    <input 
                      type="number" 
                      placeholder="1000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Reporting Interval</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-600">
                      <option>Monthly Analytics</option>
                      <option>Weekly Digest</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 text-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-800">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
              <Info size={14} /> System Info
            </h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Kernel Build</p>
                <p className="text-sm font-bold">1.0.4-LTS-STABLE</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Architecture</p>
                <p className="text-sm font-bold">Cloud_Firestore_Dist</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Security</p>
                <p className="text-sm font-bold">AES-256-ENCRYPT</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-100 border border-blue-500">
            <div className="flex gap-4 items-center mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Users size={24} />
              </div>
              <div className="font-extrabold text-lg tracking-tight leading-none">Collaborator Interface</div>
            </div>
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-4 opacity-80 leading-relaxed">Share secure hospital protocol via persistent surgical link:</p>
            <div className="p-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-bold break-all backdrop-blur-sm">
              {window.location.href}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
