/**
 * 压缩路线图片（宽度最大 750px，JPEG 质量 72）
 * 运行：node scripts/compress-route-images.js
 */
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const routesDir = path.join(__dirname, '../miniprogram/packageRoutes/images/routes');
const MAX_WIDTH = 750;
const JPEG_QUALITY = 72;

async function main() {
  if (!fs.existsSync(routesDir)) {
    console.error('目录不存在:', routesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(routesDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const filePath = path.join(routesDir, file);
    const before = fs.statSync(filePath).size;
    beforeTotal += before;

    if (before < 2048) {
      afterTotal += before;
      console.log(`跳过 ${file} (${before} B，已足够小)`);
      continue;
    }

    const img = await Jimp.read(filePath);
    if (img.bitmap.width > MAX_WIDTH) {
      img.resize(MAX_WIDTH, Jimp.AUTO);
    }

    const outName = file.replace(/\.(png|webp)$/i, '.jpg');
    const outPath = path.join(routesDir, outName);
    await img.quality(JPEG_QUALITY).writeAsync(outPath);

    const after = fs.statSync(outPath).size;
    if (outPath !== filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    afterTotal += after;
    console.log(`${file} → ${outName}: ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`);
  }

  console.log(`\n合计: ${(beforeTotal / 1024).toFixed(1)} KB → ${(afterTotal / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
