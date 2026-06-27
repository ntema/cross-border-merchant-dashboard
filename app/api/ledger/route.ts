import { NextRequest, NextResponse } from "next/server";
import { mockLedgerData } from "@/lib/mockLedgerData";

export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get("tenant") || "alpha";

  const transactions = mockLedgerData.transactions.filter(
    (tx) => tx.tenantId === tenantId
  );

  await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network

  return NextResponse.json({
    tenant:
      mockLedgerData.tenants[tenantId as keyof typeof mockLedgerData.tenants],
    transactions,
  });
}