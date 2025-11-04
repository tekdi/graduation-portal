module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@ui': './src/components/ui',
          '@components': './src/components',
          '@utils': './src/utils',
          '@config': './src/config',
          '@contexts': './src/contexts',
          '@types': './src/types',
          '@constants': './src/constants',
          '@layout': './src/layout',
        },
      },
    ],
  ],
};
