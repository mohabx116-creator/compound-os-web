import { delay } from '../../../lib/utils/delay';
import { mockCommunityRules, mockContacts, mockDocuments } from '../../../mocks/services.mock';
import type { ContactItem, DocumentFile } from '../../../mocks/services.mock';

export const documentService = {
  async getDocuments(): Promise<DocumentFile[]> {
    await delay(300);
    return mockDocuments;
  },

  async getCommunityRules(): Promise<string[]> {
    await delay(200);
    return mockCommunityRules;
  },

  async getContacts(): Promise<ContactItem[]> {
    await delay(300);
    return mockContacts;
  },
};
