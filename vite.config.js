/*
 * @Date: 2022-10-31 08:52:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-02 15:35:42
 * @FilePath: /configforpagedemo/vite.config.js
 */
import {
  defineConfig,
  loadEnv
} from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteRequireContext from '@originjs/vite-plugin-require-context';
import requireTransform from 'vite-plugin-require-transform';
import envCompatible from 'vite-plugin-env-compatible';
import {
  createHtmlPlugin
} from 'vite-plugin-html';
import {
  viteCommonjs
} from '@originjs/vite-plugin-commonjs';

// 配置参考
// https://vitejs.dev/config/
export default defineConfig(({
  mode
}) => {
  const env = loadEnv(mode, process.cwd(), '')
  let url_pre = '/';
  url_pre = env.VITE_APP_BUILDPREFIX;

  return {
    resolve: {
      alias: [{
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
        fileRegex: /.ts$|.tsx$|.vue$/
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
    base: url_pre,
  }
})