# 一个快速启动的类库编写模板

> 在编写一些类库或者工具事，每次重新配饰**roullup**、**eslint**、**prettier**、**jest**等等比较费时费力，因此一个模板还是很有必要性的，充分参考了 [vue-next](https://github.com/vuejs/vue-next)配置。

## 快速开始

启动 npm run reset 根据提示填入信息即可。

> 此操作有风险

## 简单描述

本项目统统使用 typescript 开发代码，同时输出多种格式文件和类型文件。

## 环境变量

```ts
interface Env {
  /* 是否是开发环境 */
  __DEV__: bool;
  /* 版本号 */
  __VERSION__: string;
  /* 是否是测试环境 */
  __TEST__: bool;
}
```

可根据上面的环境变量判断编写代码，并打包成不同的包。

比如错误信息，进行判断后再弹出，同时打包 带错误信息和不带错误信息的包，只需要配置 `__DEV__` 就行了。

rollup 使用摇树去除不需要的代码。

你也可以根据自身需要，配置环境变量。

## 支持功能

### 代码格式化

> npm run prettier

- prettier

### 代码检查

> npm run eslint

- eslint

### 代码测试

> npm run test:unit

- jest

### 编译检查

> npm run test:tec

- tsc

### 自动编译输出文件

> npm run build -i -s -r -a
>
> -i 打包前进行必要的检查  
> -s 生成 sourcemap  
> -a 同时查看打包详细分析  
> -r 生产

- commonjs
- esm
- iife （自执行文件）

### api-extractor

> npm run build:dts

- 自动输出类型文件（.d.ts）

### 代码提交前进行校验

> 在 commit 时触发

- husky
- lint-staged

### 自动生成变更日志

> npm run changelog
>
> commit message 必须按照 angular 提交规范

```txt
<type>(<scope>): <subject> // 这一行是Header
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
