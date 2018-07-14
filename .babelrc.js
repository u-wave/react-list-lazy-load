module.exports = {
  presets: [
    ['@babel/preset-env', {
      loose: true,
      modules: process.env.EXAMPLE === '1' ? 'commonjs' : false,
    }],
    '@babel/preset-react',
  ],
};
