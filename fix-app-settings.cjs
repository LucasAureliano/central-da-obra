const fs = require('fs');
let content = fs.readFileSync('src/components/AppSettings.tsx', 'utf8');
if (!content.includes('useAuth')) {
  content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useAuth } from '../contexts/AuthContext';\nimport { toast } from 'react-hot-toast';");
  content = content.replace("const exportUserData = () => {", "const { user, profile } = useAuth();\n  const exportUserData = () => {");
  fs.writeFileSync('src/components/AppSettings.tsx', content, 'utf8');
}
