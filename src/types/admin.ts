export type LeadStatus = "new" | "contacted" | "qualified" | "closed_won" | "closed_lost";

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  businessAddress: string;
  currentProvider: string;
  employees?: string;
  comments?: string;
  status: LeadStatus;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  plan?: "starter" | "professional" | "enterprise";
}

export interface AnalyticsSummary {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  closed_won: number;
  closed_lost: number;
  byPlan: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  recentCount: number; // last 7 days
  conversionRate: number; // closed_won / total
}

export interface AdminUser {
  id: string;
  email: string;
  token: string;
}

export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
