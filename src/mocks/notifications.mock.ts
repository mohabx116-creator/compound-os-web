import type { AppNotification } from '../types/common.types';

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-401',
    title: 'فاتورة صيانة مستحقة الدفع',
    content: 'تم إصدار فاتورة رسوم الصيانة الشهرية لشهر مايو بقيمة ٢,٥٠٠ ج.م، يرجى السداد قبل تاريخ ٥ مايو لتجنب الغرامات.',
    isRead: false,
    createdAt: '2026-05-23T08:00:00Z',
    type: 'PAYMENT',
    referenceId: 'pay-101',
  },
  {
    id: 'notif-402',
    title: 'تحديث بشأن شكواك (تسريب المياه)',
    content: 'قام الفني المختص بتغيير حالة الشكوى رقم comp-201 إلى "تحت التنفيذ" وبدء التجهيزات لحل المشكلة.',
    isRead: false,
    createdAt: '2026-05-22T14:20:00Z',
    type: 'COMPLAINT',
    referenceId: 'comp-201',
  },
  {
    id: 'notif-403',
    title: 'طلب دخول زائر مؤقت',
    content: 'تم إصدار تصريح دخول للزائر "خالد أحمد" بنجاح، التصريح صالح لمدة ٢٤ ساعة ومرفق به كود QR الخاص بالدخول.',
    isRead: true,
    createdAt: '2026-05-21T10:15:00Z',
    type: 'VISITOR',
    referenceId: 'vis-501',
  },
  {
    id: 'notif-404',
    title: 'تنويه هام: أعمال صيانة شبكة الكهرباء والمياه',
    content: 'سيتم قطع مؤقت لخدمات الكهرباء والمياه في قطاع الياسمين يوم السبت ٢٥ مايو من الساعة ١٠ صباحاً للقيام بأعمال وقائية.',
    isRead: true,
    createdAt: '2026-05-20T10:05:00Z',
    type: 'ANNOUNCEMENT',
    referenceId: 'ann-301',
  },
];
