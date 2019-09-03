module.exports = {
  extends: ['@vue/airbnb'],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': 0,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
  },
};
