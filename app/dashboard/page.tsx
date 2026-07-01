

// "use client";

// import { useState, useEffect } from "react";
// import { useGetTenantQuery, useGetTransactionsQuery } from "@/store/ledgerApi";
// import LedgerTable from "@/components/ledger/LedgerTable";
// import TenantSelector from "@/components/TenantSelector";

// export default function Dashboard() {
//   const [tenantId, setTenantId] = useState<"alpha" | "beta">("alpha");

//   const { data: tenant } = useGetTenantQuery(tenantId);
//   const { data: transactions = [], isLoading, error } = useGetTransactionsQuery(tenantId);

//   // Tenant theming only
//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.remove("tenant-alpha", "tenant-beta");
//     root.classList.add(`tenant-${tenantId}`);
//   }, [tenantId]);

//   return (
//     <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
//       <div className="max-w-7xl mx-auto space-y-10">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <h1 className="text-4xl font-bold tracking-tighter">Cross-Border Merchant Dashboard</h1>
//             <p className="text-xl text-muted-foreground mt-2">{tenant?.businessName}</p>
//           </div>

//           <TenantSelector tenantId={tenantId} onChange={(id) => setTenantId(id as "alpha" | "beta")} />
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="dashboard-card">
//             <p className="text-sm text-muted-foreground">Total Transactions</p>
//             <p className="text-5xl font-semibold mt-4">{transactions.length}</p>
//           </div>
//           <div className="dashboard-card">
//             <p className="text-sm text-muted-foreground">Base Currency</p>
//             <p className="text-5xl font-semibold mt-4">{tenant?.baseCurrency}</p>
//           </div>
//           <div className="dashboard-card">
//             <p className="text-sm text-muted-foreground">Last Activity</p>
//             <p className="text-5xl font-semibold mt-4">
//               {transactions[0] 
//                 ? new Date(transactions[0].createdAt).toLocaleDateString() 
//                 : "—"}
//             </p>
//           </div>
//         </div>

//         {/* Ledger Table */}
//         <div className="dashboard-card p-0 overflow-hidden">
//           <LedgerTable 
//             transactions={transactions} 
//             isLoading={isLoading} 
//             error={error} 
//             tenant={tenant} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetTenantQuery, useGetTransactionsQuery } from "@/store/ledgerApi";
import LedgerTable from "@/components/ledger/LedgerTable";
import TenantSelector from "@/components/TenantSelector";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read tenant from URL query param, fallback to "alpha"
  const urlTenant = (searchParams.get("tenant") as "alpha" | "beta") || "alpha";
  const [tenantId, setTenantId] = useState<"alpha" | "beta">(urlTenant);

  const { data: tenant } = useGetTenantQuery(tenantId);
  const { data: transactions = [], isLoading, error } = useGetTransactionsQuery(tenantId);

  // Sync URL when tenant changes (new implementation)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tenant", tenantId);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  }, [tenantId, router, searchParams]);

  // Tenant theming only (unchanged)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("tenant-alpha", "tenant-beta");
    root.classList.add(`tenant-${tenantId}`);
  }, [tenantId]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Cross-Border Merchant Dashboard</h1>
            <p className="text-xl text-muted-foreground mt-2">{tenant?.businessName}</p>
          </div>

          <TenantSelector tenantId={tenantId} onChange={(id) => setTenantId(id as "alpha" | "beta")} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-5xl font-semibold mt-4">{transactions.length}</p>
          </div>
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">Base Currency</p>
            <p className="text-5xl font-semibold mt-4">{tenant?.baseCurrency}</p>
          </div>
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">Last Activity</p>
            <p className="text-5xl font-semibold mt-4">
              {transactions[0] 
                ? new Date(transactions[0].createdAt).toLocaleDateString() 
                : "—"}
            </p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="dashboard-card p-0 overflow-hidden">
          <LedgerTable 
            transactions={transactions} 
            isLoading={isLoading} 
            error={error} 
            tenant={tenant} 
          />
        </div>
      </div>
    </div>
  );
}