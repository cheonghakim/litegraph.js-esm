/**
 * ESM 변환 스크립트
 * IIFE 패턴의 노드 파일들을 ESM 스타일로 변환
 */

const fs = require('fs');
const path = require('path');

const nodesDir = path.join(__dirname, '../src/nodes');

// 변환 대상 파일들
const files = [
    'audio.js',
    'base.js',
    'events.js',
    'geometry.js',
    'glfx.js',
    'glshaders.js',
    'gltextures.js',
    'graphics.js',
    'input.js',
    'interface.js',
    'logic.js',
    'math.js',
    'math3d.js',
    'midi.js',
    'network.js',
    'others.js',
    'strings.js'
];

function convertToESM(content) {
    // IIFE 시작 부분 제거
    content = content.replace(/^\(function\s*\(\s*global\s*\)\s*\{\s*\r?\n/gm, '');

    // IIFE 끝 부분 제거 (여러 패턴)
    content = content.replace(/\}\)\(this\);?\s*$/m, '');
    content = content.replace(/\}\)\(typeof\s+window\s*!=\s*["']undefined["']\s*\?\s*window\s*:\s*typeof\s+global\s*!=\s*["']undefined["']\s*\?\s*global\s*:\s*this\);?\s*$/m, '');
    content = content.replace(/\}\)\(typeof window !== "undefined" \? window : global\);?\s*$/m, '');

    // global 참조들을 제거
    content = content.replace(/\s*var\s+LiteGraph\s*=\s*global\.LiteGraph;\s*\r?\n/gm, '');
    content = content.replace(/\s*var\s+LGraphNode\s*=\s*global\.LGraphNode;\s*\r?\n/gm, '');
    content = content.replace(/\s*var\s+LGraphCanvas\s*=\s*global\.LGraphCanvas;\s*\r?\n/gm, '');

    content = content.replace(/global\.LiteGraph/g, 'LiteGraph');
    content = content.replace(/global\.LGraphNode/g, 'LGraphNode');
    content = content.replace(/global\.LGraphCanvas/g, 'LGraphCanvas');

    // import 문 추가
    const importStatement = 'import { LiteGraph, LGraphNode, LGraphCanvas } from "@/litegraph.js";\n\n';

    return importStatement + content.trim() + '\n';
}

function processFile(filename) {
    const filepath = path.join(nodesDir, filename);

    if (!fs.existsSync(filepath)) {
        console.log(`⏭️  Skipping ${filename} (not found)`);
        return;
    }

    try {
        let content = fs.readFileSync(filepath, 'utf-8');

        // 이미 ESM 스타일인지 확인
        if (content.includes('import {') && !content.includes('(function(global)')) {
            console.log(`✅ ${filename} is already ESM`);
            return;
        }

        // IIFE 패턴이 없으면 스킵
        if (!content.includes('(function(global)')) {
            console.log(`⏭️  Skipping ${filename} (not IIFE pattern)`);
            return;
        }

        const convertedContent = convertToESM(content);

        // 백업 파일 생성
        fs.writeFileSync(filepath + '.backup', content, 'utf-8');

        // 변환된 내용 저장
        fs.writeFileSync(filepath, convertedContent, 'utf-8');

        console.log(`✅ Converted ${filename}`);
    } catch (error) {
        console.error(`❌ Error converting ${filename}:`, error.message);
    }
}

console.log('🔄 Starting ESM conversion...\n');

files.forEach(processFile);

console.log('\n✨ Conversion complete!');
console.log('📝 Backup files created with .backup extension');
