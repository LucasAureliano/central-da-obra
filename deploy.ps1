"AIzaSyDAQhe8HwMGd5Vce2-s99gwdw6MDiCZGHA" | npx vercel env add VITE_FIREBASE_API_KEY production
"central-da-obra-2d66a.firebaseapp.com" | npx vercel env add VITE_FIREBASE_AUTH_DOMAIN production
"central-da-obra-2d66a" | npx vercel env add VITE_FIREBASE_PROJECT_ID production
"central-da-obra-2d66a.firebasestorage.app" | npx vercel env add VITE_FIREBASE_STORAGE_BUCKET production
"968917296940" | npx vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
"1:968917296940:web:4b466d09272f92a23aae89" | npx vercel env add VITE_FIREBASE_APP_ID production

npx vercel --prod --yes
