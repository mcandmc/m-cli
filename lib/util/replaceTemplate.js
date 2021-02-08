const fse = require('fs-extra');
// 请求 handlebars 库，用于替换模板字符
const handlebars = require('handlebars');
const { stopSpinner } = require('./spinner');
const { error } = require('./logger');
/**
 *
 * @param {*} multiMeta 要替换的模板字符 {}
 * @param {*} multiFiles 要替换的文件 []
 * @param {*} targetPath 目标路径 ''
 */
exports.replaceTemplate = async (multiMeta, multiFiles) => {
  // logWithSpinner(`🗃`, `替换模板字符串...`);
  // 用条件循环把模板字符替换到文件去
  for (var i = 0; i < multiFiles.length; i++) {
    // 这里记得 try {} catch {} 哦，以便出错时可以终止掉 Spinner
    try {
      // 等待读取文件
      const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8');
      // 等待替换文件，handlebars.compile(原文件内容)(模板字符)
      const multiFilesResult = await handlebars.compile(multiFilesContent)(multiMeta);
      // 等待输出文件
      await fse.outputFile(multiFiles[i], multiFilesResult);
    } catch (err) {
      error(`替换项目模板字符串失败. ${err}`);
      stopSpinner();
      // 退出进程
      process.exit(1);
    }
  }
};
