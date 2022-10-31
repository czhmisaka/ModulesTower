/*
 * @Date: 2022-10-31 08:52:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-31 09:18:45
 * @FilePath: /configforpagedemo-toVite/vite.config.js
 */
import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import requireTransform from 'vite-plugin-require-transform';
import envCompatible from 'vite-plugin-env-compatible';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: ''
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ],
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue'
    ]
  },
  plugins: [
    vue(),
    vueJsx(),
    ViteRequireContext(),
    viteCommonjs(),
    envCompatible(),
    requireTransform({
      fileRegex:/.ts$|.tsx$|.vue$/
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'configForDesktopPage'
        }
      }
    })
  ],
  server: {
    strictPort: false,
    port: 9050,
    proxy: {
      '/api': {
        name: 'dev',
        target: 'http://127.0.0.1:8010/',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/')
      }
    }
  },
  build: {}
})
