"use client";

import { useMemo, useState } from "react";
import type { Claim } from "@/data/mock_data";
import { useI18n } from "@/i18n/context";
import type { Translations } from "@/i18n/ko";

interface TimelineChartProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

type CatKey = "fsd" | "robotaxi" | "cybertruck" | "optimus" | "semi" | "nextgen" | "battery" | "factory" | "ai" | "energy" | "other";

const CAT_KEYWORDS: Record<CatKey, string[]> = {
  fsd: ["FSD", "자율주행", "self-driving", "오토파일럿", "autopilot"],
  robotaxi: ["로보택시", "robotaxi", "cybercab", "ride-hailing", "라이드"],
  cybertruck: ["사이버트럭", "cybertruck", "cybertr"],
  optimus: ["옵티머스", "optimus", "로봇", "robot"],
  semi: ["세미", "semi"],
  nextgen: ["차세대", "보급형", "저가", "affordable", "roadster", "로드스터", "model"],
  battery: ["배터리", "4680", "셀", "cell", "리튬", "cathode"],
  factory: ["기가", "giga", "공장", "factory", "생산", "production", "berlin", "austin", "베를린", "오스틴"],
  ai: ["dojo", "도조", "AI", "GPU", "칩", "chip", "AI5"],
  energy: ["에너지", "energy", "solar", "태양광", "megapack", "메가팩", "powerwall"],
  other: [],
};

const CAT_COLORS: Record<CatKey, string> = {
  fsd: "#8b5cf6", robotaxi: "#ec4899", cybertruck: "#f97316", optimus: "#06b6d4",
  semi: "#84cc16", nextgen: "#eab308", battery: "#14b8a6", factory: "#6366f1",
  ai: "#f43f5e", energy: "#22c55e", other: "#64748b",
};

const CAT_LABEL_KEYS: Record<CatKey, keyof Translations> = {
  fsd: "catFSD", robotaxi: "catRobotaxi", cybertruck: "catCybertruck", optimus: "catOptimus",
  semi: "catSemi", nextgen: "catNextGen", battery: "catBattery", factory: "catFactory",
  ai: "catAI", energy: "catEnergy", other: "catOther",
};

function categorize(claim: string): CatKey {
  const lower = claim.toLowerCase();
  for (const [cat, keywords] of Object.entries(CAT_KEYWORDS) as [CatKey, string[]][]) {
    if (cat === "other") continue;
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) return cat;
  }
  return "other";
}

function dateToNum(d: string): number {
  const [y, m] = d.split("-").map(Number);
  return y + (m - 1) / 12;
}

