export interface AppSession {
  isAuthenticated: boolean;
  compoundId: string;
  residentId: string;
  unitId: string;
  complaintId?: string;
}
