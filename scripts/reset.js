const { prompt } = require("enquirer");
const path = require("path");
const fs = require("fs-extra");
const execa = require("execa");

const indexFile = "./index.js";
const packageFile = "./package.json";

const resolve = p => {
  return path.resolve(__dirname, "../", p);
};

async function init() {
  const { name } = await prompt({
    type: "input",
    name: "name",
    message: "请输入你的项目名称"
  });

  if (!/^[\w\d\\-]+$/.test(name)) {
    throw Error("请输入合法的项目名称！");
  }
  const { repository } = await prompt({
    type: "input",
    name: "repository",
    message: "请输入你的项目 git 地址"
  });
  const repositoryRE = /^(https?:\/\/)?(www\.)?[\w\\-\d]+\.[a-zA-Z]+\/([\w\d\\-]+)\/[\w\d\\-]+$/;

  if (!repositoryRE.test(repository)) {
    throw Error("请输入合法的项目仓库地址！");
  }

  let pkg = require(resolve(packageFile));
  const origin = pkg.name;
  // 初始化名字
  const replaceMaps = ["name", "module", "types"];
  for (const key in pkg) {
    if (replaceMaps.includes(key)) {
      pkg[key] = pkg[key].replace(origin, name);
    }
  }

  const author = repository.match(repositoryRE)[3];
  const readFile = await fs.readFile(resolve(indexFile));
  const string = readFile.toString("utf-8");
  const output = string.replace(new RegExp(origin, "g"), name);

  pkg.repository.url = repository;
  pkg.homepage = repository + "#readme";
  pkg.bugs.url = repository + "/issues";
  pkg.version = "0.0.1";
  pkg.author = author;

  await fs.outputFile(packageFile, JSON.stringify(pkg, null, 2));

  await fs.outputFile(resolve(indexFile), output, {
    encoding: "utf-8"
  });

  await fs.remove(resolve("./.git"));

  await execa("git init");
}

init();
