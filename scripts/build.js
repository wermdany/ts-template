const minimist = require("minimist");
const path = require("path");
const fs = require("fs-extra");
const { parse } = require("dotenv");
const execa = require("execa");
const chalk = require("chalk");

let stepIndex = 1;

const ROOT_PATH = path.resolve(__dirname, "../");

const envPath = path.resolve(ROOT_PATH, ".env");

const env = parse(fs.readFileSync(envPath));

const args = minimist(process.argv.slice(2));

const analyzer = args.a || args.analyzer || JSON.parse(env.ANALYZER) || false;

const sourcemap = args.s || args.sourcemap || JSON.parse(env.SOURCE_MAP) || false;

const inspect = args.i || args.inspect || false;

const isRelease = args.r || args.release || false;

async function build() {
  if (inspect) {
    step("run eslint...");

    await run("npm run eslint");

    step("run prettier...");

    await run("npm run prettier");

    step("run tsc...");

    await run("npm run test:tsc");

    step("run jest test...");

    await run("npm run test:unit");
  }

  step("remove old build files...");
  await fs.remove(path.resolve(ROOT_PATH, "dist"));

  if (isRelease) {
    step("remove cache files...");
    await fs.remove(path.resolve(ROOT_PATH, "node_modules/.cache"));
  }

  step("building files...");

  await run(
    "rollup",
    [
      "-c",
      "--environment",
      [sourcemap ? `SOURCE_MAP:true` : ``, analyzer ? `ANALYZER:true` : ``].filter(Boolean).join(",")
    ],
    { stdio: "inherit" }
  );

  step("generate type files...");

  await run("npm run build:dts");

  if (isRelease) {
    step("generate changelog files...");

    await run("npm run changelog");
  }

  step("build successful!");
}

build();

function step(msg) {
  console.log(chalk.cyanBright(`${stepIndex++}. ${msg}`));
}

function run(bin, args, opts) {
  return execa(bin, args, { stdio: "inherit", ...opts });
}
