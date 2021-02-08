const template = require('./config/default-template');
const chalk = require('chalk');
const { stopSpinner } = require('./util/spinner');
const { log } = require('./util/logger');
const { writeTemplateJson } = require('./util/readTemplateData');

async function resetProjectTemplate(templateName, gitRepoAddress) {
  writeTemplateJson(template);
  stopSpinner();
  log();
  log(`🎉  已重置项目模板 ${chalk.yellow(templateName)}.`);
  log();
}

module.exports = () => {
  return resetProjectTemplate().catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
