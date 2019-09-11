module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  extends: [
    'eslint:recommended',
    'standard'
  ],
  rules: {
    'no-console': 0,
    'no-void': 0
  }
}
