module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    'react-native-web',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.web.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@ui': './src/components/ui',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
