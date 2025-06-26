#!/usr/bin/env bash
set -e
RESULT_FILE="result.md"
# Initialize result file with header if not exist
if [ ! -f "$RESULT_FILE" ]; then
  echo "| PDF 檔案名稱 | 對應 Markdown 檔 | 轉換狀態 | 錯誤訊息（如有） |" > "$RESULT_FILE"
  echo "| ----------- | --------------- | -------- | -------------- |" >> "$RESULT_FILE"
fi

for pdf in *.pdf; do
  [ -e "$pdf" ] || continue
  base="${pdf%.pdf}"
  txt="${base}.txt"
  md="${base}.md"
  status="✅"
  error="-"
  if ! pdftotext "$pdf" "$txt" 2>err.log; then
    status="❌"
    error=$(tr '\n' ' ' < err.log)
  else
    if ! pandoc --toc "$txt" -o "$md" 2>>err.log; then
      status="❌"
      error=$(tr '\n' ' ' < err.log)
    fi
    rm -f "$txt"
  fi
  rm -f err.log
  echo "| $pdf | $md | $status | $error |" >> "$RESULT_FILE"
  echo "$pdf -> $md : $status"
done

