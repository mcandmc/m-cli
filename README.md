# mCli

一个快速上手的前端脚手架, 轻松创建项目模板, 实现0配置, 快速开发。

## Features

- 支持多类型项目模板(目前[Node](https://github.com/NuoHui/node_code_constructor), [Vue CSR](https://github.com/NuoHui/vue_code_constructor)), 模板都会集成代码扫描, 工作流等, 具体查看模板github地址。
- 支持添加项目模板, 删除项目模板(flok 作为自己的工具推荐使用)
- 支持自动检测脚手架更新

## Installation & Quick start

### 安装

Windows系统安装
```
$ npm i @mcandmc/m-cli -g
```

Mac下安装
```
$ sudo npm i @mcandmc/m-cli -g
```

### 查看帮助信息

```
$ m-cli
```


### 创建项目

```
# 指定项目名字创建项目
$ m-cli create 模板名<template-name> 项目名字<project-name>

# 在当前目录创建项目
$ m-cli create 模板名<template-name> .
```

### 查看所有支持的项目模板

```
$ m-cli list
```

### 添加项目模板

```
$ m-cli add 模板名<template-name> 模板github仓库地址,支持ssh/https格式<git-repo-address>
```

### 删除项目模板

```
$ m-cli delete 模板名<template-name>
```

### 发布到npm

执行pkg下的脚本, 自动发版并且生成changelog, travis就会执行检测后续自动发到npm.
```
npm run release
```


## Changelog

[Changelog](https://github.com/mcandmc/m-cli/blob/master/CHANGELOG.md)

## TODOLIST

- 优化Node应用模板
- 优化Vue应用模板
- 添加单测
