import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import type { RsbuildConfig } from '@rsbuild/core';

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
  tools: {
    bundlerChain: (chain, utils) => {
      const env = process.env;
      const envKeys = Object.keys(env).filter((key) => key.startsWith('VITE_'));
      
      envKeys.forEach((key) => {
        const definePluginArgs = chain.plugin('define').get('args');
        if (definePluginArgs && definePluginArgs[0]) {
          definePluginArgs[0][`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
      });
    },
  },
  server: {
    // 代理配置已移除，前端直接请求后端地址
  },
});
