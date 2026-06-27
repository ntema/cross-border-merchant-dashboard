"use client";

import { useState, useEffect } from "react";
import { useGetTenantQuery, useGetTransactionsQuery } from "@/store/ledgerApi";
import LedgerTable from "@/components/ledger/LedgerTable";
import TenantSelector from "@/components/TenantSelector";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  const [tenantId, setTenantId] = useState("alpha");

  const { data: tenant } = useGetTenantQuery(tenantId);
  const { data: transactions = [], isLoading, error } = useGetTransactionsQuery(tenantId);

//   // Dynamic tenant theming
//   useEffect(() => {
//     if (tenant?.themeColor) {
//       document.documentElement.style.setProperty('--primary', tenant.themeColor);
//     }
//     document.documentElement.classList.remove("tenant-alpha", "tenant-beta");
//     document.documentElement.classList.add(`tenant-${tenantId}`);
//   }, [tenantId, tenant]);

      // Dynamic tenant theming
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous tenant classes
    root.classList.remove("tenant-alpha", "tenant-beta");
    root.classList.add(`tenant-${tenantId}`);
    
    // Force Tailwind to re-evaluate
    if (tenant?.themeColor) {
      root.style.setProperty('--primary', tenant.themeColor);
    }
  }, [tenantId, tenant]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Cross-Border Merchant Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              {tenant?.businessName || "Loading tenant..."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <TenantSelector tenantId={tenantId} onChange={setTenantId} />
            <ThemeToggle />
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-4xl font-semibold mt-3">{transactions.length}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground">Base Currency</p>
            <p className="text-4xl font-semibold mt-3">{tenant?.baseCurrency}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground">Last Activity</p>
            <p className="text-4xl font-semibold mt-3">
              {transactions.length > 0 
                ? new Date(transactions[0].createdAt).toLocaleDateString() 
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Ledger Table */}
        <LedgerTable 
          transactions={transactions} 
          isLoading={isLoading} 
          error={error} 
          tenant={tenant} 
        />
      </div>
    </div>
  );
}