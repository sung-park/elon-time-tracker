# Elon Time Tracker

Tesla 어닝콜 트랜스크립트에서 일론 머스크의 약속(Claim)을 추출하고, 목표 시점 vs 실제 달성 시점의 간극(**Elon Time Delta**)을 추적/시각화하는 풀스택 프로젝트.

## 구조

```
elon-time-tracker/
├── data-pipeline/          # Python 데이터 분석 파이프라인
│   ├── analyze_claims.py   # Gemini API 기반 트랜스크립트 분석
│   ├── transcripts/        # 어닝콜 텍스트 파일 (*.txt)
│   ├── claims_data.json    # 분석 결과 출력
│   └── .env.example
└── frontend/               # Next.js 대시보드
    └── src/
        ├── components/     # Dashboard, Chart, Table 컴포넌트
        └── data/           # mock 데이터 & 분석 결과 JSON
```

## 실행 방법

### 1. 데이터 분석 파이프라인 (Python)

```bash
cd data-pipeline

# 가상환경 활성화
source venv/bin/activate

# (최초 1회) 패키지 설치
pip install -r requirements.txt

# API 키 설정
cp .env.example .env
# .env 파일을 편집하여 GEMINI_API_KEY 입력

# transcripts/ 폴더에 어닝콜 텍스트 파일 추가 후 실행
python analyze_claims.py
```

`claims_data.json`이 생성되며, `frontend/src/data/` 폴더가 존재하면 자동 복사됩니다.

### 2. 웹 대시보드 (Next.js)

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 대시보드를 확인할 수 있습니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 데이터 분석 | Python, Gemini 1.5 Pro API, Pandas |
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| 시각화 | Recharts, Custom SVG Timeline |
| 아이콘 | Lucide React |

## 대시보드 기능

- **요약 카드**: 평균 지연, 정시 달성률, 최장 지연, 달성/지연/진행 비율
- **카테고리별 타임라인**: FSD, Robotaxi, Cybertruck 등 11개 카테고리로 그룹핑, 필터링 가능
- **지연 분석 바 차트**: Delta순/발표순/목표순 정렬, 지연만 필터링, 5단계 색상 스케일
- **Claim 테이블**: 전체 목록, 클릭 시 상세 모달로 delta 확인

## 데이터 스키마

```json
{
  "date_announced": "YYYY-MM",
  "claim": "약속 내용",
  "target_date": "YYYY-MM",
  "actual_date": "YYYY-MM | null",
  "delta_months": "number | null",
  "status": "achieved | delayed | pending"
}
```
