const {defineConfig} = require('@vue/cli-service')
const path = require("path")

module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port: 7777
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "pages": path.resolve(__dirname, "src/pages")
      }
    },
  },
  chainWebpack: config => {
    config.plugin("html")
      .tap(args => {
        args[0].title = "后台管理系统"
        return args;
      })
  }
})
