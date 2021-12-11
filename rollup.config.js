import naming from "naming-style";
import ts from "rollup-plugin-typescript2";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import analyzer from "rollup-plugin-analyzer";

const { terser } = require("rollup-plugin-terser");
import { yellow } from "chalk";

import { resolve } from "./scripts/helper";

const pkg = require("./package.json");

const outputConfigs = {
  cjs: {
    file: `dist/${pkg.name}.cjs.js`,
    format: `cjs`
  },
  "esm-bundler": {
    file: `dist/${pkg.name}.esm-bundler.js`,
    format: "esm"
  },
  global: {
    file: `dist/${pkg.name}.global.js`,
    format: `iife`
  },
  esm: {
    file: `dist/${pkg.name}.esm-browser.js`,
    format: `esm`
  }
};

const external = [];

const extensions = [".js", ".ts", ".json"];

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * @license MIT
  */`;

const buildModes = Object.keys(outputConfigs);

const packagesConfigs = buildModes.map(format => {
  return createBuildConfig(format, outputConfigs[format]);
});

buildModes.forEach(format => {
  if (format === "cjs") {
    packagesConfigs.push(createProductionConfig(format));
  }
  if (/^(global|esm-browser)/.test(format)) {
    packagesConfigs.push(createMinifiedConfig(format));
  }
});

function createBuildConfig(format, output, plugins = []) {
  if (!output) {
    console.log(yellow(`无效的打包格式："${format}"`));
    process.exit(1);
  }

  output.sourcemap = !!process.env.SOURCE_MAP;
  output.banner = banner;
  output.externalLiveBindings = false;

  output.globals = {};

  const isProdBuild = /\.prod\.js$/.test(output.file);
  const isGlobalBuild = format === "global";
  const isBundlerESMBuild = /esm-bundler/.test(format);
  const isTest = false;

  if (isGlobalBuild) output.name = naming.pascal(pkg.name);

  const tsPlugin = ts({
    check: true,
    tsconfig: resolve("tsconfig.json"),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: true,
        declarationMap: true
      },
      exclude: ["__tests__"]
    }
  });

  const defaultPlugins = [
    commonjs(),
    nodeResolve({
      extensions
    }),
    process.env.ANALYZER && analyzer()
  ].filter(Boolean);

  return {
    input: resolve("src/index.ts"),
    external,
    plugins: [
      tsPlugin,
      createReplacePlugin(isProdBuild, isBundlerESMBuild, isTest),
      ...defaultPlugins,
      ...plugins
    ],
    output
  };
}

function createReplacePlugin(isProduction, isBundlerESMBuild, isTest) {
  const replacements = {
    __VERSION__: `"${pkg.version}"`,
    __DEV__: isBundlerESMBuild ? `(process.env.NODE_ENV !== 'production')` : JSON.stringify(!isProduction),
    __TEST__: isTest
  };
  return replace({
    preventAssignment: true,
    values: replacements
  });
}

function createProductionConfig(format) {
  return createBuildConfig(format, {
    file: resolve(`dist/${pkg.name}.${format}.prod.js`),
    format: outputConfigs[format].format
  });
}

function createMinifiedConfig(format) {
  return createBuildConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, ".prod.js"),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        },
        safari10: true
      })
    ]
  );
}

export default packagesConfigs;
