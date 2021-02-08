const chalk = require('chalk');
const isGitUrl = require('is-git-url');
const { stopSpinner } = require('./util/spinner');
const { log } = require('./util/logger');
const { readTemplateJson, writeTemplateJson } = require('./util/readTemplateData');

async function addProjectTemplate(templateName, gitRepoAddress) {
  const templateGitRepoJson = readTemplateJson();
  if (templateGitRepoJson[templateName]) {
    console.log(`  ` + chalk.red(`项目模板名称 ${templateName} 已经存在.`));
    return;
  }
  if (!isGitUrl(gitRepoAddress)) {
    console.log(`  ` + chalk.red(`git repo 地址 ${gitRepoAddress} 不是正确的 git repo.`));
    return;
  }
  // 转化为需要的正确格式
  const correctGitRepo = getRealGitRepo(gitRepoAddress);
  templateGitRepoJson[templateName] = {
    address: gitRepoAddress,
    download: correctGitRepo,
  };
  writeTemplateJson(templateGitRepoJson);
  stopSpinner();
  log();
  log(`🎉  添加新的项目模板成功 ${chalk.yellow(templateName)}.`);
  log();
}
/**
 * format
 * https => https://github.com/NuoHui/node_code_constructor.git
 * ssh => git@github.com:NuoHui/node_code_constructor.git
 * want => github:NuoHui/node_code_constructor
 */
function getRealGitRepo(gitRepo) {
  const sshRegExp = /^git@(github|gitlab).com:(.+)\/(.+).git$/;
  const httpsRegExp = /^https:\/\/(github|gitlab).com\/(.+)\/(.+).git$/;
  if (sshRegExp.test(gitRepo)) {
    // ssh
    const match = gitRepo.match(sshRegExp);
    // console.log('ssh match: ', match);
    return `${match[1]}:${match[2]}/${match[3]}`;
  }
  if (httpsRegExp.test(gitRepo)) {
    // https
    const match = gitRepo.match(httpsRegExp);
    // console.log('https match: ', match);
    return `${match[1]}:${match[2]}/${match[3]}`;
  }
}

module.exports = (...args) => {
  return addProjectTemplate(...args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
