const ko = {
  // Header
  title: "혀닝콜 탐지기",
  subtitle: "혀닝콜 탐지기 — Tesla 어닝콜 약속 vs 현실",
  dataRange: "데이터 기준: 2020 Q1 - 2025 Q4 어닝콜",
  tracking: (n: number) => `총 ${n}건 추적 중`,

  // Tabs
  tabTimeline: "타임라인",
  tabImpact: "투자 vs 상용화",
  tabDelta: "지연 분석",

  // Summary cards
  avgDelay: "평균 지연",
  months: "개월",
  delayedCount: (n: number, achv: number) => `지연 ${n}건 (달성 후 평균 ${achv.toFixed(1)}개월)`,
  onTimeRate: "정시 달성률",
  onTimeSub: (onTime: number, total: number, pending: number) =>
    `${onTime}/${total}건 정시 (진행 중 ${pending}건 제외)`,
  maxDelay: "최장 지연",
  inProgress: "(진행 중)",
  achievedDelayedPending: "달성 / 지연 / 진행",
  totalN: (n: number) => `총 ${n}건`,

  // Delta chart
  deltaTitle: "Elon Time Delta (지연 개월 수)",
  showDelayedOnly: "지연만 보기",
  sortDelta: "Delta순",
  sortDate: "발표순",
  sortTarget: "목표순",
  onTime: "정시",
  upTo6: "~6개월",
  upTo18: "~18개월",
  over18: "18개월+",
  pending: "진행 중",
  delayedStatus: "지연 중",
  achieved: "달성",
  onTimeAchieved: "정시 달성",

  // Timeline chart
  timelineTitle: "카테고리별 타임라인",
  all: "전체",
  target: "목표",
  slightDelay: "소폭 지연",
  majorDelay: "대폭 지연",
  notAchieved: "미달성",

  // Impact comparison
  investTitle: "투자 / 인프라",
  investDesc: "공장 건설, 설비 투자, R&D, CapEx",
  commTitle: "상용화 / 비즈니스",
  commDesc: "제품 출시, 서비스 런칭, 양산, 판매",
  total: "전체",
  avgDelayMonth: "평균 지연(월)",
  comparisonTitle: "투자 vs 상용화 비교",
  coreInsight: "핵심 인사이트:",
  insightCommLonger: (commAvg: string, investAvg: string, diff: string) =>
    `상용화 약속의 평균 지연(${commAvg}개월)이 투자/인프라(${investAvg}개월)보다 ${diff}개월 더 길다. 돈을 쓰는 것보다 돈을 버는 것이 더 어렵다는 것을 보여준다.`,
  insightInvestLonger: (investAvg: string, commAvg: string, diff: string) =>
    `투자/인프라 약속의 평균 지연(${investAvg}개월)이 상용화(${commAvg}개월)보다 ${diff}개월 더 길다.`,
  onTimeRateCompare: (invest: number, comm: number) =>
    ` 정시 달성률은 투자 ${invest}% vs 상용화 ${comm}%.`,
  detailInvest: "투자/인프라 상세",
  detailComm: "상용화/비즈니스 상세",
  nItemsDeltaSort: (n: number) => `(${n}건, Delta순)`,
  compBarAvgDelay: "평균 지연(월)",
  compBarMaxDelay: "최대 지연(월)",
  compBarOnTime: "정시 달성률(%)",
  compBarAchieved: "달성 건수",
  compBarDelayed: "지연 건수",

  // Claims table
  tableTitle: "전체 Claim 목록",
  colAnnounced: "발표",
  colClaim: "Claim",
  colTarget: "목표",
  colActual: "실제",
  colDelta: "Delta",
  colStatus: "상태",
  statusAchieved: "달성",
  statusDelayed: "지연",
  statusPending: "진행 중",

  // Detail modal
  detailAchieved: "달성",
  detailDelayed: "지연 중",
  detailPending: "진행 중",
  announced: "발표 시점",
  targetDate: "목표 시점",
  actualDate: "실제 달성",
  notAchievedYet: "미달성",
  elonTimeDelta: "Elon Time Delta",
  onTimeResult: "정시 달성",
  elapsed: "경과 시간",
  elapsedDesc: (target: string) => `목표 시점(${target})으로부터 현재까지 지연 중`,

  // Footer
  footer: "혀닝콜 탐지기 — Tesla 어닝콜 트랜스크립트 기반 분석. 데이터는 공개된 어닝콜 자료에서 추출되었습니다.",

  // Categories
  catFSD: "FSD / 자율주행",
  catRobotaxi: "Robotaxi / Cybercab",
  catCybertruck: "Cybertruck",
  catOptimus: "Optimus 로봇",
  catSemi: "Semi 트럭",
  catNextGen: "차세대 차량",
  catBattery: "배터리 / 4680",
  catFactory: "공장 / 생산",
  catAI: "AI / Dojo",
  catEnergy: "에너지",
  catOther: "기타",
};

export type Translations = {
  [K in keyof typeof ko]: (typeof ko)[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : string;
};
export default ko;
