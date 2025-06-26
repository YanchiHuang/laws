#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { convertPdf, findPdfFiles, main } = require('./convert_pdfs');

/**
 * 測試 convertPdf 函數
 */
async function testConvertPdf() {
    console.log('🧪 開始測試 convertPdf 函數...');
    
    // 建立測試用的假 PDF 檔案（實際上是文字檔案）
    const testPdfPath = 'test.pdf';
    const testContent = '這是一個測試 PDF 檔案的內容\n包含中文字元測試\n第三行測試內容';
    
    try {
        fs.writeFileSync(testPdfPath, testContent, 'utf8');
        console.log('✅ 建立測試 PDF 檔案成功');
        
        // 測試轉換功能
        const result = await convertPdf(testPdfPath, './lawsmd');
        
        console.log('📊 轉換結果:');
        console.log(`   PDF: ${result.pdf}`);
        console.log(`   MD: ${result.md}`);
        console.log(`   狀態: ${result.status}`);
        if (result.error) {
            console.log(`   錯誤: ${result.error}`);
        }
        
        // 檢查輸出檔案是否存在
        if (fs.existsSync(result.md)) {
            console.log('✅ Markdown 檔案已成功建立');
            const mdContent = fs.readFileSync(result.md, 'utf8');
            console.log('📄 Markdown 內容預覽:');
            console.log(mdContent.substring(0, 200) + (mdContent.length > 200 ? '...' : ''));
        } else {
            console.log('❌ Markdown 檔案未建立');
        }
        
    } catch (error) {
        console.error('❌ 測試過程中發生錯誤:', error.message);
    } finally {
        // 清理測試檔案
        if (fs.existsSync(testPdfPath)) {
            fs.unlinkSync(testPdfPath);
            console.log('🧹 清理測試檔案完成');
        }
    }
}

/**
 * 測試目錄結構
 */
function testDirectoryStructure() {
    console.log('\n🧪 測試目錄結構...');
    
    const currentDir = process.cwd();
    console.log(`當前目錄: ${currentDir}`);
    
    // 使用新的搜尋函數尋找 PDF 檔案
    const pdfFiles = findPdfFiles(currentDir);
    
    console.log(`找到 ${pdfFiles.length} 個 PDF 檔案:`);
    pdfFiles.slice(0, 5).forEach(file => {
        const relativePath = path.relative(currentDir, file);
        console.log(`   - ${relativePath}`);
    });
    if (pdfFiles.length > 5) {
        console.log(`   ... 還有 ${pdfFiles.length - 5} 個檔案`);
    }
    
    // 檢查 lawsmd 目錄
    const outputDir = path.join(currentDir, 'lawsmd');
    if (fs.existsSync(outputDir)) {
        console.log('✅ lawsmd 目錄已存在');
        const mdFiles = fs.readdirSync(outputDir).filter(file => file.endsWith('.md'));
        console.log(`   包含 ${mdFiles.length} 個 Markdown 檔案`);
    } else {
        console.log('ℹ️  lawsmd 目錄尚未存在（將在執行時建立）');
    }
}

/**
 * 檢查系統相依性
 */
async function testDependencies() {
    console.log('\n🧪 檢查系統相依性...');
    
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    // 檢查 pdftotext
    try {
        await execAsync('pdftotext -v');
        console.log('✅ pdftotext 可用');
    } catch (error) {
        console.log('❌ pdftotext 不可用');
        console.log('   請安裝 poppler-utils (Linux/macOS) 或 Poppler for Windows');
    }
    
    // 檢查 pandoc
    try {
        await execAsync('pandoc --version');
        console.log('✅ pandoc 可用');
    } catch (error) {
        console.log('❌ pandoc 不可用');
        console.log('   請從 https://pandoc.org/installing.html 安裝 pandoc');
    }
}

/**
 * 主要測試函數
 */
async function runTests() {
    console.log('🚀 開始執行測試...\n');
    
    try {
        // 測試系統相依性
        await testDependencies();
        
        // 測試目錄結構
        testDirectoryStructure();
        
        // 測試轉換功能
        await testConvertPdf();
        
        console.log('\n✅ 所有測試完成！');
        console.log('\n💡 如要執行實際轉換，請執行:');
        console.log('   npm start');
        console.log('   或');
        console.log('   node convert_pdfs.js');
        
    } catch (error) {
        console.error('\n❌ 測試過程中發生未預期的錯誤:', error.message);
        process.exit(1);
    }
}

// 如果直接執行此檔案則執行測試
if (require.main === module) {
    runTests();
}
