const chalk = require('chalk');
const { readTemplateJson } = require('./util/readTemplateData');
const { stopSpinner } = require('./util/spinner');
const { log } = require('./util/logger');
async function listAllTemplate() {
  const templateGitRepoJson = await readTemplateJson();
  for (let key in templateGitRepoJson) {
    stopSpinner();
    log();
    log(`➡️  项目名称 ${chalk.yellow(key)},  Git 地址 ${chalk.yellow(templateGitRepoJson[key]['address'])}`);
    log();
  }
  if (!Object.keys(templateGitRepoJson).length) {
    stopSpinner();
    log();
    log(`💔  当前没有任何模板.`);
    log();
  }
}

module.exports = () => {
  return listAllTemplate().catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
