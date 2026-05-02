/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LayoutDashboard, Beaker, History, Settings, User, LogOut, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';

interface SidebarProps {
  activeTab: 'dashboard' | 'stations' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'stations' | 'history' | 'settings') => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => signOut(auth);

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stations', label: 'Stations', icon: Beaker },
    { id: 'history', label: 'Usage Reports', icon: History },
    { id: 'settings', label: 'Threshold Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 text-blue-400 font-bold text-xl uppercase tracking-wider">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Beaker size={24} />
          </div>
          <span className="tracking-tight">SaniTrack</span>
        </div>
        <p className="text-slate-400 text-[10px] uppercase font-bold mt-2 tracking-widest opacity-60">Clinical Hygiene Monitor</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group text-left text-sm font-medium",
              activeTab === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <item.icon 
              size={18} 
              className={cn(
                "transition-transform",
                activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              )} 
            />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 flex flex-col gap-4">
        {user ? (
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-700">
              {(user.displayName?.[0] || user.email?.[0] || 'A').toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-300 truncate leading-none mb-1">{user.email}</div>
              <button onClick={handleLogout} className="text-[9px] uppercase font-bold text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1">
                <LogOut size={10} /> Logout
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase border border-slate-700 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400"
          >
            <LogIn size={14} /> Admin Access
          </button>
        )}
        
        <div className="bg-slate-800 p-4 rounded-xl shadow-inner">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-tight">Current Ward</p>
          <p className="text-sm font-semibold text-slate-200">St. Jude - Wing 4B</p>
        </div>
      </div>
    </aside>
  );
}
