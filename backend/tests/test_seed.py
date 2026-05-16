from pathlib import Path

from app.seed.excel_parser import parse_excel


def test_excel_parser_finds_unique_codes():
    excel_path = (
        Path(__file__).resolve().parents[2]
        / "data"
        / "excel-control-album-panini-mundial-2026.xlsx"
    )
    parsed = parse_excel(excel_path)
    codes = {item.code for item in parsed}
    assert len(codes) == len(parsed)
    assert len(parsed) >= 980
    assert any(item.code == "ARG1" for item in parsed)
    assert any(item.team == "FWC" for item in parsed)
