import { delay } from '../../../lib/utils/delay';

export interface EmergencyReport {
  id: string;
  type: string;
  location: string;
  details: string;
  createdAt: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED';
}

const emergencyReports: EmergencyReport[] = [
  {
    id: 'sos-001',
    type: 'FIRE',
    location: 'فيلا ٢٤ - المطبخ الرئيسي',
    details: 'حريق بسيط بسبب تماس كهربائي في غسالة الأطباق، تم السيطرة الأولية ولكن يرجى معاينة الفني للتأكد من الأسلاك.',
    createdAt: new Date().toISOString(),
    status: 'RESOLVED',
  }
];

export const emergencyService = {
  async getEmergencyReportById(id: string): Promise<EmergencyReport | undefined> {
    await delay(300);
    return emergencyReports.find((r) => r.id === id);
  },

  async createEmergencyReport(type: string, location: string, details: string): Promise<EmergencyReport> {
    await delay(500);
    const newReport: EmergencyReport = {
      id: `sos-${Date.now()}`,
      type,
      location,
      details,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    emergencyReports.unshift(newReport);
    return newReport;
  },
};