export default function TimelineChart({ claims, onSelectClaim }: TimelineChartProps) {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<CatKey | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<CatKey, Claim[]>();
    for (const c of claims) {
      const cat = categorize(c.claim);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(c);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [claims]);

  const filteredGroups = selectedCategory
    ? grouped.filter(([cat]) => cat === selectedCategory)
    : grouped;

  const allDates = claims.flatMap((c) => [
    dateToNum(c.target_date),
    ...(c.actual_date ? [dateToNum(c.actual_date)] : []),
    dateToNum(c.date_announced),
  ]);
  const minDate = Math.floor(Math.min(...allDates));
  const maxDate = Math.ceil(Math.max(...allDates)) + 1;
  const range = maxDate - minDate;
  const toPercent = (d: string) => ((dateToNum(d) - minDate) / range) * 100;

  const years: number[] = [];
  for (let y = minDate; y <= maxDate; y++) years.push(y);

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-sm text-muted uppercase tracking-wider">{t.timelineTitle}</h2>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${!selectedCategory ? "bg-white/10 border-white/20 text-foreground" : "border-card-border text-muted hover:text-foreground"}`}
        >
          {t.all} ({claims.length})
        </button>
        {grouped.map(([cat, items]) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${selectedCategory === cat ? "border-white/20 text-foreground" : "border-card-border text-muted hover:text-foreground"}`}
            style={selectedCategory === cat ? { backgroundColor: CAT_COLORS[cat] + "22", borderColor: CAT_COLORS[cat] + "55" } : {}}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: CAT_COLORS[cat] }} />
            {t[CAT_LABEL_KEYS[cat]] as string} ({items.length})
          </button>
        ))}
      </div>

      {/* Year axis */}
      <div className="relative ml-[140px] mr-2 h-5 mb-1">
        {years.map((y) => (
          <div key={y} className="absolute text-[10px] text-muted/60 -translate-x-1/2 font-mono" style={{ left: `${((y - minDate) / range) * 100}%` }}>{y}</div>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {filteredGroups.map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-1.5 ml-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CAT_COLORS[category] }} />
              <span className="text-xs font-medium" style={{ color: CAT_COLORS[category] }}>
                {t[CAT_LABEL_KEYS[category]] as string}
              </span>
              <span className="text-[10px] text-muted">({items.length})</span>
            </div>

            <div className="space-y-px">
              {items
                .sort((a, b) => a.target_date.localeCompare(b.target_date))
                .map((claim, i) => {
                  const targetPct = toPercent(claim.target_date);
                  const actualPct = claim.actual_date ? toPercent(claim.actual_date) : null;
                  const announcedPct = toPercent(claim.date_announced);
                  const color = CAT_COLORS[category];
                  const isDelayed = claim.status === "delayed";
                  const isPending = claim.status === "pending";

                  return (
                    <div key={i} className="flex items-center group cursor-pointer hover:bg-white/[0.03] rounded py-1.5 px-1 -mx-1 transition-colors" onClick={() => onSelectClaim(claim)}>
                      <div className="w-[136px] shrink-0 text-[11px] text-gray-400 truncate pr-2 group-hover:text-foreground transition-colors">{claim.claim}</div>
                      <div className="flex-1 relative h-5 mr-2">
                        {years.map((y) => (<div key={y} className="absolute top-0 bottom-0 border-l border-white/[0.04]" style={{ left: `${((y - minDate) / range) * 100}%` }} />))}
                        <div className="absolute top-1/2 -translate-y-1/2 h-[1px]" style={{ left: `${announcedPct}%`, width: `${targetPct - announcedPct}%`, backgroundColor: color, opacity: 0.2 }} />
                        {actualPct !== null && (
                          <div className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full" style={{ left: `${Math.min(targetPct, actualPct)}%`, width: `${Math.abs(actualPct - targetPct)}%`, backgroundColor: claim.delta_months === 0 ? "#22c55e" : claim.delta_months! <= 6 ? "#eab308" : "#e31937", opacity: 0.6 }} />
                        )}
                        {isDelayed && (
                          <div className="absolute top-1/2 -translate-y-1/2 h-[2px]" style={{ left: `${targetPct}%`, width: `${toPercent("2026-04") - targetPct}%`, background: "linear-gradient(to right, #e31937, transparent)", opacity: 0.4 }} />
                        )}
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-[1.5px] bg-card-bg z-10" style={{ left: `${targetPct}%`, borderColor: color }} />
                        {actualPct !== null && (
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full z-10" style={{ left: `${actualPct}%`, backgroundColor: claim.delta_months === 0 ? "#22c55e" : claim.delta_months! <= 6 ? "#eab308" : "#e31937" }} />
                        )}
                        {isPending && (
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-10 animate-pulse" style={{ left: `${targetPct}%`, backgroundColor: "#3b82f6", boxShadow: "0 0 6px #3b82f680" }} />
                        )}
                        {claim.delta_months !== null && claim.delta_months > 0 && (
                          <div className="absolute top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20" style={{ left: `${actualPct ?? targetPct}%`, marginLeft: "8px", color: claim.delta_months <= 6 ? "#eab308" : "#e31937" }}>
                            +{claim.delta_months}mo
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-5 ml-[140px] text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-[1.5px] border-gray-400 inline-block" /> {t.target}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> {t.onTimeAchieved}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" /> {t.slightDelay}</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-tesla-red inline-block" /> {t.majorDelay}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {t.pending}</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-[2px] rounded-full inline-block" style={{ background: "linear-gradient(to right, #e31937, transparent)" }} /> {t.notAchieved}</span>
      </div>
    </div>
  );
}
