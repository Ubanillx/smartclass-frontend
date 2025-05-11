import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

export default defineConfig({
  plugins: [pluginVue()],
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
  html: {
    mountId: 'app',
    title: '智云星课',
    favicon: './public/logo.svg',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://10.16.62.100:12345',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
      },
    },
  },
});
