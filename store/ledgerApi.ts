import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockLedgerData } from "@/lib/mockLedgerData";

export interface Tenant {
  tenantId: string;
  businessName: string;
  baseCurrency: string;
  locale: string;
  themeColor: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  amountInMinor: number;
  type: "CREDIT" | "DEBIT";
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
  narration: string;
  createdAt: string;
}

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  
  // Task 2: Cache tagging for automatic invalidation
  tagTypes: ["MerchantProfile"],

  endpoints: (builder) => ({
    // Renamed/aligned to match Task 2 requirement
    getMerchantProfile: builder.query<Tenant, string>({
      queryFn: (tenantId) => {
        const tenant =
          mockLedgerData.tenants[
            tenantId as keyof typeof mockLedgerData.tenants
          ];
        return tenant
          ? { data: tenant }
          : { error: { status: 404, data: "Tenant not found" } };
      },
      // Provides tag so we can invalidate it after mutation
      providesTags: (result, error, tenantId) => 
        result ? [{ type: "MerchantProfile", id: tenantId }] : [],
    }),

    getTransactions: builder.query<Transaction[], string>({
      queryFn: (tenantId) => {
        const transactions = mockLedgerData.transactions.filter(
          (tx) => tx.tenantId === tenantId
        );
        return { data: transactions };
      },
      // No cache invalidation needed for transactions in this task
    }),

    // New: Mutation to update business name (Task 2 requirement)
    updateBusinessName: builder.mutation<void, { tenantId: string; newName: string }>({
      queryFn: ({ tenantId, newName }) => {
        // Mock update (in real app this would call your backend)
        if (mockLedgerData.tenants[tenantId as keyof typeof mockLedgerData.tenants]) {
          mockLedgerData.tenants[tenantId as keyof typeof mockLedgerData.tenants].businessName = newName;
          return { data: undefined };
        }
        return { error: { status: 404, data: "Tenant not found" } };
      },
      // Invalidates cache so getMerchantProfile refetches automatically
      invalidatesTags: (result, error, { tenantId }) => 
        [{ type: "MerchantProfile", id: tenantId }],
    }),
  }),
});

export const { 
  useGetMerchantProfileQuery, 
  useGetTransactionsQuery,
  useUpdateBusinessNameMutation 
} = ledgerApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { mockLedgerData } from "@/lib/mockLedgerData";

// export interface Tenant {
//   tenantId: string;
//   businessName: string;
//   baseCurrency: string;
//   locale: string;
//   themeColor: string;
// }

// export interface Transaction {
//   id: string;
//   tenantId: string;
//   amountInMinor: number;
//   type: "CREDIT" | "DEBIT";
//   status: "SUCCESSFUL" | "FAILED" | "PENDING";
//   narration: string;
//   createdAt: string;
// }

// export const ledgerApi = createApi({
//   reducerPath: "ledgerApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
//   endpoints: (builder) => ({
//     getTenant: builder.query<Tenant, string>({
//       queryFn: (tenantId) => {
//         const tenant =
//           mockLedgerData.tenants[
//             tenantId as keyof typeof mockLedgerData.tenants
//           ];
//         return tenant
//           ? { data: tenant }
//           : { error: { status: 404, data: "Tenant not found" } };
//       },
//     }),

//     getTransactions: builder.query<Transaction[], string>({
//       queryFn: (tenantId) => {
//         const transactions = mockLedgerData.transactions.filter(
//           (tx) => tx.tenantId === tenantId
//         );
//         return { data: transactions };
//       },
//     }),
//   }),
// });

// export const { useGetTenantQuery, useGetTransactionsQuery } = ledgerApi;