"use client";

import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { DollarSign, Rocket, ArrowRight } from "lucide-react";
import type { Claim, ImpactType } from "@/data/mock_data";
import { classifyImpact } from "@/data/mock_data";
import { useI18n } from "@/i18n/context";

interface ImpactComparisonProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

interface GroupStats {
  total: number; achieved: number; delayed: number; pending: number;
  avgDelay: number; maxDelay: number; onTimeRate: number; claims: Claim[];
}

function getDelay(c: Claim): number | null {
  if (c.delta_months !== null && c.delta_months > 0) return c.delta_months;
  if (c.status === "delayed") {
    const [y, m] = c.target_date.split("-").map(Number);
    return (2026 - y) * 12 + (4 - m);
  }
  return null;
}

function calcStats(claims: Claim[]): GroupStats {
  const achieved = claims.filter((c) => c.status === "achieved");
  const delayed = claims.filter((c) => c.status === "delayed");
  const pending = claims.filter((c) => c.status === "pending");
  const allDelays = claims.map(getDelay).filter((d): d is number => d !== null);
  const onTime = achieved.filter((c) => c.delta_months === 0).length;
  const totalResolved = achieved.length + delayed.length;
  return {
    total: claims.length, achieved: achieved.length, delayed: delayed.length, pending: pending.length,
    avgDelay: allDelays.length > 0 ? allDelays.reduce((a, b) => a + b, 0) / allDelays.length : 0,
    maxDelay: allDelays.length > 0 ? Math.max(...allDelays) : 0,
    onTimeRate: totalResolved > 0 ? Math.round((onTime / totalResolved) * 100) : 0,
    claims,
  };
}

function estimateDelay(c: Claim): number {
  if (c.delta_months !== null) return c.delta_months;
  if (c.status === "pending") return 0;
  const [y, m] = c.target_date.split("-").map(Number);
  return (2026 - y) * 12 + (4 - m);
}

