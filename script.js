
const fs = require('fs');
let path = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(path, 'utf8');
if (!xml.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  xml = xml.replace('</application>', '    <meta-data android:name=\'com.google.android.gms.ads.APPLICATION_ID\' android:value=\'ca-app-pub-3940256099942544~3347511713\'/>\\n    </application>');
  fs.writeFileSync(path, xml, 'utf8');
}

