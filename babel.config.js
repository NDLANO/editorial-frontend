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

  plugins: [
    ['@emotion', { autoLabel: 'always' }],
    '@loadable/babel-plugin',
    process.env.BABEL_ENV === 'development' && process.env.BUILD_TARGET === 'client'
      ? 'react-refresh/babel'
      : false,
  ].filter((e) => !!e),
};