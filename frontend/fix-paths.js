const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, 'build');

console.log('🔄 Starting path fix...');

function fixFilePaths(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      console.log(`📄 Processing: ${filePath}`);
      
      // Исправляем пути к статическим файлам
      content = content
        .replace(/"\/_next\//g, '"_next/')
        .replace(/'\/_next\//g, "'_next/")
        .replace(/\/_next\//g, '_next/')
        .replace(/\/static\//g, 'static/')
        .replace(/href="\//g, 'href="')
        .replace(/src="\//g, 'src="')
        .replace(/url\(\//g, 'url(');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (path.extname(fullPath) === '.html' || 
                 path.extname(fullPath) === '.css' ||
                 path.extname(fullPath) === '.js') {
        fixFilePaths(fullPath);
      }
    });
  } catch (error) {
    console.error('❌ Directory processing error:', error.message);
  }
}

// Проверяем существование build директории
if (fs.existsSync(buildDir)) {
  console.log('📁 Build directory found');
  
  // Сначала проверяем наличие CSS файлов
  const cssDir = path.join(buildDir, '_next/static/css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    console.log('🎨 CSS files found:', cssFiles);
  } else {
    console.log('⚠️ CSS directory not found');
  }
  
  // Обрабатываем файлы
  processDirectory(buildDir);
  console.log('✅ Path fixing completed!');
} else {
  console.log('❌ Build directory not found - run "npm run build" first');
  process.exit(1);
}