const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
      '/api':{
        target:'http://localhost:9131',
        changeOrigin:true,
        pathRewrite: {                    // 路径重写规则
          '^/api': ''                   // 将 /api 替换为空字符串
        },
        ws:true
      }
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        "assert": require.resolve("assert/"),
        "path": require.resolve("path-browserify")
      }
    }
  }
})
