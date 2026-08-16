const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            callback(dirPath);
        }
    });
}

function getRelativePath(fromFile, toFile) {
    let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    rel = rel.replace(/\.ts$/, '');
    return rel;
}

let changedFiles = 0;

walkDir('./src', (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/R\$\s*\{\s*([^}]+?)\.toLocaleString\('pt-BR'[^}]*\)\s*\}/g, '{formatCurrency($1)}');
    content = content.replace(/R\$\s*\$\{\s*([^}]+?)\.toLocaleString\('pt-BR'[^}]*\)\s*\}/g, '${formatCurrency($1)}');
    content = content.replace(/['"]R\$\s*['"]\s*\+\s*([^.\s]+(\.[^.\s]+)*)\.toLocaleString\('pt-BR'[^)]*\)/g, 'formatCurrency($1)');

    content = content.replace(/new\s+Date\(([^)]+)\)\.toLocaleDateString\('pt-BR'[^)]*\)/g, 'formatDate($1)');
    content = content.replace(/([^.\s{(]+(?:\[[^\]]+\]|\.[^.\s]+)*)\.toLocaleDateString\('pt-BR'[^)]*\)/g, 'formatDate($1)');

    if (content !== original) {
        let hasFormatCurrency = content.includes('formatCurrency(');
        let hasFormatDate = content.includes('formatDate(');
        
        let importsToInject = [];
        if (hasFormatCurrency && !content.includes('import { formatCurrency')) importsToInject.push('formatCurrency');
        if (hasFormatDate && !content.includes('import { formatDate')) importsToInject.push('formatDate');
        
        if (importsToInject.length > 0) {
            let formattersPath = getRelativePath(filePath, path.join(__dirname, 'src', 'utils', 'formatters.ts'));
            let importStatement = `import { ${importsToInject.join(', ')} } from '${formattersPath}';\n`;
            
            let importMatches = [...content.matchAll(/^import .*;?$/gm)];
            if (importMatches.length > 0) {
                let lastImport = importMatches[importMatches.length - 1];
                let insertPos = lastImport.index + lastImport[0].length + 1;
                content = content.slice(0, insertPos) + importStatement + content.slice(insertPos);
            } else {
                content = importStatement + content;
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        changedFiles++;
        console.log('Updated', filePath);
    }
});

console.log('Total files changed:', changedFiles);
