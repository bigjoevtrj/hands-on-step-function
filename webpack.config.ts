import * as path from 'path';

import glob from 'glob';

const webpackConfig = {
  entry: {
    ...glob.sync("src/**/*.ts").reduce((prev: any, curr: string) => {   
      if (!curr.includes('.spec')) {
        prev[curr.replace(/\.ts$/, '')] = `./${curr}`;
      }
      return prev;
    }, {}),
  },
  externals: {
    'aws-sdk': 'aws-sdk',
    'mongodb': 'mongodb'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: { "@": path.resolve(__dirname, 'src') }
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
};

export default webpackConfig;

