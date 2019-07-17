module.exports = {
  extends: 'eslint-config-ndla',
  rules: {
    'react/prop-types': [2, { ignore: ['children', 'className', 't'] }],
  },
};
