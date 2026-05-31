export type LeadStatus = "new" | "contacted" | "qualified" | "closed_won" | "closed_lost";
export type LeadSource = "form" | "manual";
export type Plan = "starter" | "professional" | "enterprise";

export interface Lead {
  id:              string;
  businessName:    string;
  contactName:     string;
  phone:           string;
  email:           string;
  businessAddress: string;
  currentProvider: string;
  employees?:      string;
  comments?:       string;
  status:          LeadStatus;
  plan?:           Plan;
  source:          LeadSource;
  ipAddress?:      string;
  createdAt:       string;
  updatedAt:       string;
  emailLogs?:      EmailLog[];
}

export interface EmailLog {
  id:           string;
  leadId:       string;
  type:         string;
  subject?:     string;
  recipient:    string;
  status:       string;
  errorMessage?: string;
  sentAt:       string;
}

export interface AnalyticsSummary {
  total:          number;
  new:            number;
  contacted:      number;
  qualified:      number;
  closed_won:     number;
  closed_lost:    number;
  byPlan: {
    starter:      number;
    professional: number;
    enterprise:   number;
  };
  recentCount:    number;
  formCount:      number;
  manualCount:    number;
  conversionRate: number;
}

export interface AdminUser {
  id:    string;
  email: string;
  name:  string;
}

export interface PaginatedLeads {
  leads:      Lead[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface CreateManualLeadPayload {
  businessName:    string;
  businessAddress: string;
  contactName:     string;
  phone:           string;
  email:           string;
  currentProvider: string;
  interestedPlan?: Plan;
  employeeCount?:  number;
  comments?:       string;
  status?:         LeadStatus;
}

export interface SendEmailPayload {
  subject: string;
  body:    string;
}
