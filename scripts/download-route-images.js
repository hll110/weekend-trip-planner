/**
 * 下载路线图片到 miniprogram/packageRoutes/images/routes/，并写入本地路径
 * 运行：node scripts/download-route-images.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const dataDir = path.join(__dirname, '../miniprogram/data');
const outDir = path.join(__dirname, '../miniprogram/packageRoutes/images/routes');
const routesJsPath = path.join(dataDir, 'routes.js');
const routesJsonPath = path.join(dataDir, 'routes.json');
const urlsByRoute = require('../miniprogram/data/route-image-sources.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function curlBin() {
  if (process.platform === 'win32') {
    const win = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'curl.exe');
    if (fs.existsSync(win)) return win;
  }
  return 'curl';
}

function extFromUrl(url) {
  const m = url.match(/\.(jpe?g|png|webp)/i);
  if (!m) return '.jpg';
  const e = m[0].toLowerCase();
  return e === '.jpeg' ? '.jpg' : e;
}

function downloadHttps(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { 'User-Agent': 'YuquTripPlanner/1.0 (educational mini program)' },
        timeout: 60000
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          return downloadHttps(next).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

function downloadCurl(url, dest) {
  execFileSync(
    curlBin(),
    ['-fsSL', '--retry', '3', '--retry-delay', '2', '--max-time', '90', '-A', 'YuquTripPlanner/1.0', '-o', dest, url],
    { stdio: 'pipe' }
  );
}

async function downloadToFile(url, dest) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      try {
        downloadCurl(url, dest);
        if (fs.statSync(dest).size > 500) return;
        throw new Error('file too small');
      } catch (curlErr) {
        if (curlErr.code === 'ENOENT') {
          const buf = await downloadHttps(url);
          if (buf.length < 500) throw new Error('file too small');
          fs.writeFileSync(dest, buf);
          return;
        }
        throw curlErr;
      }
    } catch (e) {
      lastErr = e;
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      if (attempt < 3) await sleep(2000 * attempt);
    }
  }
  throw lastErr;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const routes = JSON.parse(fs.readFileSync(routesJsonPath, 'utf8'));
  const placeholder = path.join(__dirname, '../miniprogram/images/placeholder.png');

  for (const route of routes) {
    const urls = urlsByRoute[route.id];
    if (!urls || !urls.length) {
      console.warn(`跳过路线 ${route.id}：无配图配置`);
      continue;
    }

    const localImages = [];
    console.log(`\n路线 ${route.id} ${route.name}`);

    for (let i = 0; i < urls.length; i++) {
      const src = urls[i];
      const ext = extFromUrl(src);
      const localName = `${route.id}-${i + 1}${ext}`;
      const localPath = path.join(outDir, localName);
      const miniPath = `/packageRoutes/images/routes/${localName}`;

      try {
        await downloadToFile(src, localPath);
        const kb = (fs.statSync(localPath).size / 1024).toFixed(0);
        localImages.push(miniPath);
        console.log(`  OK ${localName} (${kb} KB)`);
      } catch (e) {
        console.warn(`  失败: ${e.message}`);
        if (fs.existsSync(placeholder)) {
          const fallbackName = `${route.id}-${i + 1}.png`;
          fs.copyFileSync(placeholder, path.join(outDir, fallbackName));
          localImages.push(`/packageRoutes/images/routes/${fallbackName}`);
          console.log(`  使用占位图 ${fallbackName}`);
        }
      }
    }

    route.images = localImages;
    route.image = localImages[0] || route.image;
  }

  const header =
    '/** 路线数据 - 图片已下载至 miniprogram/packageRoutes/images/routes/ */\nmodule.exports = ';
  fs.writeFileSync(routesJsPath, header + JSON.stringify(routes, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(routesJsonPath, JSON.stringify(routes, null, 2), 'utf8');
  fs.copyFileSync(routesJsonPath, path.join(__dirname, '../routes_data.json'));
  console.log('\n完成：已写入本地图片路径');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
