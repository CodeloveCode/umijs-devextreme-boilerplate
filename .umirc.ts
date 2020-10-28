import { defineConfig } from 'umi';

const path = require('path');

export default defineConfig({
  mock: false,
  request: {},
  title: 'vskySoft',
  favicon: '/assets/favicon.ico',
  // history: { type: 'hash' },
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: '/', // 可以解决使用BrowserHistory时,刷新报错的问题.
  dva: {},
  antd: {},
  theme: {
    'primary-color': '#ff5722',
  },
  chainWebpack(config) {
    config.module
      .rule('raw-loader')
      .test(/\.html$/i)
      // .exclude
      // .add(['src/.umi', 'node_modules'])
      // .end()
      .use('raw-loader')
      .loader('raw-loader');
  },
  proxy: {
    '/out-website': {
      target: 'http://118.31.184.21:8899/',
      changeOrigin: true,
      pathRewrite: { '^/out-website': '' },
    },
    '/bbb': {
      target: 'https://www.baidu.com/',
      changeOrigin: true,
      pathRewrite: { '^/bbb': '' },
    },
    '/api/v1': {
      target: 'http://118.31.184.21:9009/',
      changeOrigin: true,
      pathRewrite: { '^/api/v1': '' },
    },
  },
});
