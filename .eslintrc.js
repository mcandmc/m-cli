module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  ignorePatterns: ['.eslintrc.js', '.prettierrc.js'],
  parserOptions: {
    ecmaVersion: 2018
  },
  globals: {},
  plugins: ['prettier'],
  rules: {
    'no-useless-return': 0
  }
};
