import { create } from 'zustand';
import type { Resident, Unit, Payment, Complaint, Announcement, AppNotification } from '../types/common.types';
import { mockResident } from '../mocks/resident.mock';
import { mockUnit } from '../mocks/unit.mock';
import { mockPayments } from '../mocks/payments.mock';
import { mockComplaints } from '../mocks/complaints.mock';
import { mockAnnouncements } from '../mocks/announcements.mock';
import { mockNotifications } from '../mocks/notifications.mock';
import {
  mockVisitorPasses, 
  mockFacilityBookings, 
  mockMaintenanceRequests, 
  mockSupportTickets,
  mockChatRooms
} from '../mocks/services.mock';
import type {
  ChatRoom,
  FacilityBooking,
  MaintenanceRequest,
  SupportTicket,
  VisitorPass,
} from '../mocks/services.mock';

interface AppState {
  resident: Resident;
  unit: Unit;
  payments: Payment[];
  complaints: Complaint[];
  announcements: Announcement[];
  notifications: AppNotification[];
  visitors: VisitorPass[];
  bookings: FacilityBooking[];
  maintenance: MaintenanceRequest[];
  tickets: SupportTicket[];
  chatRooms: ChatRoom[];
  
  // Actions
  payInvoice: (id: string, method: string) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'residentId' | 'timeline'>) => Complaint;
  addVisitor: (visitor: Omit<VisitorPass, 'id' | 'qrCode' | 'status'>) => VisitorPass;
  addBooking: (booking: Omit<FacilityBooking, 'id' | 'totalPrice' | 'status' | 'qrCode'>) => FacilityBooking;
  addMaintenance: (request: Omit<MaintenanceRequest, 'id' | 'status'>) => MaintenanceRequest;
  addSupportTicket: (title: string, category: string, description: string) => SupportTicket;
  addChatMessage: (roomId: string, text: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  resident: mockResident,
  unit: mockUnit,
  payments: mockPayments,
  complaints: mockComplaints,
  announcements: mockAnnouncements,
  notifications: mockNotifications,
  visitors: mockVisitorPasses,
  bookings: mockFacilityBookings,
  maintenance: mockMaintenanceRequests,
  tickets: mockSupportTickets,
  chatRooms: mockChatRooms,

  payInvoice: (id, method) => set((state) => ({
    payments: state.payments.map((p) => 
      p.id === id 
        ? { ...p, status: 'PAID', paidDate: new Date().toISOString().split('T')[0], paymentMethod: method } 
        : p
    ),
    notifications: [
      {
        id: `notif-pay-${Date.now()}`,
        title: 'تم السداد بنجاح',
        content: `تم استلام دفعة بقيمة ${state.payments.find(p => p.id === id)?.amount} ج.م بنجاح عبر ${method}.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'PAYMENT',
        referenceId: id
      },
      ...state.notifications
    ]
  })),

  addComplaint: (data) => {
    const newComplaint: Complaint = {
      ...data,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      residentId: mockResident.id,
      timeline: [
        {
          status: 'OPEN',
          note: 'تم تسجيل الشكوى وإحالتها للمتابعة المختصة.',
          date: new Date().toISOString(),
        }
      ]
    };
    
    set((state) => ({
      complaints: [newComplaint, ...state.complaints],
      notifications: [
        {
          id: `notif-comp-${Date.now()}`,
          title: 'شكوى جديدة مسجلة',
          content: `تم تسجيل شكواك بخصوص "${data.title}" تحت الرقم ${newComplaint.id}.`,
          isRead: false,
          createdAt: new Date().toISOString(),
          type: 'COMPLAINT',
          referenceId: newComplaint.id
        },
        ...state.notifications
      ]
    }));

    return newComplaint;
  },

  addVisitor: (data) => {
    const newVisitor: VisitorPass = {
      ...data,
      id: `vis-${Date.now()}`,
      qrCode: `COMP_OS_QR_${Date.now()}`,
      status: 'ACTIVE'
    };

    set((state) => ({
      visitors: [newVisitor, ...state.visitors]
    }));

    return newVisitor;
  },

  addBooking: (data) => {
    // Standard static pricing lookup
    let pricePerHour = 100;
    if (data.facilityId === 'fac-602') pricePerHour = 150;
    if (data.facilityId === 'fac-603') pricePerHour = 1000;

    const newBooking: FacilityBooking = {
      ...data,
      id: `bk-${Date.now()}`,
      totalPrice: pricePerHour * data.durationHours,
      status: 'CONFIRMED',
      qrCode: `COMP_OS_BOOK_${Date.now()}`
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings]
    }));

    return newBooking;
  },

  addMaintenance: (data) => {
    const newRequest: MaintenanceRequest = {
      ...data,
      id: `maint-${Date.now()}`,
      status: 'PENDING'
    };

    set((state) => ({
      maintenance: [newRequest, ...state.maintenance]
    }));

    return newRequest;
  },

  addSupportTicket: (title, category, description) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      title,
      category,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [
        {
          sender: 'RESIDENT',
          senderName: mockResident.fullName,
          message: description,
          createdAt: new Date().toISOString()
        }
      ]
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets]
    }));

    return newTicket;
  },

  addChatMessage: (roomId, text) => set((state) => ({
    chatRooms: state.chatRooms.map((room) => {
      if (room.id === roomId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: 'RESIDENT' as const,
          text,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...room,
          lastMessage: text,
          lastMessageTime: 'الآن',
          messages: [...room.messages, newMsg]
        };
      }
      return room;
    })
  })),

  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
  })),

  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
  }))
}));
