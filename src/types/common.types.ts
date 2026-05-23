export interface Resident {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  unitId?: string;
  compoundId: string;
  role: string;
  status: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  unitType: string;
  floor?: number;
  areaSqm?: number;
  status: string;
  compoundId: string;
  compoundName: string;
}

export interface Payment {
  id: string;
  amount: number;
  title: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
  billingPeriod: string;
  paymentMethod?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
  createdAt: string;
  updatedAt: string;
  residentId: string;
  category: string;
  timeline: {
    status: string;
    note: string;
    date: string;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isImportant: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: 'PAYMENT' | 'COMPLAINT' | 'ANNOUNCEMENT' | 'SYSTEM' | 'VISITOR';
  referenceId?: string;
}
