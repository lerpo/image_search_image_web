import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // visualizer(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    pure: ["console.log", "debugger"],
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks: {
          // 将 React 相关库打包成单独的 chunk 中
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // 将 Lodash 库的代码单独打包
          lodash: ["lodash"],
          axios: ["axios"]
        },
      },
    },
  },
  /*
   * 当你的开发环境需要处理跨域时，你可以使用 proxy 选项来配置一个代理。
   * @param port 前端项目启动服务端口
   * @param target 代理目标地址
   */
  server: {
    host: "0.0.0.0",
    port: 3001,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        // target: "http://192.168.15.133:8001",
        // target: "http://192.168.15.125:8001",
        // target: "http://192.168.20.135:8001",
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/jdchat": {
        target: "https://eai.ezretailpro.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jdchat/, ""),
      },
    },
  },
});
