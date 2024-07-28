// vite.config.js
import path from 'path';
export default {
  // 配置選項
  base: './',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  publicDir: '../public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
