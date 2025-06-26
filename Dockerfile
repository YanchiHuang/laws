# PDF to Markdown 轉換器 - 開發容器

# 基礎映像檔使用 Node.js 18
FROM mcr.microsoft.com/devcontainers/javascript-node:18

# 設定工作目錄
WORKDIR /workspace

# 更新套件清單並安裝必要工具
RUN apt-get update && apt-get install -y \
    poppler-utils \
    pandoc \
    curl \
    wget \
    git \
    vim \
    htop \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 建立輸出目錄
RUN mkdir -p /workspace/lawsmd

# 複製套件設定檔
COPY package*.json ./

# 安裝 Node.js 依賴套件
RUN npm install

# 複製專案檔案
COPY . .

# 設定執行權限
RUN chmod +x convert_pdfs.js

# 暴露埠（如果需要的話）
# EXPOSE 3000

# 設定預設指令
CMD ["bash"]
