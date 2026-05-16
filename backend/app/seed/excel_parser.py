import re
from dataclasses import dataclass
from pathlib import Path

import openpyxl

STICKER_CODE_REGEX = re.compile(r"^[A-Z]{2,5}\d+$", re.IGNORECASE)


@dataclass(frozen=True)
class ParsedSticker:
    code: str
    team: str
    number: int


def _number_from_code(code: str) -> int:
    match = re.search(r"(\d+)$", code)
    return int(match.group(1)) if match else 0


def parse_excel(path: str | Path) -> list[ParsedSticker]:
    workbook = openpyxl.load_workbook(path, read_only=True, data_only=True)
    sheet = workbook.active
    results: list[ParsedSticker] = []
    seen_codes: set[str] = set()
    team_max_number: dict[str, int] = {}

    for row in sheet.iter_rows(values_only=True):
        if len(row) < 2:
            continue
        team_cell = row[1]
        if not team_cell or not isinstance(team_cell, str) or not team_cell.strip():
            continue

        team_name = team_cell.strip()
        codes: list[str] = []
        for cell in row[2:]:
            if isinstance(cell, str):
                normalized = cell.strip().upper()
                if STICKER_CODE_REGEX.match(normalized):
                    codes.append(normalized)

        if not codes:
            continue

        start_number = team_max_number.get(team_name, 0) + 1
        for offset, code in enumerate(codes):
            if code in seen_codes:
                continue
            seen_codes.add(code)
            number = _number_from_code(code)
            if number < start_number + offset:
                number = start_number + offset
            results.append(ParsedSticker(code=code, team=team_name, number=number))
            team_max_number[team_name] = max(team_max_number.get(team_name, 0), number)

    workbook.close()
    return results
