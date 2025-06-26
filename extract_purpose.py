import re
from pathlib import Path

source_dir = Path('lawsmd')
target_dir = Path('target')
target_dir.mkdir(exist_ok=True)

pattern = re.compile(r'^#{2,}\s*(?:第?一條|[一壹ㄧ]、)\s*(.*)')

for md_file in source_dir.glob('*.md'):
    if md_file.name == 'lawsmd.zip':
        continue
    lines = md_file.read_text(encoding='utf-8').splitlines()
    law_name = md_file.stem
    purpose_lines = []
    capture = False
    for line in lines:
        if not capture:
            m = pattern.match(line)
            if m:
                text = m.group(1).strip()
                if text:
                    purpose_lines.append(text)
                capture = True
                continue
        else:
            if line.startswith('#'):
                break
            if line.strip() == '':
                continue
            purpose_lines.append(line.strip())
    if not purpose_lines:
        for line in lines:
            if '目的' in line:
                purpose_lines = [line.strip()]
                break
    if purpose_lines:
        output_text = f'# {law_name} 目的\n\n' + '\n'.join(purpose_lines) + '\n'
        (target_dir / md_file.name).write_text(output_text, encoding='utf-8')
