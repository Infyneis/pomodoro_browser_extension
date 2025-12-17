import { readFileSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Create Firefox dist folder
const firefoxDist = join(rootDir, 'dist-firefox');
const chromeDist = join(rootDir, 'dist');

if (existsSync(firefoxDist)) {
  rmSync(firefoxDist, { recursive: true });
}

// Copy dist to dist-firefox
console.log('Creating Firefox build...');
cpSync(chromeDist, firefoxDist, { recursive: true });

// Find the service worker bundle in assets
const assetsDir = join(firefoxDist, 'assets');
const files = readdirSync(assetsDir);
const serviceWorkerFile = files.find(f => f.startsWith('service-worker'));

// Create a background.js that imports the bundled code
const backgroundJs = `// Firefox background script wrapper
(async () => {
  try {
    await import('./assets/${serviceWorkerFile}');
  } catch (e) {
    console.error('Failed to load background script:', e);
  }
})();
`;
writeFileSync(join(firefoxDist, 'background.js'), backgroundJs);

// Read the Chrome manifest
const manifest = JSON.parse(readFileSync(join(firefoxDist, 'manifest.json'), 'utf-8'));

// Convert to Firefox Manifest V3 format (Firefox 109+ supports MV3)
const firefoxManifest = {
  manifest_version: 3,
  name: manifest.name,
  description: manifest.description,
  version: manifest.version,
  icons: manifest.icons,
  action: {
    default_popup: manifest.action.default_popup,
    default_icon: manifest.action.default_icon,
    default_title: manifest.action.default_title,
  },
  background: {
    scripts: ['background.js'],
    type: 'module',
  },
  permissions: manifest.permissions,
  browser_specific_settings: {
    gecko: {
      id: 'pomodoro-timer@example.com',
      strict_min_version: '109.0',
    },
  },
};

writeFileSync(join(firefoxDist, 'manifest.json'), JSON.stringify(firefoxManifest, null, 2));

console.log('Firefox build created in dist-firefox/');
console.log('');
console.log('To load in Firefox:');
console.log('1. Go to about:debugging#/runtime/this-firefox');
console.log('2. Click "Load Temporary Add-on"');
console.log('3. Select dist-firefox/manifest.json');
