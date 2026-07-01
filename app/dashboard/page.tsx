"use client"; // Marks this module as a Next.js Client Component to allow hooks like useState, useEffect, and navigation

import { useState, useEffect } from "react";
// Next.js App Router navigation hooks for manipulating and reading the address bar
import { useRouter, useSearchParams } from "next/navigation"; 
import { useGetMerchantProfileQuery, useGetTransactionsQuery, useUpdateBusinessNameMutation } from "@/store/ledgerApi";
import LedgerTable from "@/components/ledger/LedgerTable";
import TenantSelector from "@/components/TenantSelector";

export default function Dashboard() {
  // useRouter allows us to programmatically change the URL path or query params
  const router = useRouter();
  
  // useSearchParams lets us read query string parameters (everything after the "?" in the URL)
  const searchParams = useSearchParams();

  /**
   * LEARNING POINT: Single Source of Truth (URL Sync)
   * Instead of hardcoding "alpha" as the initial state, we read the URL first.
   * If a user loads `localhost:3000/?tenant=beta`, the page immediately boots up in Beta mode.
   */
  const urlTenant = searchParams.get("tenant") as "alpha" | "beta" | null;
  const initialTenant = urlTenant === "beta" ? "beta" : "alpha";

  // Initialize state with whatever was detected in the URL path
  const [tenantId, setTenantId] = useState<"alpha" | "beta">(initialTenant);

  /**
   * LEARNING POINT: Reactive Data Fetching
   * RTK Query tracks `tenantId` as a dependency. The moment `tenantId` changes,
   * these hooks automatically refetch data for the correct merchant without manual triggers.
   */
  const { data: tenant } = useGetMerchantProfileQuery(tenantId);
  const { data: transactions = [], isLoading, error } = useGetTransactionsQuery(tenantId);

  // New: Mutation hook ready for Task 2 (updating business name)
  const [updateBusinessName] = useUpdateBusinessNameMutation();

  /**
   * LEARNING POINT: Browser History Sync (Back/Forward Buttons)
   * This effect runs when the URL query parameters change. If a user clicks the 
   * browser's "Back" button, the URL resets, and this hook updates local state to match.
   */
  useEffect(() => {
    if (urlTenant && (urlTenant === "alpha" || urlTenant === "beta")) {
      setTenantId(urlTenant);
    }
  }, [urlTenant]);

  /**
   * LEARNING POINT: Dynamic Theming via Global CSS Scope
   * This effect handles the UI requirement. By appending '.tenant-alpha' or '.tenant-beta' 
   * to the root HTML element, your Tailwind config or globals.css can swap CSS variables 
   * (e.g. changing primary colors from Navy Blue to Emerald Green) across the entire application instantly.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("tenant-alpha", "tenant-beta");
    root.classList.add(`tenant-${tenantId}`);
  }, [tenantId]);

  /**
   * LEARNING POINT: Centralized State Switcher
   * This custom handler handles the heavy lifting when a selection is made:
   * 1. Updates state locally to trigger an instant data refetch.
   * 2. Pushes the new state to the URL path bar so it is shareable.
   * `scroll: false` prevents Next.js from forcing the page view back to the top on change.
   */
  const handleTenantChange = (id: "alpha" | "beta") => {
    setTenantId(id);
    router.push(`?tenant=${id}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Cross-Border Merchant Dashboard</h1>
            {/* The business name dynamically resolves based on the current tenant data fetched */}
            <p className="text-xl text-muted-foreground mt-2">{tenant?.businessName}</p>
          </div>

          {/* Pass the dynamic state down to the controlled drop-down selection component */}
          <TenantSelector 
            tenantId={tenantId} 
            onChange={(id) => handleTenantChange(id as "alpha" | "beta")} 
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-5xl font-semibold mt-4">{transactions.length}</p>
          </div>
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">Base Currency</p>
            {/* Currency dynamically flips (USD vs NGN) depending on the active backend tenant profile */}
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


// "use client"; // Marks this module as a Next.js Client Component to allow hooks like useState, useEffect, and navigation

// import { useState, useEffect } from "react";
// // Next.js App Router navigation hooks for manipulating and reading the address bar
// import { useRouter, useSearchParams } from "next/navigation"; 
// import { useGetTenantQuery, useGetTransactionsQuery } from "@/store/ledgerApi";
// import LedgerTable from "@/components/ledger/LedgerTable";
// import TenantSelector from "@/components/TenantSelector";

// export default function Dashboard() {
//   // useRouter allows us to programmatically change the URL path or query params
//   const router = useRouter();
  
//   // useSearchParams lets us read query string parameters (everything after the "?" in the URL)
//   const searchParams = useSearchParams();

//   /**
//    * LEARNING POINT: Single Source of Truth (URL Sync)
//    * Instead of hardcoding "alpha" as the initial state, we read the URL first.
//    * If a user loads `localhost:3000/?tenant=beta`, the page immediately boots up in Beta mode.
//    */
//   const urlTenant = searchParams.get("tenant") as "alpha" | "beta" | null;
//   const initialTenant = urlTenant === "beta" ? "beta" : "alpha";

//   // Initialize state with whatever was detected in the URL path
//   const [tenantId, setTenantId] = useState<"alpha" | "beta">(initialTenant);

//   /**
//    * LEARNING POINT: Reactive Data Fetching
//    * RTK Query tracks `tenantId` as a dependency. The moment `tenantId` changes,
//    * these hooks automatically refetch data for the correct merchant without manual triggers.
//    */
//   const { data: tenant } = useGetTenantQuery(tenantId);
//   const { data: transactions = [], isLoading, error } = useGetTransactionsQuery(tenantId);

//   /**
//    * LEARNING POINT: Browser History Sync (Back/Forward Buttons)
//    * This effect runs when the URL query parameters change. If a user clicks the 
//    * browser's "Back" button, the URL resets, and this hook updates local state to match.
//    */
//   useEffect(() => {
//     if (urlTenant && (urlTenant === "alpha" || urlTenant === "beta")) {
//       setTenantId(urlTenant);
//     }
//   }, [urlTenant]);

//   /**
//    * LEARNING POINT: Dynamic Theming via Global CSS Scope
//    * This effect handles the UI requirement. By appending '.tenant-alpha' or '.tenant-beta' 
//    * to the root HTML element, your Tailwind config or globals.css can swap CSS variables 
//    * (e.g. changing primary colors from Navy Blue to Emerald Green) across the entire application instantly.
//    */
//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.remove("tenant-alpha", "tenant-beta");
//     root.classList.add(`tenant-${tenantId}`);
//   }, [tenantId]);

//   /**
//    * LEARNING POINT: Centralized State Switcher
//    * This custom handler handles the heavy lifting when a selection is made:
//    * 1. Updates state locally to trigger an instant data refetch.
//    * 2. Pushes the new state to the URL path bar so it is shareable.
//    * `scroll: false` prevents Next.js from forcing the page view back to the top on change.
//    */
//   const handleTenantChange = (id: "alpha" | "beta") => {
//     setTenantId(id);
//     router.push(`?tenant=${id}`, { scroll: false });
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
//       <div className="max-w-7xl mx-auto space-y-10">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <h1 className="text-4xl font-bold tracking-tighter">Cross-Border Merchant Dashboard</h1>
//             {/* The business name dynamically resolves based on the current tenant data fetched */}
//             <p className="text-xl text-muted-foreground mt-2">{tenant?.businessName}</p>
//           </div>

//           {/* Pass the dynamic state down to the controlled drop-down selection component */}
//           <TenantSelector 
//             tenantId={tenantId} 
//             onChange={(id) => handleTenantChange(id as "alpha" | "beta")} 
//           />
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="dashboard-card">
//             <p className="text-sm text-muted-foreground">Total Transactions</p>
//             <p className="text-5xl font-semibold mt-4">{transactions.length}</p>
//           </div>
//           <div className="dashboard-card">
//             <p className="text-sm text-muted-foreground">Base Currency</p>
//             {/* Currency dynamically flips (USD vs NGN) depending on the active backend tenant profile */}
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
