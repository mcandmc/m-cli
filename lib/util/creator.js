const chalk = require('chalk');
const execa = require('execa'); // 一个child_process封装库
const EventEmitter = require('events');
const fs = require('fs-extra');
const { clearConsole } = require('./clearConsole');
const { logWithSpinner, stopSpinner } = require('./spinner');
const { log, warn, error } = require('./logger');
const { hasGit, hasProjectGit } = require('./env');
const fetchRemotePreset = require('./loadRemotePreset');
const { readTemplateJson } = require('./readTemplateData');

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super();
    this.name = name;
    this.context = process.env.M_CLI_CONTEXT = context; // 项目绝对路径
    console.log('context: ', context);
  }

  async create(cliOptions = {}) {
    const { name, context } = this;
    const templateGitRepoJson = await readTemplateJson();
    const gitRepoUrl = templateGitRepoJson[process.env.M_CLI_TEMPLATE_NAME];
    let tmpdir;
    await clearConsole(true);
    log(`✨ 项目将创建在 ${chalk.yellow(context)}.`);
    log();
    try {
      stopSpinner();
      logWithSpinner(`⠋`, `正在初始化模板. 请稍后...`);
      tmpdir = await fetchRemotePreset(gitRepoUrl['download'], true); // clone 不为true没有权限访问gitlab项目
    } catch (e) {
      stopSpinner();
      error(`访问远程 git repo 错误: ${chalk.cyan(gitRepoUrl)}:`);
      throw e;
    }
    // 拷贝到项目文件下
    try {
      fs.copySync(tmpdir, context);
    } catch (error) {
      return console.error(chalk.red.dim(`Error: ${error}`));
    }

    // 替换拉取模板中的文件的模板字符串
    const { replaceTemplate } = require('./replaceTemplate');
    // 需要替换的字段及文件列表
    replaceTemplate({ project_name: name }, [`${context}/package.json`]);

    const shouldInitGit = this.shouldInitGit();
    if (shouldInitGit) {
      // 已经安装git
      stopSpinner();
      log();
      logWithSpinner(`🗃`, `正在初始化git...`);
      this.emit('creation', { event: 'git-init' });
      // 执行git init
      await this.run('git init');
    }

    // commit init state
    let gitCommitFailed = false;
    if (shouldInitGit) {
      await this.run('git add -A');
      try {
        await this.run('git', ['commit', '-m', 'init']);
      } catch (error) {
        gitCommitFailed = true;
      }
    }

    stopSpinner();
    log();
    log(`🎉  创建项目成功 ${chalk.yellow(name)}.`);
    log();
    this.emit('creation', { event: 'done' });
    if (gitCommitFailed) {
      // commit fail
      warn(
        `Skipped git commit due to missing username and email in git config.\n` +
          `You will need to perform the initial commit yourself.\n`,
      );
    }
  }

  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  shouldInitGit() {
    if (!hasGit()) {
      return false;
    }
    return !hasProjectGit(this.context);
  }
};
