# PDF to Markdown 轉換器

這是一個將 PDF 檔案轉換為 Markdown 格式的 Node.js 工具。

## 功能特色

- 🔄 批次轉換 PDF 檔案為 Markdown 格式
- 📁 自動建立 `lawsmd` 輸出目錄
- 📊 產生詳細的轉換結果報告
- 🧹 自動清理暫存檔案
- 🧪 包含完整的測試功能

## 系統需求

### 必要軟體

- Node.js 12.0.0 或更新版本
- pdftotext（來自 poppler-utils）
- pandoc

### 安裝相依軟體

#### Windows

```bash
# 安裝 Poppler (包含 pdftotext)
# 下載 https://blog.alivate.com.au/poppler-windows/ 並加入 PATH

# 安裝 Pandoc
# 下載 https://pandoc.org/installing.html
```

#### macOS

```bash
# 使用 Homebrew
brew install poppler pandoc
```

#### Ubuntu/Debian

```bash
sudo apt-get install poppler-utils pandoc
```

## 安裝與使用

### 1. 安裝套件相依性

```bash
npm install
```

### 2. 執行測試

```bash
npm test
```

### 3. 開始轉換

```bash
npm start
```

或直接執行：

```bash
node convert_pdfs.js
```

## 檔案結構

```text
.
├── convert_pdfs.js    # 主要轉換程式
├── test.js           # 測試程式
├── package.json      # 專案設定
├── README.md         # 說明文件
├── result.md         # 轉換結果報告（執行後產生）
├── lawsmd/           # Markdown 輸出目錄（執行後產生）
└── *.pdf             # 要轉換的 PDF 檔案
```

## 轉換流程

1. 掃描當前目錄中的所有 PDF 檔案
2. 使用 `pdftotext` 將 PDF 轉換為純文字
3. 使用 `pandoc` 將文字轉換為 Markdown 格式
4. 將 Markdown 檔案儲存到 `lawsmd` 目錄
5. 產生 `result.md` 轉換結果報告

## 輸出說明

- **Markdown 檔案**: 儲存在 `lawsmd/` 目錄中
- **結果報告**: 儲存為 `result.md`，包含：
  - 原始 PDF 檔案名稱
  - 輸出 Markdown 檔案名稱
  - 轉換狀態（✅ 成功 / ❌ 失敗）
  - 錯誤訊息（如有）

## 疑難排解

### 常見問題

1. **pdftotext 找不到**

   - 確認已安裝 poppler-utils
   - 確認 pdftotext 在系統 PATH 中

2. **pandoc 找不到**

   - 從官網下載並安裝 pandoc
   - 確認 pandoc 在系統 PATH 中

3. **權限錯誤**
   - 確認對當前目錄有讀寫權限
   - 確認 PDF 檔案沒有被其他程式開啟

### 測試相依性

執行測試程式會檢查所有必要的相依軟體：

```bash
npm test
```

## 開發容器環境

本專案支援 Visual Studio Code 的開發容器功能，提供一致的開發環境。

### 使用 Dev Container

1. **前置需求**

   - 安裝 [Visual Studio Code](https://code.visualstudio.com/)
   - 安裝 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - 安裝 VS Code 擴充套件: [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **啟動開發容器**

   ```bash
   # 在 VS Code 中開啟專案資料夾
   # 按 F1 或 Ctrl+Shift+P 開啟命令面板
   # 輸入並選擇: "Dev Containers: Reopen in Container"
   ```

3. **或使用 Docker Compose**

   ```bash
   # 建立並啟動容器
   docker-compose up -d

   # 進入容器
   docker-compose exec pdf-converter bash

   # 停止容器
   docker-compose down
   ```

### 開發容器特色

- ✅ 預裝 Node.js 18
- ✅ 預裝 pdftotext (poppler-utils)
- ✅ 預裝 pandoc
- ✅ 自動安裝專案依賴
- ✅ 設定好的 VS Code 擴充套件
- ✅ 統一的開發環境

### 容器內的使用方式

開發容器啟動後，所有指令都可以直接使用：

```bash
# 查看已安裝工具版本
node --version
pdftotext -v
pandoc --version

# 執行 PDF 轉換
npm start

# 執行測試
npm test
```

## 授權條款

MIT License
