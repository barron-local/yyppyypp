import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('public/pdf_pages/pages.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scripts/extracted_overview.txt', 'w', encoding='utf-8') as out:
    for p in data:
        lines = [l.strip() for l in p['text'].splitlines() if l.strip()]
        content_lines = [l for l in lines if not any(kw in l for kw in ['เกณฑ์ กติกา', 'ประเภทวิชา', 'กลุ่มอาชีพซอฟต์แวร์', 'สาขาวิชาเทคโนโลยี', 'และสาขาวิชาเครือข่าย', 'ระดับภาค', 'ประจำปีการศึกษา'])]
        out.write(f"\n=================== PAGE {p['page']} ===================\n")
        out.write('\n'.join(content_lines[:15]))
        out.write('\n')

print("Wrote scripts/extracted_overview.txt")
