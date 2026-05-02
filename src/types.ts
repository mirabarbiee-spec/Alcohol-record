/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AreaType {
  PatientRoom = "Patient Room",
  NurseStation = "Nurse Station",
  Corridor = "Corridor",
  ICU = "ICU",
  Emergency = "Emergency",
  Other = "Other"
}

export interface Station {
  id: string;
  name: string;
  areaType: AreaType;
  expirationDate: string;
  currentVolume: number;
  initialVolume: number;
  updatedAt: string;
  createdAt: string;
}

export interface UsageLog {
  id: string;
  stationId: string;
  previousVolume: number;
  currentVolume: number;
  usageAmount: number;
  recordedAt: string;
  recordedBy?: string;
}

export interface WardDashboardStats {
  totalUsage: number;
  lowStockCount: number;
  nearExpirationCount: number;
  complianceRate: number; // liters / 1,000 patient-days
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}
