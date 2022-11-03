/*
 * @Date: 2022-10-31 08:52:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-03 16:33:04
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

/** 当前执行node命令时文件夹的地址（工作目录） */
const root = process.cwd();

/** 路径查找 */
const pathResolve = (dir) => {
  return path.resolve(__dirname, ".", dir);
};


// 配置参考
// https://vitejs.dev/config/
export default defineConfig(({
  mode
}) => {
  const env = loadEnv(mode, process.cwd(), '')
  let url_pre = '/';
  url_pre = env.VITE_APP_BUILDPREFIX;

  return {
    base: url_pre,
    root,
    resolve: {
      alias: [{
        find: "@",
        replacement: pathResolve('src')
      }, {
        find: "@build",
        replacement: pathResolve("build")
      }],
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
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    server: {
      strictPort: false,
      port: 9050,
      proxy: {
        '/api/': {
          name: 'dev',
          target: 'http://127.0.0.1:8010/',
          changeOrigin: true,
          ws: true,
          // rewrite: (path) => path.replace(/^\/api/, '/')
        }
      }
    },
  }
})