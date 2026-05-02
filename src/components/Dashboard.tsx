/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AlertTriangle, Droplets, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Station } from '../types';

interface DashboardProps {
  stations: Station[];
  stats: {
    totalUsage: number;
    lowStockCount: number;
    nearExpirationCount: number;
    complianceRate: number;
  };
}

export default function Dashboard({ stations, stats }: DashboardProps) {
  // Mock data for the chart
  const chartData = [
    { name: 'Mon', usage: 1200 },
    { name: 'Tue', usage: 1500 },
    { name: 'Wed', usage: 980 },
    { name: 'Thu', usage: 1900 },
    { name: 'Fri', usage: 2100 },
    { name: 'Sat', usage: 800 },
    { name: 'Sun', usage: 600 },
  ];

  const cards = [
    { title: 'Monthly Usage', value: `${(stats.totalUsage / 1000).toFixed(1)} L`, unit: '/ 1k PD', icon: Droplets, color: 'text-blue-600', bg: 'bg-white', progress: 82, footer: 'Target Met', footerColor: 'text-emerald-600' },
    { title: 'Active Stations', value: `${stations.length} / 34`, unit: '', icon: CheckCircle2, color: 'text-slate-600', bg: 'bg-white', footer: '2 Offline for maintenance', footerColor: 'text-slate-500' },
    { title: 'Critical Alerts', value: stats.lowStockCount.toString().padStart(2, '0'), unit: '', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', footer: 'Requires Action Now', footerColor: 'text-red-600' },
    { title: 'Near Expiry', value: stats.nearExpirationCount.toString().padStart(2, '0'), unit: '', icon: Calendar, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', footer: 'Within 30 Days', footerColor: 'text-amber-700' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={cn(
            "p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md",
            card.bg,
            card.border || "border-slate-200"
          )}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <card.icon size={16} className={card.color} />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{card.value}</span>
              {card.unit && <span className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">{card.unit}</span>}
            </div>
            
            {card.progress !== undefined && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${card.progress}%` }}></div>
              </div>
            )}
            
            <p className={cn("text-[10px] mt-3 font-bold uppercase tracking-tight", card.footerColor)}>
              {card.footer}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest mb-1">Usage Trend (7 Days)</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Clinical consumption volume</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600">+4.2% Optimal</span>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false}
                   tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px',
                    border: 'none', 
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="usage" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.usage > 1800 ? '#f87171' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Normal Consumption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hyper-Usage Alert</span>
            </div>
          </div>
        </div>

        {/* Priority Warnings */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest mb-8">Priority Monitoring</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
            {stations.filter(s => s.currentVolume < 100).map(s => (
              <div key={s.id} className="flex gap-4 items-start p-4 bg-red-50 rounded-2xl border border-red-100 group transition-all hover:scale-[1.02]">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <AlertTriangle size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase text-red-600 tracking-widest mb-1">Critical Low</div>
                  <div className="font-bold text-slate-800 truncate text-sm">{s.name}</div>
                  <div className="text-[10px] font-bold text-red-700/60 mt-1 uppercase tracking-tighter">Remaining: {s.currentVolume}ml</div>
                </div>
              </div>
            ))}
            
            {stations.filter(s => {
               const exp = new Date(s.expirationDate);
               const now = new Date();
               const diff = exp.getTime() - now.getTime();
               return diff < 30 * 24 * 60 * 60 * 1000;
            }).map(s => (
              <div key={s.id} className="flex gap-4 items-start p-4 bg-amber-50 rounded-2xl border border-amber-100 group transition-all hover:scale-[1.02]">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <Calendar size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase text-amber-700 tracking-widest mb-1">Near Expiry</div>
                  <div className="font-bold text-slate-800 truncate text-sm">{s.name}</div>
                  <div className="text-[10px] font-bold text-amber-800/60 mt-1 uppercase tracking-tighter">Date: {s.expirationDate}</div>
                </div>
              </div>
            ))}

            {stations.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
                <CheckCircle2 size={40} className="mb-4 text-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center">No Priority Warnings Detected</p>
              </div>
            )}
          </div>
          <div className="mt-8">
            <button className="w-full py-4 text-[10px] font-bold uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500">
              Clear All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
