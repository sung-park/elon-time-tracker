"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { Claim } from "@/data/mock_data";
import { useI18n } from "@/i18n/context";

interface DeltaChartProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

type SortMode = "delta" | "date" | "target";

function estimateDelay(c: Claim): number {
  if (c.delta_months !== null) return c.delta_months;
  if (c.status === "pending") return 0;
  const [y, m] = c.target_date.split("-").map(Number);
  return (2026 - y) * 12 + (4 - m);
}

export default function DeltaChart({ claims, onSelectClaim }: DeltaChartProps) {
  const { t } = useI18n();
  const [sortMode, setSortMode] = useState<SortMode>("delta");
  const [showOnlyDelayed, setShowOnlyDelayed] = useState(false);

  const filtered = useMemo(() => {
    let items = [...claims];
    if (showOnlyDelayed) {
      items = items.filter((c) => c.status === "delayed" || (c.delta_months !== null && c.delta_months > 0));
    }
    switch (sortMode) {
      case "delta": items.sort((a, b) => estimateDelay(b) - estimateDelay(a)); break;
      case "date": items.sort((a, b) => a.date_announced.localeCompare(b.date_announced)); break;
      case "target": items.sort((a, b) => a.target_date.localeCompare(b.target_date)); break;
    }
    return items;
  }, [claims, sortMode, showOnlyDelayed]);

  const chartData = filtered.map((c) => ({
    name: c.claim.length > 28 ? c.claim.slice(0, 28) + "…" : c.claim,
    delta: estimateDelay(c),
    status: c.status,
    claim: c,
  }));

  const getBarColor = (status: Claim["status"], delta: number) => {
    if (status === "pending") return "#3b82f6";
    if (delta === 0) return "#22c55e";
    if (delta <= 6) return "#eab308";
    if (delta <= 18) return "#f97316";
    return "#e31937";
  };

  const sortButtons: [SortMode, string][] = [
    ["delta", t.sortDelta],
    ["date", t.sortDate],
    ["target", t.sortTarget],
  ];

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-sm text-muted uppercase tracking-wider">{t.deltaTitle}</h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
            <input type="checkbox" checked={showOnlyDelayed} onChange={(e) => setShowOnlyDelayed(e.target.checked)} className="accent-tesla-red" />
            {t.showDelayedOnly}
          </label>
          <div className="flex gap-0.5 bg-background rounded-md p-0.5 ml-2">
            {sortButtons.map(([mode, label]) => (
              <button key={mode} onClick={() => setSortMode(mode)} className={`px-2.5 py-1 rounded text-xs transition-colors ${sortMode === mode ? "bg-card-border text-foreground" : "text-muted hover:text-foreground"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full" style={{ height: Math.max(400, chartData.length * 28) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid horizontal={false} stroke="#1a1a1a" />
            <XAxis type="number" tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#222" }} tickLine={false} domain={[0, "auto"]} />
            <YAxis type="category" dataKey="name" width={220} tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
              contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", fontSize: 12, padding: "8px 12px" }}
              formatter={(value, _name, props) => {
                const item = (props as unknown as { payload: typeof chartData[0] }).payload;
                const label = item.status === "pending" ? t.pending : item.status === "delayed" ? `${value}${t.months}+ ${t.delayedStatus}` : item.delta === 0 ? t.onTimeAchieved : `${value} ${t.months}`;
                return [label, ""];
              }}
              labelFormatter={(label) => String(label)}
            />
            <ReferenceLine x={0} stroke="#333" />
            <Bar dataKey="delta" radius={[0, 3, 3, 0]} cursor="pointer" onClick={(_data, index) => onSelectClaim(chartData[index as number].claim)}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.status, entry.delta)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-green-500 inline-block" /> {t.onTime}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-yellow-500 inline-block" /> {t.upTo6}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-orange-500 inline-block" /> {t.upTo18}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-tesla-red inline-block" /> {t.over18}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-blue-500 inline-block" /> {t.pending}</span>
      </div>
    </div>
  );
}
