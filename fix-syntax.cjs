const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorsHubView.tsx', 'utf8');

const brokenLine = "const CalcCard = React.forwardRef<HTMLAnchorElement, { title: string, desc: string, icon: React.ReactNode, link: string, comingSoon?: boolean }>(({ title, desc, icon, link, comingSoon }, ref) => {, desc, icon, link, comingSoon }: { title: string, desc: string, icon: React.ReactNode, link: string, comingSoon?: boolean }) {";
const fixedLine = "const CalcCard = React.forwardRef<HTMLAnchorElement, { title: string, desc: string, icon: React.ReactNode, link: string, comingSoon?: boolean }>(({ title, desc, icon, link, comingSoon }, ref) => {";

code = code.replace(brokenLine, fixedLine);
fs.writeFileSync('src/components/public/PublicCalculatorsHubView.tsx', code, 'utf8');
console.log("Fixed syntax error");
