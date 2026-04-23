"""
Tesla Earnings Call Transcript Analyzer
- Reads transcript .txt files from transcripts/ folder
- Uses Gemini API to extract Elon Musk's timeline claims
- Outputs structured JSON to claims_data.json
"""

import json
import os
import sys
from pathlib import Path

from google import genai
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not set. Copy .env.example to .env and add your key.")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

TRANSCRIPTS_DIR = Path(__file__).parent / "transcripts"
OUTPUT_FILE = Path(__file__).parent / "claims_data.json"
FRONTEND_DATA_DIR = Path(__file__).parent.parent / "frontend" / "src" / "data"

EXTRACTION_PROMPT = """You are an expert analyst specializing in Tesla and Elon Musk's public statements.

Analyze the following Tesla earnings call transcript and extract ALL specific timeline claims or promises made by Elon Musk (or attributed to Tesla leadership).

For each claim, provide:
1. **date_announced**: The date of this earnings call in YYYY-MM format
2. **claim**: A concise description of the promise/goal (in Korean)
3. **target_date**: The promised completion date in YYYY-MM format (estimate if only a year/quarter is given, e.g., "Q3 2024" -> "2024-09")
4. **actual_date**: The actual completion date in YYYY-MM format, or null if not yet achieved or unknown
5. **delta_months**: The difference in months between target and actual (positive = delayed, 0 = on time, negative = early). Set to null if actual_date is null.
6. **status**: One of "achieved", "delayed", or "pending"
   - "achieved": completed (on time or late)
   - "delayed": past target date but not completed
   - "pending": target date is still in the future

Focus on concrete, verifiable claims such as:
- Product launches (FSD, Cybertruck, Roadster, Semi, etc.)
- Production volume targets
- Feature releases (Robotaxi, Optimus, etc.)
- Financial targets
- Factory/infrastructure milestones

Return ONLY a valid JSON array. No markdown, no explanation. Example format:
[
  {{
    "date_announced": "2023-01",
    "claim": "FSD 완전자율주행 v12 출시",
    "target_date": "2023-06",
    "actual_date": "2024-01",
    "delta_months": 7,
    "status": "achieved"
  }}
]

Today's date is 2026-04-24. Use this to determine if claims are "delayed" (past target date, not achieved) or "pending" (target date still in the future).

--- TRANSCRIPT START ---
{transcript}
--- TRANSCRIPT END ---
"""


def read_transcripts() -> list[tuple[str, str]]:
    """Read all .txt files from the transcripts directory."""
    transcripts = []
    if not TRANSCRIPTS_DIR.exists():
        print(f"Warning: {TRANSCRIPTS_DIR} does not exist. Creating it.")
        TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
        return transcripts

    for filepath in sorted(TRANSCRIPTS_DIR.glob("*.txt")):
        content = filepath.read_text(encoding="utf-8")
        transcripts.append((filepath.name, content))

    return transcripts


def analyze_transcript(filename: str, content: str) -> list[dict]:
    """Send transcript to Gemini and extract claims."""
    print(f"  Analyzing: {filename} ({len(content):,} chars)...")

    prompt = EXTRACTION_PROMPT.format(transcript=content)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "temperature": 0.1,
            "response_mime_type": "application/json",
        },
    )

    try:
        claims = json.loads(response.text)
        if not isinstance(claims, list):
            claims = [claims]
        print(f"  -> Extracted {len(claims)} claims")
        return claims
    except json.JSONDecodeError as e:
        print(f"  -> JSON parse error for {filename}: {e}")
        print(f"     Raw response: {response.text[:200]}...")
        return []


def save_results(all_claims: list[dict]) -> None:
    """Save combined claims to JSON and copy to frontend data dir."""
    all_claims.sort(key=lambda c: (c.get("date_announced", ""), c.get("target_date", "")))

    OUTPUT_FILE.write_text(json.dumps(all_claims, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved {len(all_claims)} claims to {OUTPUT_FILE}")

    if FRONTEND_DATA_DIR.exists():
        frontend_output = FRONTEND_DATA_DIR / "claims_data.json"
        frontend_output.write_text(json.dumps(all_claims, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Copied to {frontend_output}")


def print_summary(claims: list[dict]) -> None:
    """Print a summary using pandas."""
    if not claims:
        print("No claims to summarize.")
        return

    df = pd.DataFrame(claims)

    print("\n" + "=" * 60)
    print("ELON TIME DELTA - SUMMARY")
    print("=" * 60)

    achieved = df[df["status"] == "achieved"]
    if not achieved.empty and "delta_months" in achieved.columns:
        valid_deltas = achieved["delta_months"].dropna()
        if not valid_deltas.empty:
            print(f"Average delay (achieved): {valid_deltas.mean():.1f} months")
            print(f"Max delay: {valid_deltas.max():.0f} months")

    print(f"\nStatus breakdown:")
    print(df["status"].value_counts().to_string())
    print("=" * 60)


def main():
    print("=" * 60)
    print("ELON TIME TRACKER - Transcript Analyzer")
    print("=" * 60)

    transcripts = read_transcripts()
    if not transcripts:
        print("\nNo transcripts found in transcripts/ folder.")
        print("Add .txt files of Tesla earnings call transcripts and re-run.")
        sys.exit(0)

    print(f"\nFound {len(transcripts)} transcript(s). Starting analysis...\n")

    all_claims = []
    for filename, content in transcripts:
        claims = analyze_transcript(filename, content)
        all_claims.extend(claims)

    save_results(all_claims)
    print_summary(all_claims)


if __name__ == "__main__":
    main()
