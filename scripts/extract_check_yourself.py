#!/usr/bin/env python3
"""Extract every chapter's "Check yourself" questions into data/check-yourself.json.

The questions live in the chapters (that is where authors maintain them);
this file is a generated, machine-readable view — for a quiz page, flashcards,
or a coverage check. Regenerate after editing a chapter:

    python3 scripts/extract_check_yourself.py

Some chapters carry a collapsible "What a strong answer covers" block: an HTML
<ol> with one <li> per question (HTML rather than markdown because HonKit does
not render markdown lists inside <details>). Those are included as `answers`.
Chapters without one have `answers: null`.
"""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
NUMBERED = re.compile(r"^(\d+)\.\s+(.*)$")


def numbered(lines: list[str]) -> list[str]:
    """Numbered items, joining any wrapped continuation lines."""
    items: list[str] = []
    for line in lines:
        m = NUMBERED.match(line)
        if m:
            items.append(m.group(2).strip())
        elif line.strip() and items:
            items[-1] += " " + line.strip()
    return items


def extract(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"^## Check yourself\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    if not m:
        return None
    section = m.group(1)
    title = re.search(r"^# (.+)$", text, re.M)
    d = re.search(r"<details>.*?</summary>(.*?)</details>", section, re.S)
    question_part = section[:d.start()] if d else section
    questions = numbered(question_part.splitlines())
    answers = [html.unescape(a).strip() for a in re.findall(r"<li>(.*?)</li>", d.group(1), re.S)] if d else None
    if answers is not None and len(answers) != len(questions):
        sys.exit(f"{path}: {len(questions)} questions but {len(answers)} answers")
    return {"chapter": str(path.relative_to(ROOT)), "title": title.group(1).strip() if title else path.stem,
            "questions": questions, "answers": answers}


def main() -> None:
    chapters = [p for p in sorted(DOCS.rglob("*.md")) if "appendix" not in p.parts]
    rows = [r for p in chapters if (r := extract(p))]
    out = ROOT / "data" / "check-yourself.json"
    out.write_text(json.dumps(rows, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    q = sum(len(r["questions"]) for r in rows)
    a = sum(1 for r in rows if r["answers"])
    print(f"{len(rows)} chapters, {q} questions, {a} chapters with answers -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
