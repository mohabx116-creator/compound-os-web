import type { Payment } from '../types/common.types';

export const mockPayments: Payment[] = [
  {
    id: 'pay-101',
    amount: 2500,
    title: 'رسوم الصيانة الشهرية - مايو ٢٠٢٤',
    status: 'PENDING',
    dueDate: '2024-05-05',
    invoiceNumber: 'INV-2024-001',
    billingPeriod: 'مايو ٢٠٢٤',
  },
  {
    id: 'pay-102',
    amount: 1200,
    title: 'رسوم النظافة والتخلص من النفايات',
    status: 'OVERDUE',
    dueDate: '2024-04-15',
    invoiceNumber: 'INV-2024-002',
    billingPeriod: 'أبريل ٢٠٢٤',
  },
  {
    id: 'pay-103',
    amount: 5000,
    title: 'اشتراك النادي الرياضي السنوي',
    status: 'PAID',
    dueDate: '2024-03-01',
    paidDate: '2024-02-28',
    invoiceNumber: 'INV-2024-003',
    billingPeriod: 'مارس ٢٠٢٤ - مارس ٢٠٢٥',
    paymentMethod: 'بطاقة ائتمانية (فوري)',
  },
  {
    id: 'pay-104',
    amount: 2500,
    title: 'رسوم الصيانة الشهرية - أبريل ٢٠٢٤',
    status: 'PAID',
    dueDate: '2024-04-05',
    paidDate: '2024-04-03',
    invoiceNumber: 'INV-2024-004',
    billingPeriod: 'أبريل ٢٠٢٤',
    paymentMethod: 'حوالة بنكية',
  },
];
