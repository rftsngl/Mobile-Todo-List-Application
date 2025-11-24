// Mock Admin Service Layer
// This will be replaced with real API calls later

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface Invite {
  id: string;
  email: string;
  role: 'member' | 'admin';
  status: InviteStatus;
  sentAt: string;
  expiresAt?: string;
  note?: string;
}

export interface CompanySettings {
  name: string;
  domain?: string;
  logo?: string;
  inviteExpiryDays: number;
  approvalMode: 'auto' | 'manual';
  requiresApproval: boolean;
}

// Mock data
const mockInvites: Invite[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    role: 'member',
    status: 'pending',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Engineering team member'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    role: 'admin',
    status: 'accepted',
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    email: 'expired.user@example.com',
    role: 'member',
    status: 'expired',
    sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockCompanySettings: CompanySettings = {
  name: 'TaskFlow Solutions',
  domain: 'taskflow.com',
  logo: undefined,
  inviteExpiryDays: 7,
  approvalMode: 'manual',
  requiresApproval: true
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Admin service functions
export const adminService = {
  // Invites
  async getInvites(): Promise<Invite[]> {
    await delay(800);
    return [...mockInvites];
  },

  async sendInvites(invites: { emails: string[]; role: 'member' | 'admin'; note?: string }): Promise<Invite[]> {
    await delay(1200);
    
    const newInvites = invites.emails.map(email => ({
      id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      role: invites.role,
      status: 'pending' as InviteStatus,
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: invites.note
    }));

    mockInvites.unshift(...newInvites);
    return newInvites;
  },

  async resendInvite(inviteId: string): Promise<Invite> {
    await delay(600);
    
    const inviteIndex = mockInvites.findIndex(invite => invite.id === inviteId);
    if (inviteIndex === -1) {
      throw new Error('Invite not found');
    }

    mockInvites[inviteIndex] = {
      ...mockInvites[inviteIndex],
      status: 'pending',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    return mockInvites[inviteIndex];
  },

  async revokeInvite(inviteId: string): Promise<void> {
    await delay(500);
    
    const inviteIndex = mockInvites.findIndex(invite => invite.id === inviteId);
    if (inviteIndex === -1) {
      throw new Error('Invite not found');
    }

    mockInvites.splice(inviteIndex, 1);
  },

  // Company Settings
  async getCompanySettings(): Promise<CompanySettings> {
    await delay(600);
    return { ...mockCompanySettings };
  },

  async updateCompanySettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    await delay(900);
    
    Object.assign(mockCompanySettings, settings);
    return { ...mockCompanySettings };
  },

  async uploadLogo(file: File): Promise<string> {
    await delay(1500);
    
    // Simulate file upload and return mock URL
    const mockLogoUrl = `https://example.com/logos/${file.name}_${Date.now()}`;
    mockCompanySettings.logo = mockLogoUrl;
    
    return mockLogoUrl;
  }
};