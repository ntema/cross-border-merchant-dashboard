"use client";

/**
 * LEARNING POINT: Decoupled Components (Controlled Inputs)
 * Notice how this component does not manage its own state or interact with the URL directly.
 * It strictly relies on what its parent tells it to do via `props`.
 * This design makes it highly reusable and prevents it from breaking other application modules.
 */
interface TenantSelectorProps {
  tenantId: string; // Tells the selector which element is currently selected
  onChange: (tenantId: string) => void; // Dispatches the selected change string back to the dashboard parent
}

export default function TenantSelector({ tenantId, onChange }: TenantSelectorProps) {
  // Available tenant options inside our mocked system environment
  const tenants = ["alpha", "beta"];

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-muted-foreground whitespace-nowrap">Switch Tenant:</label>
      <select
        value={tenantId}
        // When a user selects a different drop-down item, we pass the execution up to the parent handler
        onChange={(e) => onChange(e.target.value)}
        className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary capitalize"
      >
        {tenants.map((id) => (
          <option key={id} value={id}>
            {/* Dynamic label generation based on the multi-tenant scope setup */}
            {id === "alpha" ? "Alpha Global Trading" : "Beta Retail Solutions"}
          </option>
        ))}
      </select>
    </div>
  );
}