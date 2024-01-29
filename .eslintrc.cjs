module.exports = {
  ignorePatterns: ['**/h5pResizer.ts'],
  extends: ['eslint-config-ndla'],
  rules: {
    'react/prop-types': [2, { ignore: ['children', 'className', 't'] }],
  },
};
