// Temporary integration IDs for the production demo dataset.
// These IDs are temporary until real auth/session context exists.
// Keep demo IDs centralized here so page components do not hardcode backend records.
export const DEMO_IDS = {
  compoundId: 'ca155709-2f8c-47ab-8e91-6fa0504cf435',
  unitId: 'f863d57c-e951-4a4d-bced-ce2bc2647d13',
  residentId: '1b0e1f72-2d0c-4a2d-bd47-1a125bfe5a6c',
  complaintId: '0a070896-d303-422e-9874-c35c8131f9fa',
} as const;

export const { compoundId, unitId, residentId, complaintId } = DEMO_IDS;
