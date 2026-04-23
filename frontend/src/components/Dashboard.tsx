"use client";

import { useState } from "react";
import type { Claim } from "@/data/mock_data";
import claimsJson from "@/data/claims_data.json";
import { useI18n } from "@/i18n/context";

const claimsData: Claim[] = claimsJson as Claim[];
import SummaryCards from "./SummaryCards";
import DeltaChart from "./DeltaChart";
import TimelineChart from "./TimelineChart";
import ImpactComparison from "./ImpactComparison";
import ClaimsTable from "./ClaimsTable";
import ClaimDetail from "./ClaimDetail";
import LangSwitch from "./LangSwitch";

type TabId = "timeline" | "impact" | "delta";

export default function Dashboard() {
  const { t } = useI18n();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("timeline");

  const tabs: { id: TabId; label: string }[] = [
    { id: "timeline", label: t.tabTimeline },
    { id: "impact", label: t.tabImpact },
    { id: "delta", label: t.tabDelta },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-tesla-red">ELON</span> TIME TRACKER
              </h1>
              <p className="text-sm text-muted mt-1">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <LangSwitch />
              <div className="text-right text-xs text-muted">
                <div>{t.dataRange}</div>
                <div className="mt-1">
                  {t.tracking(claimsData.length)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <SummaryCards claims={claimsData} />

        <div className="flex gap-1 bg-card-bg border border-card-border rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-tesla-red text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "timeline" && (
          <TimelineChart claims={claimsData} onSelectClaim={setSelectedClaim} />
        )}
        {activeTab === "impact" && (
          <ImpactComparison claims={claimsData} onSelectClaim={setSelectedClaim} />
        )}
        {activeTab === "delta" && (
          <DeltaChart claims={claimsData} onSelectClaim={setSelectedClaim} />
        )}

        <ClaimsTable claims={claimsData} onSelectClaim={setSelectedClaim} />
      </main>

      <footer className="border-t border-card-border mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-muted text-center">
          {t.footer}
        </div>
      </footer>

      {selectedClaim && (
        <ClaimDetail claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
      )}
    </div>
  );
}
