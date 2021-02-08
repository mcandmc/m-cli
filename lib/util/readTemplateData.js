const path = require('path');
const fse = require('fs-extra');

exports.readTemplateJson = async () => {
  const tplPath = path.resolve(__dirname, '../config/template.json');
  const exists = fse.pathExistsSync(tplPath);
  // 没有模板文件使用默认数据创建一个
  if (!exists) {
    const template = require('../config/default-template');
    this.writeTemplateJson(template);
    return template;
  }
  return fse.readJsonSync(tplPath, { encoding: 'utf8' });
};

exports.writeTemplateJson = (json) => {
  const tplPath = path.resolve(__dirname, '../config/template.json');
  return fse.writeJsonSync(tplPath, json, { encoding: 'utf8' });
};
