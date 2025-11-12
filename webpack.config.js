const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env = {}) => {
  let entry = './index.web.js';
  let mode =
    env.mode || process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development';
  let output = {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  };

  if (env.entry && env.entry === 'project-player') {
    const entryName = env.entry; // Default entry
    const entryPath = `./src/web-component/registerButton.tsx`;

    console.log(`🛠️ Building Web Component: ${entryName}`);
    console.log(`📂 Entry file: ${entryPath}`);
    // entry = {
    //   [entryName]: entryPath,
    // };
    entry = entryPath;
    output = {
      path: path.resolve(__dirname, 'project-player-dist'),
      filename: '[name].js',
      publicPath: '/',
    };
  }

  return {
    entry,
    output,
    mode,
    devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      },
      compress: true,
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude:
            /node_modules\/(?!(@react-navigation|react-native-reanimated|react-native-safe-area-context|@gluestack-ui|@gluestack-style|@expo))/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: ['react-native-web'],
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images/',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        // Mock native modules that don't work on web
        'react-native-image-picker': path.resolve(
          __dirname,
          'src/mocks/imagePicker.js',
        ),
        '@react-native-community/netinfo': path.resolve(
          __dirname,
          'src/mocks/netinfo.js',
        ),
        'react-native-reanimated': path.resolve(
          __dirname,
          'src/mocks/reanimated',
        ),
        '@ui': path.resolve(__dirname, 'src/components/ui'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@layout': path.resolve(__dirname, 'src/layout'),
      },
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.json',
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(mode !== 'production'),
      }),
      // 🧠 Ignore native-only modules entirely
      new webpack.IgnorePlugin({
        resourceRegExp: /^react-native-(gesture-handler|screens)$/,
      }),
    ],
  };
};
