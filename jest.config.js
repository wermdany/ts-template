module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require("./package.json").version,
    "ts-jest": {
      tsconfig: {
        target: "esnext",
        sourceMap: true
      }
    }
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/.git/"]
};
