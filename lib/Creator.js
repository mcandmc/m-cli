const chalk = require('chalk');
const execa = require('execa'); // 一个child_process封装库
const EventEmitter = require('events');
const fs = require('fs-extra');
const { clearConsole } = require('./util/clearConsole');
const { logWithSpinner, stopSpinner } = require('./util/spinner');
const { log, warn, error } = require('./util/logger');
const { hasGit, hasProjectGit } = require('./util/env');
const fetchRemotePreset = require('./util/loadRemotePreset');
const { readTemplateJson } = require('./util/readTemplateData');

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
    log(`✨ Creating project in ${chalk.yellow(context)}.`);
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

    const { replaceTemplate } = require('./util/replaceTemplate');
    replaceTemplate({ project_name: name }, [`${context}/package.json`]);

    const shouldInitGit = this.shouldInitGit();
    if (shouldInitGit) {
      // 已经安装git
      stopSpinner();
      log();
      logWithSpinner(`🗃`, `Initializing git repository...`);
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