export default function ImpactComparison({ claims, onSelectClaim }: ImpactComparisonProps) {
  const { t } = useI18n();
  const [focusGroup, setFocusGroup] = useState<ImpactType | null>(null);

  const { invest, comm } = useMemo(() => {
    const investClaims: Claim[] = [];
    const commClaims: Claim[] = [];
    for (const c of claims) {
      if (classifyImpact(c.claim) === "investment") investClaims.push(c);
      else commClaims.push(c);
    }
    return { invest: calcStats(investClaims), comm: calcStats(commClaims) };
  }, [claims]);

  const comparisonBars = [
    { name: t.compBarAvgDelay, invest: +invest.avgDelay.toFixed(1), comm: +comm.avgDelay.toFixed(1) },
    { name: t.compBarMaxDelay, invest: invest.maxDelay, comm: comm.maxDelay },
    { name: t.compBarOnTime, invest: invest.onTimeRate, comm: comm.onTimeRate },
    { name: t.compBarAchieved, invest: invest.achieved, comm: comm.achieved },
    { name: t.compBarDelayed, invest: invest.delayed, comm: comm.delayed },
  ];

  const focusStats = focusGroup === "investment" ? invest : focusGroup === "commercialization" ? comm : null;
  const focusClaims = focusStats?.claims.slice().sort((a, b) => estimateDelay(b) - estimateDelay(a)) ?? [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Investment panel */}
        <div
          className={`bg-card-bg border rounded-xl p-5 cursor-pointer transition-all ${focusGroup === "investment" ? "border-blue-500/50 ring-1 ring-blue-500/20" : "border-card-border hover:border-blue-500/30"}`}
          onClick={() => setFocusGroup(focusGroup === "investment" ? null : "investment")}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-blue-500/10"><DollarSign className="w-4 h-4 text-blue-400" /></div>
            <div>
              <h3 className="text-sm font-semibold text-blue-400">{t.investTitle}</h3>
              <p className="text-[10px] text-muted">{t.investDesc}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><div className="text-2xl font-bold text-blue-400">{invest.total}</div><div className="text-[10px] text-muted">{t.total}</div></div>
            <div><div className="text-2xl font-bold text-blue-400">{invest.onTimeRate}%</div><div className="text-[10px] text-muted">{t.onTimeRate}</div></div>
            <div><div className="text-2xl font-bold text-blue-400">{invest.avgDelay.toFixed(1)}</div><div className="text-[10px] text-muted">{t.avgDelayMonth}</div></div>
          </div>
          <div className="flex rounded-full overflow-hidden h-2 mt-4">
            <div className="bg-green-500" style={{ width: `${(invest.achieved / invest.total) * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${(invest.delayed / invest.total) * 100}%` }} />
            <div className="bg-yellow-500" style={{ width: `${(invest.pending / invest.total) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-1">
            <span>{t.statusAchieved} {invest.achieved}</span>
            <span>{t.statusDelayed} {invest.delayed}</span>
            <span>{t.statusPending} {invest.pending}</span>
          </div>
        </div>

        {/* Commercialization panel */}
        <div
          className={`bg-card-bg border rounded-xl p-5 cursor-pointer transition-all ${focusGroup === "commercialization" ? "border-tesla-red/50 ring-1 ring-tesla-red/20" : "border-card-border hover:border-tesla-red/30"}`}
          onClick={() => setFocusGroup(focusGroup === "commercialization" ? null : "commercialization")}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-tesla-red/10"><Rocket className="w-4 h-4 text-tesla-red" /></div>
            <div>
              <h3 className="text-sm font-semibold text-tesla-red">{t.commTitle}</h3>
              <p className="text-[10px] text-muted">{t.commDesc}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><div className="text-2xl font-bold text-tesla-red">{comm.total}</div><div className="text-[10px] text-muted">{t.total}</div></div>
            <div><div className="text-2xl font-bold text-tesla-red">{comm.onTimeRate}%</div><div className="text-[10px] text-muted">{t.onTimeRate}</div></div>
            <div><div className="text-2xl font-bold text-tesla-red">{comm.avgDelay.toFixed(1)}</div><div className="text-[10px] text-muted">{t.avgDelayMonth}</div></div>
          </div>
          <div className="flex rounded-full overflow-hidden h-2 mt-4">
            <div className="bg-green-500" style={{ width: `${(comm.achieved / comm.total) * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${(comm.delayed / comm.total) * 100}%` }} />
            <div className="bg-yellow-500" style={{ width: `${(comm.pending / comm.total) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-1">
            <span>{t.statusAchieved} {comm.achieved}</span>
            <span>{t.statusDelayed} {comm.delayed}</span>
            <span>{t.statusPending} {comm.pending}</span>
          </div>
        </div>
      </div>

      {/* Comparison bar chart */}
      <div className="bg-card-bg border border-card-border rounded-xl p-5">
        <h3 className="text-sm text-muted uppercase tracking-wider mb-4">{t.comparisonTitle}</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonBars} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="invest" name={t.investTitle} fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="comm" name={t.commTitle} fill="#e31937" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-background rounded-lg border border-card-border">
          <div className="text-xs text-muted">
            <span className="text-foreground font-medium">{t.coreInsight}</span>{" "}
            {comm.avgDelay > invest.avgDelay
              ? t.insightCommLonger(comm.avgDelay.toFixed(1), invest.avgDelay.toFixed(1), (comm.avgDelay - invest.avgDelay).toFixed(1))
              : t.insightInvestLonger(invest.avgDelay.toFixed(1), comm.avgDelay.toFixed(1), (invest.avgDelay - comm.avgDelay).toFixed(1))
            }
            {t.onTimeRateCompare(invest.onTimeRate, comm.onTimeRate)}
          </div>
        </div>
      </div>

      {/* Focused detail list */}
      {focusStats && (
        <div className="bg-card-bg border border-card-border rounded-xl p-5">
          <h3 className="text-sm text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            {focusGroup === "investment"
              ? <><DollarSign className="w-3.5 h-3.5 text-blue-400" /> {t.detailInvest}</>
              : <><Rocket className="w-3.5 h-3.5 text-tesla-red" /> {t.detailComm}</>
            }
            <span className="text-[10px] font-normal">{t.nItemsDeltaSort(focusClaims.length)}</span>
          </h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {focusClaims.map((c, i) => {
              const delay = estimateDelay(c);
              return (
                <div key={i} className="flex items-center gap-3 py-2 px-2 rounded hover:bg-white/[0.03] cursor-pointer transition-colors text-sm" onClick={() => onSelectClaim(c)}>
                  <div className="flex-1 truncate text-gray-300">{c.claim}</div>
                  <div className="text-[11px] text-muted font-mono shrink-0 w-24 text-right">
                    {c.date_announced} <ArrowRight className="w-3 h-3 inline text-muted/50" /> {c.target_date}
                  </div>
                  <div className="w-16 text-right shrink-0">
                    {c.status === "achieved" ? (
                      <span className={`text-xs font-mono font-bold ${c.delta_months === 0 ? "text-green-500" : c.delta_months! <= 6 ? "text-yellow-500" : "text-tesla-red"}`}>
                        {c.delta_months === 0 ? "ON TIME" : `+${c.delta_months}mo`}
                      </span>
                    ) : c.status === "delayed" ? (
                      <span className="text-xs font-mono text-tesla-red">+{delay}mo+</span>
                    ) : (
                      <span className="text-xs text-blue-400">pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
