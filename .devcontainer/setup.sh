#!/bin/bash

echo "🔧 正在設定 PDF to Markdown 轉換器開發環境..."

# 更新套件清單
sudo apt-get update

# 安裝必要的系統套件
echo "📦 安裝 poppler-utils 和 pandoc..."
sudo apt-get install -y \
    poppler-utils \
    pandoc \
    curl \
    wget \
    git \
    vim \
    htop

# 驗證安裝
echo "✅ 驗證安裝的工具版本:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "pdftotext: $(pdftotext -v 2>&1 | head -1)"
echo "pandoc: $(pandoc --version | head -1)"

# 安裝 Node.js 依賴套件（如果有的話）
if [ -f "package.json" ]; then
    echo "📦 安裝 Node.js 依賴套件..."
    npm install
fi

# 建立輸出目錄
echo "📁 建立輸出目錄..."
mkdir -p lawsmd

# 設定 git 配置（如果需要）
echo "⚙️  設定 Git 配置..."
git config --global core.autocrlf input
git config --global init.defaultBranch main

# 檢查專案檔案
echo "📋 專案檔案結構:"
ls -la

echo "🎉 開發環境設定完成！"
echo ""
echo "💡 使用說明:"
echo "   - 執行轉換: npm start"
echo "   - 執行測試: npm test"
echo "   - 直接執行: node convert_pdfs.js"
echo ""
echo "📚 可用的工具:"
echo "   - pdftotext: PDF 轉文字工具"
echo "   - pandoc: 文件格式轉換工具"
echo "   - Node.js: JavaScript 執行環境"
