const fs = require('fs-extra');
const { log } = require('../util/logger');

module.exports = async function fetchRemotePreset(name, clone = false) {
  const os = require('os');
  const path = require('path');
  const download = require('download-git-repo');
  // 生成临时目录, 方便后续中间件对其抓取下来的模板进行处理
  const tmpdir = path.resolve(os.tmpdir(), '@m-cli');

  log(`
   tmpdir: ${tmpdir}
  `);

  if (clone) {
    await fs.remove(tmpdir);
  }
  return new Promise((resolve, reject) => {
    download(name, tmpdir, { clone }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(tmpdir);
    });
  });
};
