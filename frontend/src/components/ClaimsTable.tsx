"use client";

import type { Claim } from "@/data/mock_data";
import { useI18n } from "@/i18n/context";

interface ClaimsTableProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

export default function ClaimsTable({ claims, onSelectClaim }: ClaimsTableProps) {
  const { t } = useI18n();

  const statusBadge = (status: Claim["status"]) => {
    const styles = {
      achieved: "bg-green-500/10 text-green-500 border-green-500/30",
      delayed: "bg-tesla-red/10 text-tesla-red border-tesla-red/30",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    };
    const labels = { achieved: t.statusAchieved, delayed: t.statusDelayed, pending: t.statusPending };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
      <div className="p-5 pb-3">
        <h2 className="text-sm text-muted uppercase tracking-wider">{t.tableTitle}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-card-border text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">{t.colAnnounced}</th>
              <th className="text-left px-5 py-3 font-medium">{t.colClaim}</th>
              <th className="text-left px-5 py-3 font-medium">{t.colTarget}</th>
              <th className="text-left px-5 py-3 font-medium">{t.colActual}</th>
              <th className="text-right px-5 py-3 font-medium">{t.colDelta}</th>
              <th className="text-center px-5 py-3 font-medium">{t.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, i) => (
              <tr key={i} onClick={() => onSelectClaim(claim)} className="border-t border-card-border hover:bg-white/[0.02] cursor-pointer transition-colors">
                <td className="px-5 py-3 font-mono text-muted whitespace-nowrap">{claim.date_announced}</td>
                <td className="px-5 py-3 font-medium max-w-xs truncate">{claim.claim}</td>
                <td className="px-5 py-3 font-mono whitespace-nowrap">{claim.target_date}</td>
                <td className="px-5 py-3 font-mono whitespace-nowrap">{claim.actual_date ?? "-"}</td>
                <td className="px-5 py-3 text-right font-mono">
                  {claim.delta_months !== null ? (
                    <span className={claim.delta_months === 0 ? "text-green-500" : claim.delta_months <= 6 ? "text-yellow-500" : "text-tesla-red"}>
                      {claim.delta_months === 0 ? "0" : `+${claim.delta_months}`}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center">{statusBadge(claim.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
