"use client";

import { useI18n } from "@/i18n/context";

export default function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex gap-0.5 bg-card-bg border border-card-border rounded-md p-0.5">
      <button
        onClick={() => setLang("ko")}
        className={`px-2 py-0.5 rounded text-xs transition-colors ${
          lang === "ko" ? "bg-card-border text-foreground" : "text-muted hover:text-foreground"
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-0.5 rounded text-xs transition-colors ${
          lang === "en" ? "bg-card-border text-foreground" : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
