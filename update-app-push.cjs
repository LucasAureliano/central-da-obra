const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('usePushNotifications')) {
  code = code.replace(/import \{ useAuth \} from '\.\/contexts\/AuthContext';/, "import { useAuth } from './contexts/AuthContext';\nimport { usePushNotifications } from './hooks/usePushNotifications';");
  
  // Call it right before useAuth hook calls
  code = code.replace(/const \{ profile, isGuest \} = useAuth\(\);/, "usePushNotifications();\n  const { profile, isGuest } = useAuth();");
  
  fs.writeFileSync('src/App.tsx', code, 'utf8');
}
console.log("Added push notifications to App");
