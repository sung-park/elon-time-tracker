"use client";

import { X, Calendar, Target, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { Claim } from "@/data/mock_data";
import { useI18n } from "@/i18n/context";

interface ClaimDetailProps {
  claim: Claim;
  onClose: () => void;
}

export default function ClaimDetail({ claim, onClose }: ClaimDetailProps) {
  const { t } = useI18n();

  const statusConfig = {
    achieved: { icon: CheckCircle, label: t.detailAchieved, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
    delayed: { icon: AlertCircle, label: t.detailDelayed, color: "text-tesla-red", bg: "bg-tesla-red/10", border: "border-tesla-red/30" },
    pending: { icon: Clock, label: t.detailPending, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  };

  const config = statusConfig[claim.status];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card-bg border border-card-border rounded-2xl w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bg} ${config.border} border`}>
              <StatusIcon className={`w-5 h-5 ${config.color}`} />
            </div>
            <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <h3 className="text-lg font-bold mb-4">{claim.claim}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted" />
              <span className="text-muted w-24">{t.announced}</span>
              <span className="font-mono">{claim.date_announced}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Target className="w-4 h-4 text-muted" />
              <span className="text-muted w-24">{t.targetDate}</span>
              <span className="font-mono">{claim.target_date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4 text-muted" />
              <span className="text-muted w-24">{t.actualDate}</span>
              <span className="font-mono">{claim.actual_date ?? t.notAchievedYet}</span>
            </div>
            {claim.delta_months !== null && (
              <div className="mt-4 p-4 bg-background rounded-lg border border-card-border">
                <div className="text-xs text-muted uppercase tracking-wider mb-1">{t.elonTimeDelta}</div>
                <div className={`text-3xl font-bold ${claim.delta_months === 0 ? "text-green-500" : claim.delta_months <= 6 ? "text-yellow-500" : "text-tesla-red"}`}>
                  {claim.delta_months === 0 ? t.onTimeResult : `+${claim.delta_months} ${t.months}`}
                </div>
              </div>
            )}
            {claim.status === "delayed" && (
              <div className="mt-4 p-4 bg-tesla-red/5 rounded-lg border border-tesla-red/20">
                <div className="text-xs text-tesla-red uppercase tracking-wider mb-1">{t.elapsed}</div>
                <div className="text-sm text-muted">{t.elapsedDesc(claim.target_date)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
