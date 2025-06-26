#!/usr/bin/env python3
import os
import subprocess


def convert_pdf(pdf_path: str):
    base, _ = os.path.splitext(pdf_path)
    text_path = base + '.txt'
    md_path = base + '.md'
    result = {'pdf': pdf_path, 'md': md_path, 'status': '✅', 'error': ''}

    try:
        subprocess.run(['pdftotext', pdf_path, text_path], check=True, capture_output=True, text=True)
        subprocess.run(['pandoc', text_path, '-f', 'markdown', '-t', 'markdown', '--toc', '-o', md_path], check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        result['status'] = '❌'
        error_output = e.stderr or e.stdout or str(e)
        result['error'] = error_output.strip().replace('\n', ' ')
    finally:
        if os.path.exists(text_path):
            try:
                os.remove(text_path)
            except OSError:
                pass
    return result


def main():
    pdf_files = [f for f in os.listdir('.') if f.lower().endswith('.pdf')]
    pdf_files.sort()

    results = []
    for pdf in pdf_files:
        results.append(convert_pdf(pdf))

    with open('result.md', 'w', encoding='utf-8') as f:
        f.write('| PDF 檔案 | Markdown 檔案 | 狀態 | 訊息 |\n')
        f.write('| --- | --- | --- | --- |\n')
        for r in results:
            msg = r['error'].replace('|', '\\|')
            f.write(f"| {r['pdf']} | {r['md']} | {r['status']} | {msg} |\n")


if __name__ == '__main__':
    main()
