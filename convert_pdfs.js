#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * 轉換 PDF 檔案為 Markdown 格式
 * @param {string} pdfPath - PDF 檔案路徑
 * @param {string} outputDir - 輸出目錄
 * @returns {Promise<Object>} 轉換結果
 */
async function convertPdf(pdfPath, outputDir) {
    const baseName = path.basename(pdfPath, '.pdf');
    const textPath = path.join(path.dirname(pdfPath), baseName + '.txt');
    const mdPath = path.join(outputDir, baseName + '.md');
    
    const result = {
        pdf: pdfPath,
        md: mdPath,
        status: '✅',
        error: ''
    };

    try {
        // 確保輸出目錄存在
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 使用 pdftotext 轉換 PDF 為文字
        await execAsync(`pdftotext "${pdfPath}" "${textPath}"`);
        
        // 使用 pandoc 轉換文字為 Markdown
        await execAsync(`pandoc "${textPath}" -f plain -t markdown --toc -o "${mdPath}"`);
        
    } catch (error) {
        result.status = '❌';
        result.error = error.message.replace(/\n/g, ' ').trim();
    } finally {
        // 清理暫存的文字檔案
        if (fs.existsSync(textPath)) {
            try {
                fs.unlinkSync(textPath);
            } catch (err) {
                // 忽略刪除錯誤
            }
        }
    }
    
    return result;
}

/**
 * 遞迴尋找指定目錄下的所有 PDF 檔案
 * @param {string} dir - 搜尋目錄
 * @returns {Array<string>} PDF 檔案路徑陣列
 */
function findPdfFiles(dir) {
    const pdfFiles = [];
    
    function scanDirectory(currentDir) {
        const files = fs.readdirSync(currentDir);
        
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // 遞迴搜尋子目錄
                scanDirectory(fullPath);
            } else if (file.toLowerCase().endsWith('.pdf')) {
                pdfFiles.push(fullPath);
            }
        }
    }
    
    scanDirectory(dir);
    return pdfFiles;
}

/**
 * 主要執行函數
 */
async function main() {
    try {
        const currentDir = process.cwd();
        const outputDir = path.join(currentDir, 'lawsmd');
        
        // 遞迴搜尋所有 PDF 檔案
        const pdfFiles = findPdfFiles(currentDir);
        pdfFiles.sort();

        console.log(`找到 ${pdfFiles.length} 個 PDF 檔案`);
        
        if (pdfFiles.length === 0) {
            console.log('沒有找到任何 PDF 檔案');
            return;
        }
        
        const results = [];
        
        // 處理每個 PDF 檔案
        for (const pdfFile of pdfFiles) {
            const relativePath = path.relative(currentDir, pdfFile);
            console.log(`正在處理: ${relativePath}`);
            const result = await convertPdf(pdfFile, outputDir);
            results.push(result);
        }

        // 產生結果報告
        const reportLines = [
            '| PDF 檔案 | Markdown 檔案 | 狀態 | 訊息 |',
            '| --- | --- | --- | --- |'
        ];

        results.forEach(result => {
            const msg = result.error.replace(/\|/g, '\\|');
            const pdfName = path.relative(currentDir, result.pdf);
            reportLines.push(`| ${pdfName} | ${path.basename(result.md)} | ${result.status} | ${msg} |`);
        });

        const reportContent = reportLines.join('\n');
        fs.writeFileSync('result.md', reportContent, 'utf8');
        
        console.log('\n轉換完成！結果已儲存至 result.md');
        
        // 顯示統計資訊
        const successCount = results.filter(r => r.status === '✅').length;
        const failCount = results.filter(r => r.status === '❌').length;
        console.log(`成功: ${successCount}, 失敗: ${failCount}`);
        
    } catch (error) {
        console.error('執行時發生錯誤:', error.message);
        process.exit(1);
    }
}

// 如果直接執行此檔案則執行主函數
if (require.main === module) {
    main();
}

module.exports = { convertPdf, findPdfFiles, main };
