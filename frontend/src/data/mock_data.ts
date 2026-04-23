export interface Claim {
  date_announced: string;
  claim: string;
  target_date: string;
  actual_date: string | null;
  delta_months: number | null;
  status: "achieved" | "delayed" | "pending";
}

export type ImpactType = "commercialization" | "investment";

// 투자/인프라 키워드: 돈을 쓰는 행위
const INVESTMENT_KEYWORDS = [
  "공장", "기가", "giga", "건설", "설치", "GPU", "인프라", "배터리", "셀",
  "4680", "생산라인", "생산 시설", "자본", "capex", "투자", "refinery",
  "정제", "cathode", "dojo", "fab", "팹", "칩", "chip", "AI5",
  "리튬", "lithium", "capacity", "용량", "확장", "expansion",
  "gigawatt", "기가와트", "megapack", "메가팩", "프로토타입",
  "시설", "설비", "라인", "nevada", "네바다", "berlin", "베를린",
  "austin", "오스틴", "shanghai", "상하이",
];

// 상용화/비즈니스 임팩트 키워드: 돈을 버는 행위
const COMMERCIALIZATION_KEYWORDS = [
  "출시", "launch", "판매", "sale", "서비스", "service", "인도", "deliver",
  "양산", "volume production", "상용", "commercial", "고객", "customer",
  "구독", "subscription", "라이선싱", "licensing", "ride-hailing",
  "robotaxi", "로보택시", "운영", "operation", "무인", "unsupervised",
  "cybercab", "사이버캡", "보급", "affordable", "저가",
  "roadster", "로드스터", "semi", "세미", "cybertruck", "사이버트럭",
  "FSD", "자율주행", "완전", "full self", "모델", "model",
  "생산 시작", "생산 개시", "대 생산", "만 대", "천 대",
];

export function classifyImpact(claim: string): ImpactType {
  const lower = claim.toLowerCase();

  let investScore = 0;
  let commScore = 0;

  for (const kw of INVESTMENT_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) investScore++;
  }
  for (const kw of COMMERCIALIZATION_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) commScore++;
  }

  // Tie-breaker: if it mentions production volume targets, delivery, launch -> commercialization
  // If it mentions building, installing, CapEx -> investment
  return commScore >= investScore ? "commercialization" : "investment";
}

export const claimsData: Claim[] = [
  {
    date_announced: "2017-04",
    claim: "Model 3 주당 5,000대 생산 목표",
    target_date: "2017-12",
    actual_date: "2018-07",
    delta_months: 7,
    status: "achieved",
  },
  {
    date_announced: "2017-07",
    claim: "Tesla Semi 트럭 2019년 양산 시작",
    target_date: "2019-01",
    actual_date: "2022-12",
    delta_months: 47,
    status: "achieved",
  },
  {
    date_announced: "2017-11",
    claim: "신형 Tesla Roadster 2020년 출시",
    target_date: "2020-01",
    actual_date: null,
    delta_months: null,
    status: "delayed",
  },
  {
    date_announced: "2019-04",
    claim: "완전자율주행(FSD) Robotaxi 100만대 운영",
    target_date: "2020-06",
    actual_date: null,
    delta_months: null,
    status: "delayed",
  },
  {
    date_announced: "2019-10",
    claim: "Cybertruck 2021년 말 생산 시작",
    target_date: "2021-12",
    actual_date: "2023-11",
    delta_months: 23,
    status: "achieved",
  },
  {
    date_announced: "2020-09",
    claim: "$25,000 보급형 Tesla 차량 3년 내 출시",
    target_date: "2023-09",
    actual_date: null,
    delta_months: null,
    status: "delayed",
  },
  {
    date_announced: "2021-01",
    claim: "FSD 베타 미국 전역 확대",
    target_date: "2021-06",
    actual_date: "2022-11",
    delta_months: 17,
    status: "achieved",
  },
  {
    date_announced: "2021-08",
    claim: "Tesla Bot (Optimus) 프로토타입 공개",
    target_date: "2022-09",
    actual_date: "2022-10",
    delta_months: 1,
    status: "achieved",
  },
  {
    date_announced: "2022-01",
    claim: "Cybertruck 2022년 중반 양산 시작",
    target_date: "2022-07",
    actual_date: "2023-11",
    delta_months: 16,
    status: "achieved",
  },
  {
    date_announced: "2022-04",
    claim: "Optimus 로봇 3~5년 내 대량 생산",
    target_date: "2027-04",
    actual_date: null,
    delta_months: null,
    status: "pending",
  },
  {
    date_announced: "2022-10",
    claim: "FSD 하드웨어 4.0 2023년 탑재 시작",
    target_date: "2023-06",
    actual_date: "2023-12",
    delta_months: 6,
    status: "achieved",
  },
  {
    date_announced: "2023-01",
    claim: "Cybertruck 연간 25만대 생산 도달",
    target_date: "2024-12",
    actual_date: null,
    delta_months: null,
    status: "delayed",
  },
  {
    date_announced: "2023-04",
    claim: "완전 무감독 FSD (Level 4) 승인",
    target_date: "2024-06",
    actual_date: null,
    delta_months: null,
    status: "delayed",
  },
  {
    date_announced: "2023-07",
    claim: "Optimus 로봇 Tesla 공장 내 실사용",
    target_date: "2024-01",
    actual_date: "2024-06",
    delta_months: 5,
    status: "achieved",
  },
  {
    date_announced: "2024-01",
    claim: "차세대 저가형 모델 2025년 상반기 생산",
    target_date: "2025-06",
    actual_date: null,
    delta_months: null,
    status: "pending",
  },
  {
    date_announced: "2024-04",
    claim: "Robotaxi 전용 차량 2024년 10월 공개",
    target_date: "2024-10",
    actual_date: "2024-10",
    delta_months: 0,
    status: "achieved",
  },
  {
    date_announced: "2024-04",
    claim: "Robotaxi 상용 서비스 2025년 시작",
    target_date: "2025-06",
    actual_date: null,
    delta_months: null,
    status: "pending",
  },
  {
    date_announced: "2024-10",
    claim: "완전 무감독 FSD 텍사스/캘리포니아 2025년 런칭",
    target_date: "2025-06",
    actual_date: "2025-06",
    delta_months: 0,
    status: "achieved",
  },
  {
    date_announced: "2024-10",
    claim: "Optimus 로봇 외부 판매 2026년 시작",
    target_date: "2026-01",
    actual_date: null,
    delta_months: null,
    status: "pending",
  },
];
