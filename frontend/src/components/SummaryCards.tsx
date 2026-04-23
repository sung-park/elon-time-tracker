"use client";

import { Clock, AlertTriangle, TrendingUp, Target } from "lucide-react";
import type { Claim } from "@/data/mock_data";
import { useI18n } from "@/i18n/context";

interface SummaryCardsProps {
  claims: Claim[];
}

function getDelay(c: Claim): number | null {
  if (c.delta_months !== null && c.delta_months > 0) return c.delta_months;
  if (c.status === "delayed") {
    const [y, m] = c.target_date.split("-").map(Number);
    return (2026 - y) * 12 + (4 - m);
  }
  return null;
}

export default function SummaryCards({ claims }: SummaryCardsProps) {
  const { t } = useI18n();

  const achieved = claims.filter((c) => c.status === "achieved");
  const delayed = claims.filter((c) => c.status === "delayed");
  const pending = claims.filter((c) => c.status === "pending");

  const allDelays = claims.map(getDelay).filter((d): d is number => d !== null);
  const avgDelay = allDelays.length > 0 ? allDelays.reduce((a, b) => a + b, 0) / allDelays.length : 0;

  const achievedDelays = achieved
    .map((c) => c.delta_months)
    .filter((d): d is number => d !== null && d > 0);
  const avgAchievedDelay = achievedDelays.length > 0
    ? achievedDelays.reduce((a, b) => a + b, 0) / achievedDelays.length
    : 0;

  const onTimeCount = achieved.filter((c) => c.delta_months === 0).length;
  const totalResolved = achieved.length + delayed.length;
  const onTimeRate = totalResolved > 0 ? Math.round((onTimeCount / totalResolved) * 100) : 0;

  let maxDelay = 0;
  let maxClaim: Claim | null = null;
  for (const c of claims) {
    const d = getDelay(c);
    if (d !== null && d > maxDelay) {
      maxDelay = d;
      maxClaim = c;
    }
  }

  const cards = [
    {
      icon: Clock,
      label: t.avgDelay,
      value: `${avgDelay.toFixed(1)} ${t.months}`,
      sub: t.delayedCount(allDelays.length, avgAchievedDelay),
      accent: "text-orange-500",
    },
    {
      icon: Target,
      label: t.onTimeRate,
      value: `${onTimeRate}%`,
      sub: t.onTimeSub(onTimeCount, totalResolved, pending.length),
      accent: onTimeRate > 30 ? "text-green-500" : "text-yellow-500",
    },
    {
      icon: AlertTriangle,
      label: t.maxDelay,
      value: maxClaim ? `+${maxDelay} ${t.months}` : "-",
      sub: maxClaim
        ? (maxClaim.claim.length > 30 ? maxClaim.claim.slice(0, 30) + "…" : maxClaim.claim) +
          (maxClaim.status === "delayed" ? ` ${t.inProgress}` : "")
        : "",
      accent: "text-tesla-red",
    },
    {
      icon: TrendingUp,
      label: t.achievedDelayedPending,
      value: `${achieved.length} / ${delayed.length} / ${pending.length}`,
      sub: t.totalN(claims.length),
      accent: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-card-bg border border-card-border rounded-xl p-4 hover:border-white/10 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <card.icon className={`w-3.5 h-3.5 ${card.accent}`} />
            <span className="text-[11px] text-muted uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <div className={`text-xl font-bold ${card.accent}`}>{card.value}</div>
          {card.sub && (
            <div className="text-[11px] text-muted mt-1 truncate">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
