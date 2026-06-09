const crypto = require('crypto');

function wikiThumb(filename, width = 960) {
  const fn = filename.replace(/ /g, '_');
  const hash = crypto.createHash('md5').update(fn).digest('hex');
  const enc = encodeURIComponent(fn);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0, 2)}/${enc}/${width}px-${enc}`;
}

module.exports = { wikiThumb };
