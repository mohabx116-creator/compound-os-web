import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { Payment } from '../../../types/common.types';

export const paymentService = {
  async getPayments(): Promise<Payment[]> {
    await delay(300);
    return useAppStore.getState().payments;
  },

  async getPaymentById(id: string): Promise<Payment | undefined> {
    await delay(300);
    return useAppStore.getState().payments.find((p) => p.id === id);
  },

  async payInvoice(id: string, method: string): Promise<void> {
    await delay(500);
    useAppStore.getState().payInvoice(id, method);
  },
};
