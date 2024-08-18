module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@pages': './src/pages',
          '@stores': './src/stores'
        }
      }
    ]
  ]
};
