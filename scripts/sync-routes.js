/**
 * 若你习惯编辑 routes.json，运行此脚本同步到 routes.js：
 *   node scripts/sync-routes.js
 */
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../miniprogram/data/routes.json');
const jsPath = path.join(__dirname, '../miniprogram/data/routes.js');

const routes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const content =
  '/** 路线数据 - 由 scripts/sync-routes.js 从 routes.json 生成，也可直接编辑本文件 */\nmodule.exports = ' +
  JSON.stringify(routes, null, 2) +
  ';\n';

fs.writeFileSync(jsPath, content, 'utf8');
console.log('已同步', routes.length, '条路线 -> miniprogram/data/routes.js');
