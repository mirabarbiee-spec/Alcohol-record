/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  doc, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Station, UsageLog, OperationType } from '../types';
import { handleFirestoreError } from '../lib/error-handler';

export function useFirestore() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'stations'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Station[];
      setStations(stationsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'stations');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addStation = async (data: Partial<Station>) => {
    try {
      const payload = {
        ...data,
        currentVolume: data.initialVolume || 500,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'stations'), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'stations');
    }
  };

  const updateStation = async (id: string, data: Partial<Station>) => {
    try {
      const ref = doc(db, 'stations', id);
      await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stations/${id}`);
    }
  };

  const deleteStation = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this station? All logs will be lost.")) return;
    try {
      await deleteDoc(doc(db, 'stations', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `stations/${id}`);
    }
  };

  const recordUsage = async (stationId: string, currentVolume: number) => {
    try {
      const station = stations.find(s => s.id === stationId);
      if (!station) return;

      const previousVolume = station.currentVolume;
      const usageAmount = previousVolume - currentVolume;

      // Add log
      await addDoc(collection(db, 'stations', stationId, 'logs'), {
        stationId,
        previousVolume,
        currentVolume,
        usageAmount,
        type: 'usage',
        recordedAt: serverTimestamp(),
      });

      // Update station
      await updateDoc(doc(db, 'stations', stationId), {
        currentVolume,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `stations/${stationId}/logs`);
    }
  };

  const refillStation = async (stationId: string, newExpirationDate: string) => {
    try {
      const station = stations.find(s => s.id === stationId);
      if (!station) return;

      const previousVolume = station.currentVolume;
      const refillVolume = station.initialVolume;

      // Add refill log
      await addDoc(collection(db, 'stations', stationId, 'logs'), {
        stationId,
        previousVolume,
        currentVolume: refillVolume,
        usageAmount: 0,
        type: 'refill',
        recordedAt: serverTimestamp(),
      });

      // Update station
      await updateDoc(doc(db, 'stations', stationId), {
        currentVolume: refillVolume,
        expirationDate: newExpirationDate,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `stations/${stationId}/refill`);
    }
  };

  const fetchLogs = async (stationIds?: string[], startDate?: Date, endDate?: Date) => {
    try {
      const allLogs: UsageLog[] = [];
      const targetStationIds = stationIds && stationIds.length > 0 
        ? stationIds 
        : stations.map(s => s.id);

      for (const sId of targetStationIds) {
        const logsRef = collection(db, 'stations', sId, 'logs');
        const q = query(logsRef, orderBy('recordedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const recordedAt = data.recordedAt?.toDate() || new Date();
          
          if (startDate && recordedAt < startDate) return;
          if (endDate && recordedAt > endDate) return;

          allLogs.push({
            id: doc.id,
            stationId: sId,
            ...data,
            recordedAt: recordedAt.toISOString()
          } as UsageLog);
        });
      }

      return allLogs.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'stations/logs');
      return [];
    }
  };

  const stats = {
    totalUsage: stations.reduce((sum, s) => sum + (s.initialVolume - s.currentVolume), 0),
    lowStockCount: stations.filter(s => s.currentVolume < 100).length,
    nearExpirationCount: stations.filter(s => {
      const exp = new Date(s.expirationDate);
      const now = new Date();
      const diff = exp.getTime() - now.getTime();
      return diff < 30 * 24 * 60 * 60 * 1000; // < 1 month
    }).length,
    complianceRate: 0, // Placeholder
  };

  return {
    stations,
    stats,
    loading,
    addStation,
    updateStation,
    deleteStation,
    recordUsage,
    refillStation,
    fetchLogs
  };
}
