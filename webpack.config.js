const path = require("path"); // 引入node内置模块path
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 构建html文件
const VueLoaderPlugin = require("vue-loader/lib/plugin-webpack5");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 清理构建目录下的文件
const ProgressBarWebpackPlugin = require("progress-bar-webpack-plugin"); // 设置打包进度条
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // webpack4以后 改为此插件 css样式分离
const Dotenv = require("dotenv-webpack"); // 支持程序获取.env配置的环境变量
const { EsbuildPlugin } = require("esbuild-loader");
const webpack = require("webpack");

module.exports = {
  cache: process.env.NODE_ENV === "production" ? false : true,
  mode: process.env.NODE_ENV === "production" ? "production" : "development", // 开发模式
  stats: "errors-only", // 日志打印只打印错误
  devServer: {
    open: false, // 自动打开浏览器
    hot: process.env.NODE_ENV === "production" ? false : true, // 热更新打开
    host: "localhost",
    port: "8899", // 端口：8888
    client: {
      overlay: false,
    },
    proxy: {},
  },
  entry: {
    app: {
      import: "./src/main.js",
    },
  },
  output: {
    // 出口文件
    path: path.resolve(__dirname, "dist"), // 出口路径和目录
    filename: "js/[name].js", // 编译后的名称
    clean: true,
    chunkFilename: "js/[name][id].js",
    asyncChunks: true,
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".vue"], // 引入路径是不用写对应的后缀名
    alias: {
      jsxFactory: path.resolve(__dirname, "./src/jsxFactory/index.js"),
      vue$: "vue/dist/vue.esm.js", // 正在使用的是vue的运行时版本，而此版本中的编译器时不可用的，我们需要把它切换成运行时 + 编译的版本
      "@": path.resolve(__dirname, "./src"), // 用@直接指引到src目录下
    },
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  optimization: {
    nodeEnv: false,
    splitChunks: {
      chunks: "all",
      minChunks: 1, //拆分前必须共享模块的最小 chunks 数。
      minSize: 0,
      cacheGroups: {
        vueLib: {
          minChunks: 1,
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|axios|vuex-persistedstate)[\\/]/,
          name: "vueLib",
          chunks: "all",
        },
      },
    },
    minimizer: [
      new EsbuildPlugin({
        target: "es2015", // Syntax to compile to (see options below for possible values)
        css: true,
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 自动插入到dist目录中
      title: process.env.VUE_APP_TITLE,
      template: "public/index.html",
      // favicon: path.resolve(__dirname, `dist/eGreatWall.ico`), //配置网站图标
      inject: "body",
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      Vue: ["vue/dist/vue.esm.js", "default"],
    }),
    process.env.NODE_ENV === "production" && new CleanWebpackPlugin(),
    new ProgressBarWebpackPlugin({
      complete: "█",
      clear: true,
    }),
    new MiniCssExtractPlugin({
      filename:
        process.env.NODE_ENV === "production"
          ? "css/[name].[contenthash].css"
          : "css/[name].css",
      chunkFilename:
        process.env.NODE_ENV === "production"
          ? "css/[name].[contenthash].css"
          : "css/[name].css",
    }),
    new Dotenv({
      path: path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`),
    }),
    new webpack.ProvidePlugin({
      jsxFactory: ["jsxFactory", "default"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "vue-style-loader",
          "css-loader",
        ],
      },
      {
        test: /.less$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "esbuild-loader",
        options: {
          loader: "jsx",
          jsx: "transform",
          jsxFactory: "jsxFactory",
          target: "es2015",
        },
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
};
