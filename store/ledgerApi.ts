/*
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LedgerTransaction {
  id: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  fee: number;
  status: "completed" | "pending" | "failed";
  counterparty: string;
}

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getLedger: builder.query<LedgerTransaction[], { tenant: string }>({
      query: ({ tenant }) => `/ledger?tenant=${tenant}`,
      // Simulate different data per tenant
      transformResponse: (response: LedgerTransaction[], meta, arg) => {
        return response;
      },
    }),
  }),
});

export const { useGetLedgerQuery } = ledgerApi;
*/

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
  endpoints: (builder) => ({
    getTenant: builder.query<Tenant, string>({
      queryFn: (tenantId) => {
        const tenant =
          mockLedgerData.tenants[
            tenantId as keyof typeof mockLedgerData.tenants
          ];
        return tenant
          ? { data: tenant }
          : { error: { status: 404, data: "Tenant not found" } };
      },
    }),

    getTransactions: builder.query<Transaction[], string>({
      queryFn: (tenantId) => {
        const transactions = mockLedgerData.transactions.filter(
          (tx) => tx.tenantId === tenantId
        );
        return { data: transactions };
      },
    }),
  }),
});

export const { useGetTenantQuery, useGetTransactionsQuery } = ledgerApi;