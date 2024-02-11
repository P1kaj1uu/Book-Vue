module.exports = ({
  devServer: {
    port: 8017, // 设置本地默认端口
    proxy: { // 设置代理，必须填
      '/api': { // 设置拦截器
        target: 'http://localhost:9099', // 代理的目标地址
        changeOrigin: true, // 是否设置同源
        pathRewrite: { // 路径重写
          '^/api': '/api' // 选择忽略拦截器里面的内容
        }
      }
    }
  }
})
