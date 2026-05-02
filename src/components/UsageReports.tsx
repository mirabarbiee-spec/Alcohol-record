/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  Filter, 
  ArrowDownToLine, 
  Search,
  Beaker,
  History,
  TrendingDown
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '../lib/utils';
import { Station, UsageLog } from '../types';

interface UsageReportsProps {
  stations: Station[];
  fetchLogs: (stationIds?: string[], startDate?: Date, endDate?: Date) => Promise<UsageLog[]>;
}

export default function UsageReports({ stations, fetchLogs }: UsageReportsProps) {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStationId, setSelectedStationId] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      const end = new Date(endDate);
      end.setHours(23,59,59,999);

      const fetchedLogs = await fetchLogs(
        selectedStationId === 'all' ? undefined : [selectedStationId],
        start,
        end
      );
      setLogs(fetchedLogs);
      setLoading(false);
    };

    loadData();
  }, [selectedStationId, startDate, endDate, fetchLogs]);

  const stats = useMemo(() => {
    const totalUsage = logs.reduce((sum, log) => sum + (log.usageAmount > 0 ? log.usageAmount : 0), 0);
    const refillCount = logs.filter(log => (log as any).type === 'refill').length;
    const averageUsage = logs.length > 0 ? totalUsage / (logs.length || 1) : 0;
    
    return {
      totalVolume: (totalUsage / 1000).toFixed(2),
      refills: refillCount,
      avgPerCheck: Math.round(averageUsage)
    };
  }, [logs]);

  return (
    <div className="space-y-8 pb-20">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[200px] flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-transparent border-none focus:outline-none text-sm font-bold uppercase tracking-tight text-slate-700 w-full"
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
          >
            <option value="all">All Active Stations</option>
            {stations.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <CalendarIcon size={16} className="text-slate-400" />
            <input 
              type="date"
              className="bg-transparent border-none focus:outline-none text-xs font-bold text-slate-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-slate-300 font-bold">→</span>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <CalendarIcon size={16} className="text-slate-400" />
            <input 
              type="date"
              className="bg-transparent border-none focus:outline-none text-xs font-bold text-slate-600"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
          <ArrowDownToLine size={18} />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-100 border border-blue-500">
            <p className="text-[10px] font-bold uppercase text-blue-100 tracking-widest mb-1">Period Consumption</p>
            <div className="text-4xl font-extrabold tracking-tight mb-2">{stats.totalVolume} L</div>
            <p className="text-[10px] font-bold text-blue-200 uppercase opacity-60">Calculated from {logs.length} logs</p>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <TrendingDown size={16} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Avg Usage</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{stats.avgPerCheck} ml</span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <History size={16} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Bottle Refills</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{stats.refills} units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50">
             <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Hygiene Compliance Audit Log</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Station Location</th>
                  <th className="px-8 py-5 text-center">Event Type</th>
                  <th className="px-8 py-5 text-right">Consumption Delta</th>
                  <th className="px-8 py-5 text-right">Final Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-4"><div className="h-4 bg-slate-100 rounded"></div></td>
                    </tr>
                  ))
                ) : logs.map((log) => {
                  const station = stations.find(s => s.id === log.stationId);
                  const isRefill = (log as any).type === 'refill';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800">{format(parseISO(log.recordedAt), 'MMM dd, HH:mm')}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified_Sync</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-100 rounded text-slate-400">
                             <Beaker size={12} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{station?.name || 'Local Station'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md",
                          isRefill ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {isRefill ? 'Refill' : 'Monitoring'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={cn(
                          "text-sm font-extrabold",
                          isRefill ? "text-slate-400" : log.usageAmount > 100 ? "text-red-500" : "text-slate-800"
                        )}>
                          {isRefill ? '--' : `-${log.usageAmount}ml`}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-xs font-bold text-slate-500">
                        {log.currentVolume}ml
                      </td>
                    </tr>
                  );
                })}

                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                       <History size={48} className="mx-auto mb-4" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No historical logs matched filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
