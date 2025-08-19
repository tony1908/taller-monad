module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // Disable some rules that might conflict with React Native/Metro
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
