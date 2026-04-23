import type { Translations } from "./ko";

const en: Translations = {
  // Header
  title: "ELON TIME TRACKER",
  subtitle: "Tesla Earnings: Promises vs. Reality",
  dataRange: "Data Range: 2020 Q1 - 2025 Q4 Earnings Calls",
  tracking: (n: number) => `Tracking ${n} claims`,

  // Tabs
  tabTimeline: "Timeline",
  tabImpact: "Investment vs. Commercialization",
  tabDelta: "Delay Analysis",

  // Summary cards
  avgDelay: "Avg. Delay",
  months: "months",
  delayedCount: (n: number, achv: number) => `${n} delayed (avg ${achv.toFixed(1)}mo after achieved)`,
  onTimeRate: "On-Time Rate",
  onTimeSub: (onTime: number, total: number, pending: number) =>
    `${onTime}/${total} on time (excl. ${pending} pending)`,
  maxDelay: "Max Delay",
  inProgress: "(in progress)",
  achievedDelayedPending: "Achieved / Delayed / Pending",
  totalN: (n: number) => `Total ${n}`,

  // Delta chart
  deltaTitle: "Elon Time Delta (Delay in Months)",
  showDelayedOnly: "Delayed only",
  sortDelta: "By Delta",
  sortDate: "By Date",
  sortTarget: "By Target",
  onTime: "On Time",
  upTo6: "≤6 Months",
  upTo18: "≤18 Months",
  over18: "18+ Months",
  pending: "Pending",
  delayedStatus: "Delayed",
  achieved: "Achieved",
  onTimeAchieved: "On Time",

  // Timeline chart
  timelineTitle: "Timeline by Category",
  all: "All",
  target: "Target",
  slightDelay: "Slight Delay",
  majorDelay: "Major Delay",
  notAchieved: "Not Achieved",

  // Impact comparison
  investTitle: "Investment / Infrastructure",
  investDesc: "Factory, Equipment, R&D, CapEx",
  commTitle: "Commercialization / Business",
  commDesc: "Product Launch, Service Rollout, Mass Production",
  total: "Total",
  avgDelayMonth: "Avg. Delay (mo)",
  comparisonTitle: "Investment vs. Commercialization",
  coreInsight: "Key Insight:",
  insightCommLonger: (commAvg: string, investAvg: string, diff: string) =>
    `Commercialization promises average ${commAvg}mo delay vs ${investAvg}mo for investment — ${diff}mo longer. It's harder to make money than to spend it.`,
  insightInvestLonger: (investAvg: string, commAvg: string, diff: string) =>
    `Investment promises average ${investAvg}mo delay vs ${commAvg}mo for commercialization — ${diff}mo longer.`,
  onTimeRateCompare: (invest: number, comm: number) =>
    ` On-time rate: Investment ${invest}% vs Commercialization ${comm}%.`,
  detailInvest: "Investment/Infrastructure Details",
  detailComm: "Commercialization/Business Details",
  nItemsDeltaSort: (n: number) => `(${n} items, by delta)`,
  compBarAvgDelay: "Avg. Delay (mo)",
  compBarMaxDelay: "Max Delay (mo)",
  compBarOnTime: "On-Time Rate (%)",
  compBarAchieved: "Achieved",
  compBarDelayed: "Delayed",

  // Claims table
  tableTitle: "All Claims",
  colAnnounced: "Announced",
  colClaim: "Claim",
  colTarget: "Target",
  colActual: "Actual",
  colDelta: "Delta",
  colStatus: "Status",
  statusAchieved: "Achieved",
  statusDelayed: "Delayed",
  statusPending: "Pending",

  // Detail modal
  detailAchieved: "Achieved",
  detailDelayed: "Delayed",
  detailPending: "Pending",
  announced: "Announced",
  targetDate: "Target Date",
  actualDate: "Actual Date",
  notAchievedYet: "Not achieved",
  elonTimeDelta: "Elon Time Delta",
  onTimeResult: "On Time",
  elapsed: "Elapsed Time",
  elapsedDesc: (target: string) => `Delayed since target date (${target}) to present`,

  // Footer
  footer: "Elon Time Tracker — Analysis based on Tesla Earnings Call Transcripts. Data extracted from public earnings calls.",

  // Categories
  catFSD: "FSD / Autonomy",
  catRobotaxi: "Robotaxi / Cybercab",
  catCybertruck: "Cybertruck",
  catOptimus: "Optimus Robot",
  catSemi: "Semi Truck",
  catNextGen: "Next-Gen Vehicle",
  catBattery: "Battery / 4680",
  catFactory: "Factory / Production",
  catAI: "AI / Dojo",
  catEnergy: "Energy",
  catOther: "Other",
};

export default en;
