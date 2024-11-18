const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/gra':{
        target: 'http://192.168.1.2:9876',
        changeOrigin: true, //是否跨域
        pathRewrite: { '^/gra': '' }
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, //是否跨域
        pathRewrite: { '^/api': '' }
      },
    },
  },
})