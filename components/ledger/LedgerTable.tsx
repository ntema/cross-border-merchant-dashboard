/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Transaction } from "@/store/ledgerApi";

interface LedgerTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: any;
  tenant?: any;
}

export default function LedgerTable({ transactions, isLoading, error, tenant }: LedgerTableProps) {
  const formatAmount = (amountInMinor: number, currency: string = "USD") => {
    const amount = amountInMinor / 100;
    return new Intl.NumberFormat(tenant?.locale || "en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESSFUL": 
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "FAILED": 
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      case "PENDING": 
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      default: 
        return "bg-gray-500/10 text-gray-600";
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-12 text-center">Failed to load transactions</div>;
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ledger Transactions</h2>
        <div className="text-sm text-muted-foreground font-medium">
          {tenant?.businessName}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-6 font-medium">ID</th>
              <th className="text-left p-6 font-medium">Date</th>
              <th className="text-left p-6 font-medium">Type</th>
              <th className="text-right p-6 font-medium">Amount</th>
              <th className="text-left p-6 font-medium">Narration</th>
              <th className="text-left p-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                <td className="p-6 font-mono text-sm">{tx.id}</td>
                <td className="p-6">
                  {new Date(tx.createdAt).toLocaleDateString(tenant?.locale || 'en-US')}
                </td>
                <td className="p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${tx.type === "CREDIT" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                      : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-6 text-right font-semibold">
                  {formatAmount(tx.amountInMinor, tenant?.baseCurrency)}
                </td>
                <td className="p-6 max-w-md text-sm">{tx.narration}</td>
                <td className="p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No transactions found.
        </div>
      )}
    </div>
  );
}