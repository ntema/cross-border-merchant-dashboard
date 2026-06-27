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
      case "SUCCESSFUL": return "bg-green-500/10 text-green-500";
      case "FAILED": return "bg-red-500/10 text-red-500";
      case "PENDING": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-gray-500/10";
    }
  };

  if (isLoading) return <div className="py-12 text-center">Loading transactions...</div>;
  if (error) return <div className="text-red-500 py-12 text-center">Failed to load data</div>;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ledger Transactions</h2>
        <div className="text-sm text-muted-foreground">
          {tenant?.businessName}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-6">ID</th>
              <th className="text-left p-6">Date</th>
              <th className="text-left p-6">Type</th>
              <th className="text-right p-6">Amount</th>
              <th className="text-left p-6">Narration</th>
              <th className="text-left p-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-muted/50">
                <td className="p-6 font-mono text-sm">{tx.id}</td>
                <td className="p-6 text-sm">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
                <td className="p-6">
                  <span className={`font-medium ${tx.type === "CREDIT" ? "text-green-500" : "text-red-500"}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-6 text-right font-semibold">
                  {formatAmount(tx.amountInMinor, tenant?.baseCurrency)}
                </td>
                <td className="p-6 max-w-md">{tx.narration}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}