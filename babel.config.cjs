module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 0.25%', 'not dead'],
        },
      },
    ],
  ],

  plugins: [['@emotion', { autoLabel: 'always' }], '@loadable/babel-plugin'],
};
