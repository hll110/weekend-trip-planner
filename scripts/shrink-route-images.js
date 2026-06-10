/**
 * 缩小分包体积：每条路线只保留 1 张封面图，并压缩至 480px / JPEG 55
 * 运行：node scripts/shrink-route-images.js
 */
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const routesDir = path.join(__dirname, '../miniprogram/packageRoutes/images/routes');
const routesJsonPath = path.join(__dirname, '../miniprogram/data/routes.json');
const routesJsPath = path.join(__dirname, '../miniprogram/data/routes.js');
const MAX_WIDTH = 480;
const JPEG_QUALITY = 55;
const MAX_BYTES = 2048 * 1024;

async function compressFile(filePath) {
  const img = await Jimp.read(filePath);
  if (img.bitmap.width > MAX_WIDTH) {
    img.resize(MAX_WIDTH, Jimp.AUTO);
  }
  await img.quality(JPEG_QUALITY).writeAsync(filePath);
  return fs.statSync(filePath).size;
}

async function main() {
  const routes = JSON.parse(fs.readFileSync(routesJsonPath, 'utf8'));
  const keepNames = new Set();

  for (const route of routes) {
    const cover = `/packageRoutes/images/routes/${route.id}-1.jpg`;
    route.images = [cover];
    route.image = cover;
    keepNames.add(`${route.id}-1.jpg`);
  }

  const allFiles = fs.readdirSync(routesDir);
  let removed = 0;
  for (const file of allFiles) {
    if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
    if (!keepNames.has(file.replace(/\.(png|webp)$/i, '.jpg'))) {
      fs.unlinkSync(path.join(routesDir, file));
      removed++;
    }
  }

  let total = 0;
  for (const name of keepNames) {
    const filePath = path.join(routesDir, name);
    if (!fs.existsSync(filePath)) {
      console.warn(`缺少封面: ${name}`);
      continue;
    }
    const size = await compressFile(filePath);
    total += size;
    console.log(`${name}: ${(size / 1024).toFixed(1)} KB`);
  }

  const header =
    '/** 路线数据 - 图片已下载至 miniprogram/packageRoutes/images/routes/ */\nmodule.exports = ';
  fs.writeFileSync(routesJsPath, header + JSON.stringify(routes, null, 2) + ';\n', 'utf8');
  fs.writeFileSync(routesJsonPath, JSON.stringify(routes, null, 2), 'utf8');
  fs.copyFileSync(routesJsonPath, path.join(__dirname, '../routes_data.json'));

  console.log(`\n删除多余图片 ${removed} 张`);
  console.log(`封面合计 ${(total / 1024).toFixed(1)} KB / 上限 ${MAX_BYTES / 1024} KB`);
  if (total > MAX_BYTES) {
    console.warn('⚠️ 仍超过分包 2MB，请进一步降低质量或改用网络图片');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
