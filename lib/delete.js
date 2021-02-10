const chalk = require('chalk');
const inquirer = require('inquirer');
const { stopSpinner } = require('./util/spinner');
const { log } = require('./util/logger');
const { readTemplateJson, writeTemplateJson } = require('./util/readTemplateData');
async function deleteTemplate(templateName) {
  const templateGitRepoJson = await readTemplateJson();
  if (!templateGitRepoJson[templateName]) {
    console.log(`  ` + chalk.red(`template name ${templateName} has not exists.`));
    return;
  }
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `是否要删除项目模板 ${templateName}?`,
    },
  ]);
  if (!ok) {
    return;
  }
  delete templateGitRepoJson[templateName];
  writeTemplateJson(templateGitRepoJson);
  stopSpinner();
  log();
  log(`🎉  删除项目模板成功 ${chalk.yellow(templateName)}.`);
  log();
}

module.exports = (...args) => {
  return deleteTemplate(...args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
