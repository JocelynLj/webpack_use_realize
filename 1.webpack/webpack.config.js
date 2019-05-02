// webpack内部有一个事件流，tapable 1.0

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    // entry可以为数组、字符串、对象（多入口）
    // 先找到每个入口(entry),然后从各个入口分别出发，找到依赖的模块（Module）,
    // 然后生成一个Chunk(代码块)，最后会把Chunk写到文件系统中(Assets)
    entry: {
        index: './src/index.js',
        base: './src/base.js',
        // 第三方库，引入jquery
        vendor: 'jquery',
        common: './src/common.js'
    },//入口
    output: {
        path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径
        // name是entry名字main,hash根据打包后的文件内容计算出的hash值
        filename: '[name].[hash:8].js'//打包后的文件名
    },
    /*
        loader有三种写法：
        1、loader
        2、use
        3、use+loader
    */
    module: {
        rules: [
            {
                // test: /^jquery$/,
                test: require.resolve('jquery'),
                loader: 'expose-loader?$'
                // use: {
                //     loader: 'expose-loader',
                //     options: '$'
                // }
            }
            // {
            //     test: /\.css$/,//转换文件的匹配正则
            //     // css-loader用来解析处理css文件中的url路径
            //     // style-loader 可以把css文件变成style标签插入head中
            //     // 转换从右往左进行
            //     loader: ["style-loader", "css-loader"]
            // }
        ]
    },//模块配置
    plugins: [
        // 用来自动向模块内部注入变量
        // new webpack.ProvidePlugin({
        //     $: 'jquery'
        // }),
        new CleanWebpackPlugin(),
        //此插件可以自动产出html文件
        new HtmlWebpackPlugin({
            template: './src/index.html',// 指向产出的html模板
            filename: 'index.html',// 产出的html文件名
            title: 'index',
            chunks: ['vendor', 'index', 'common'],// 会在产出的html文件中引入哪些代码块
            hash: true,// 会在引入的js里加入查询字符串避免缓存
            minify: {
                removeAttributeQuotes: true
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',// 指向产出的html模板
            filename: 'base.html',// 产出的html文件名
            title: 'base',
            chunks: ['vendor', 'base', 'common'],
            hash: true,// 会在引入的js里加入查询字符串避免缓存
            minify: {
                removeAttributeQuotes: true
            }
        }),
    ],//插件的配置
    // 配置此静态服务器，可以用来预览打包后项目
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8080,
        compress: true,// 服务器返回给浏览器的时候是否启动gzip压缩
    },//开发服务器
    mode: 'development',//可以更改模式
    resolve: {

    }//配置解析
}