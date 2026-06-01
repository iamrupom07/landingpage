import { baseApi } from "@/store/base-api";
import type {
  AnalyticsSummary,
  CreateManualLeadPayload,
  Lead,
  LeadSource,
  LeadStatus,
  PaginatedLeads,
  SendEmailPayload,
} from "@/types/admin";

export type GetLeadsParams = {
  page?:     number;
  pageSize?: number;
  search?:   string;
  status?:   LeadStatus | "all";
  plan?:     Lead["plan"] | "all" | string;
  source?:   LeadSource | "all";
};

type ExportLeadsParams = Pick<GetLeadsParams, "search" | "status" | "plan" | "source">;

type ApiLeadsResponse = {
  success:    boolean;
  leads:      Lead[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};

type ApiDataResponse<T> = {
  success: boolean;
  data:    T;
};

function buildLeadsPath(path: string, params: GetLeadsParams = {}) {
  const { page = 1, pageSize = 10, search = "", status = "all", plan = "all", source = "all" } = params;
  const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });

  if (search)           query.set("search", search);
  if (status !== "all") query.set("status", status);
  if (plan   !== "all") query.set("plan",   plan);
  if (source !== "all") query.set("source", source);

  return `${path}?${query}`;
}

function buildExportPath(params: ExportLeadsParams = {}) {
  const { search = "", status = "all", plan = "all", source = "all" } = params;
  const query = new URLSearchParams();

  if (search)           query.set("search", search);
  if (status !== "all") query.set("status", status);
  if (plan   !== "all") query.set("plan",   plan);
  if (source !== "all") query.set("source", source);

  return query.toString() ? `/leads/export?${query}` : "/leads/export";
}

function mapLeadsResponse(response: ApiLeadsResponse): PaginatedLeads {
  return {
    leads:      response.leads,
    total:      response.total,
    page:       response.page,
    pageSize:   response.pageSize,
    totalPages: response.totalPages,
  };
}

export const adminLeadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<PaginatedLeads, GetLeadsParams | void>({
      query: (params) => buildLeadsPath("/leads", params ?? {}),
      transformResponse: mapLeadsResponse,
      providesTags: (result) =>
        result
          ? [
              { type: "LeadList", id: "LIST" },
              ...result.leads.map((lead) => ({ type: "Lead" as const, id: lead.id })),
            ]
          : [{ type: "LeadList", id: "LIST" }],
    }),

    getLead: builder.query<Lead, string>({
      query: (id) => `/leads/${id}`,
      transformResponse: (response: ApiDataResponse<Lead>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Lead", id }],
    }),

    getAnalytics: builder.query<AnalyticsSummary, void>({
      query: () => "/analytics/summary",
      transformResponse: (response: ApiDataResponse<AnalyticsSummary>) => response.data,
      providesTags: [{ type: "Analytics", id: "SUMMARY" }],
    }),

    createManualLead: builder.mutation<Lead, CreateManualLeadPayload>({
      query: (payload) => ({
        url:    "/leads/manual",
        method: "POST",
        body:   payload,
      }),
      transformResponse: (response: ApiDataResponse<Lead>) => response.data,
      invalidatesTags: [
        { type: "Analytics", id: "SUMMARY" },
        { type: "LeadList",  id: "LIST" },
      ],
    }),

    updateLeadStatus: builder.mutation<Lead, { id: string; status: LeadStatus }>({
      query: ({ id, status }) => ({
        url:    `/leads/${id}/status`,
        method: "PATCH",
        body:   { status },
      }),
      transformResponse: (response: ApiDataResponse<Lead>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Analytics", id: "SUMMARY" },
        { type: "Lead",      id },
        { type: "LeadList",  id: "LIST" },
      ],
    }),

    sendEmailToLead: builder.mutation<void, { id: string; payload: SendEmailPayload }>({
      query: ({ id, payload }) => ({
        url:    `/leads/${id}/email`,
        method: "POST",
        body:   payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Lead", id }],
    }),

    deleteLead: builder.mutation<void, string>({
      query: (id) => ({
        url:    `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Analytics", id: "SUMMARY" },
        { type: "Lead",      id },
        { type: "LeadList",  id: "LIST" },
      ],
    }),

    exportLeads: builder.mutation<{ csv: string; filename: string }, ExportLeadsParams | void>({
      query: (params) => ({
        url: buildExportPath(params ?? {}),
        responseHandler: async (response) => {
          const disposition = response.headers.get("content-disposition") ?? "";
          const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);

          return {
            csv:      await response.text(),
            filename: filenameMatch?.[1] ?? `leads-${new Date().toISOString().slice(0, 10)}.csv`,
          };
        },
      }),
    }),
  }),
});

export const {
  useCreateManualLeadMutation,
  useDeleteLeadMutation,
  useExportLeadsMutation,
  useGetAnalyticsQuery,
  useGetLeadQuery,
  useGetLeadsQuery,
  useSendEmailToLeadMutation,
  useUpdateLeadStatusMutation,
} = adminLeadsApi;
