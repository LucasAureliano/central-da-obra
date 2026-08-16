const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Regex to find potential secrets
const SECRET_PATTERNS = [
  /AI_API_KEY=["'][a-zA-Z0-9_-]+["']/i,
  /VITE_FIREBASE_API_KEY=["'][a-zA-Z0-9_-]+["']/i,
  /private_key/i,
  /serviceAccount.*\.json/i,
  /firebase-adminsdk.*\.json/i,
  /credentials\.json/i,
  /["']?password["']?\s*:\s*["'][^"']+["']/i,
  /(sk-[a-zA-Z0-9]{20,})/i // Generic secret key format
];

const FORBIDDEN_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  'serviceAccount.json',
  'firebase-adminsdk.json',
  'credentials.json'
];

console.log('🔍 Executing pre-commit secret check...');

try {
  // Get list of staged files
  const stagedFiles = execSync('git diff --cached --name-only').toString().trim().split('\n');
  
  if (stagedFiles.length === 1 && stagedFiles[0] === '') {
    console.log('No files staged for commit.');
    process.exit(0);
  }

  let hasErrors = false;

  for (const file of stagedFiles) {
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) continue;

    const basename = path.basename(file);

    // 1. Check if the file itself is forbidden
    if (FORBIDDEN_FILES.includes(basename)) {
      console.error(`\n❌ ERROR: You are trying to commit a forbidden file: ${file}`);
      console.error('This file may contain secrets. Please remove it from staging:');
      console.error(`  git reset HEAD ${file}`);
      hasErrors = true;
      continue;
    }

    // 2. Check for secret patterns in file content
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`\n❌ ERROR: Potential secret detected in file: ${file}`);
          console.error(`Pattern matched: ${pattern}`);
          console.error('Please remove the secret before committing.');
          hasErrors = true;
        }
      }
    } catch (e) {
      // Ignore binary files or files that can't be read as utf8
    }
  }

  if (hasErrors) {
    console.error('\n🚫 Commit blocked due to potential secrets exposure.');
    process.exit(1);
  }

  console.log('✅ No secrets detected. Proceeding with commit.');
  process.exit(0);

} catch (error) {
  console.error('Error running secret check:', error.message);
  process.exit(1);
}
