
const fs = require('fs');
let path = 'ios/App/App/Info.plist';
if (fs.existsSync(path)) {
  let xml = fs.readFileSync(path, 'utf8');
  if (!xml.includes('GADApplicationIdentifier')) {
    xml = xml.replace('</dict>', '    <key>GADApplicationIdentifier</key>\n    <string>ca-app-pub-3940256099942544~1458002511</string>\n</dict>');
    fs.writeFileSync(path, xml, 'utf8');
  }
}

