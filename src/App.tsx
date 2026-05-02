/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Clock, AlertTriangle, Droplets, CheckCircle2, History, Settings as SettingsIcon, LayoutDashboard, FileBarChart, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StationList from './components/StationList';
import StationModal from './components/StationModal';
import Settings from './components/Settings';
import UsageReports from './components/UsageReports';
import { useFirestore } from './hooks/useFirestore';
import { Station } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stations' | 'history' | 'settings'>('dashboard');
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  const { stations, stats, loading, addStation, updateStation, deleteStation, recordUsage, refillStation, fetchLogs } = useFirestore();

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setIsStationModalOpen(true);
  };

  const handleAddStation = () => {
    setEditingStation(null);
    setIsStationModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-slate-400">Loading Clinical Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-white border-b border-slate-200 shadow-sm z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              {activeTab === 'dashboard' && "Ward Usage Overview"}
              {activeTab === 'stations' && "Station Management"}
              {activeTab === 'history' && "Usage Reports"}
              {activeTab === 'settings' && "System Configuration"}
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-3">AHR-Monitor_v1</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Real-time Alcohol Hand Rub distribution analytics</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'stations' && (
              <button 
                onClick={handleAddStation}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-bold text-sm shadow-md shadow-blue-200"
              >
                <Plus size={18} />
                Add Station
              </button>
            )}
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
               <FileBarChart size={18} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full max-w-7xl mx-auto w-full"
            >
              {activeTab === 'dashboard' && <Dashboard stations={stations} stats={stats} />}
              {activeTab === 'stations' && (
                <StationList 
                  stations={stations} 
                  onEdit={handleEditStation} 
                  onDelete={deleteStation}
                  onRecord={recordUsage}
                  onRefill={refillStation}
                />
              )}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'history' && (
                <UsageReports stations={stations} fetchLogs={fetchLogs} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="px-10 py-3 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex gap-6">
            <span>Latency: 14ms</span>
            <span>Uptime: 99.98%</span>
            <span>Secure_Protocol: Enabled</span>
          </div>
          <div className="italic opacity-60">
            Internal Use Only // Hospital Property
          </div>
        </footer>
      </main>

      {/* Modals */}
      {isStationModalOpen && (
        <StationModal 
          isOpen={isStationModalOpen}
          onClose={() => setIsStationModalOpen(false)}
          onSubmit={editingStation ? (data) => updateStation(editingStation.id, data) : addStation}
          initialData={editingStation}
        />
      )}
    </div>
  );
}
