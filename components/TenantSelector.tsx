"use client";

interface TenantSelectorProps {
  tenantId: string;
  onChange: (tenantId: string) => void;
}

export default function TenantSelector({ tenantId, onChange }: TenantSelectorProps) {
  const tenants = ["alpha", "beta"];

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-muted-foreground whitespace-nowrap">Switch Tenant:</label>
      <select
        value={tenantId}
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary capitalize"
      >
        {tenants.map((id) => (
          <option key={id} value={id}>
            {id === "alpha" ? "Alpha Global Trading" : "Beta Retail Solutions"}
          </option>
        ))}
      </select>
    </div>
  );
}