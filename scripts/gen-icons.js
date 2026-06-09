const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const base = path.join(__dirname, '..', 'miniprogram', 'images');
fs.mkdirSync(base, { recursive: true });

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 4;
      raw[i] = rgba[0];
      raw[i + 1] = rgba[1];
      raw[i + 2] = rgba[2];
      raw[i + 3] = rgba[3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const icons = {
  'home.png': [148, 163, 184, 255],
  'home-active.png': [196, 30, 42, 255],
  'filter.png': [148, 163, 184, 255],
  'filter-active.png': [196, 30, 42, 255],
  'placeholder.png': [254, 247, 240, 255],
  'share-bg.png': [196, 30, 42, 255],
  'discover.png': [148, 163, 184, 255],
  'discover-active.png': [196, 30, 42, 255]
};

Object.entries(icons).forEach(([name, rgba]) => {
  fs.writeFileSync(path.join(base, name), createPng(81, 81, rgba));
  console.log('wrote', name);
});
