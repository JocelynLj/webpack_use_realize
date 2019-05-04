// webpack内部有一个事件流，tapable 1.0

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let cssExtract = new ExtractTextWebpackPlugin('css/css.css');
let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
let sassExtract = new ExtractTextWebpackPlugin('css/sass.css');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
// 将css文件拉出来单独保存  
// extract-text-webpack-plugin
module.exports = {
    // entry可以为数组、字符串、对象（多入口）
    // 先找到每个入口(entry),然后从各个入口分别出发，找到依赖的模块（Module）,
    // 然后生成一个Chunk(代码块)，最后会把Chunk写到文件系统中(Assets)
    entry: './src/main.js',
    // {
    //     index: './src/index.js',
    //     base: './src/base.js',
    //     // 第三方库，引入jquery
    //     vendor: 'jquery',
    //     common: './src/common.js'
    // },//入口
    output: {
        path: path.join(__dirname, 'dist'),//输出的文件夹，只能是绝对路径
        // name是entry名字main,hash根据打包后的文件内容计算出的hash值
        filename: '[name].[hash:8].js'//打包后的文件名
    },
    // resolve: {
    //     // 文件名不写后缀时的查找顺序
    //     extensions: ["", "js", "less", "json"],
    //     alias: {// 别名
    //         "bootstrap":  "bootstrap/dist/css/bootstrap.css"
    //     }
    // },
    // 监控源文件 源文件改变后重新打包
    // watch: true,
    // watchOptions: {
    //     ignored: /node_modules/,
    //     poll: 1000,// 每秒钟询问的次数
    //     aggregateTimeout: 500
    // },
    // devtool: 'source-map',// 单独文件，可以定位到哪一列出错了
    // devtool: 'cheap-module-source-map',// 单独文件，体积更小，可以定位到哪一行出错了
    devtool: 'eval-source-map',// 不会生成单独文件
    // devtool: 'cheap-module-eval-source-map',// 不会生成单独文件，只定位到哪一行
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
                loader: ['expose-loader?$', 'expose-loader?jQuery']
                // use: {
                //     loader: 'expose-loader',
                //     options: '$'
                // }
            },
            {
                // file-loader是解析图片地址，把图片从源位置拷贝到目标位置并且修改原引用地址
                // 可以处理任意的二进制数据 bootstrap中的字体文件
                // url-loader可以在字符文件比较小的时候，直接内嵌到页面中
                test: /\.(png|jpg|gif|svg|bmp|eot|woff|woff2|ttf)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024,
                        outputPath: 'images/'// 指定文件的输出目录
                    }
                }
            },
            {
                test: /\.css$/,//转换文件的匹配正则
                // css-loader用来解析处理css文件中的url路径
                // style-loader 可以把css文件变成style标签插入head中
                // 转换从右往左进行
                // loader: ["style-loader", "css-loader", 'postcss-loader']
                // 此插件先用css-loader处理一下css文件
                // use: cssExtract.extract({
                //     fallback: 'style-loader',
                //     use: [
                //         {
                //             loader: 'css-loader',
                //             options: {
                //                 url: false,
                //                 minimize: true,
                //                 sourceMap: true
                //             }
                //         }
                //     ]
                // })
                loader: cssExtract.extract({
                    use: ["css-loader"]
                })
            },
            {
                test: /\.less$/,
                // loader: ["style-loader", "css-loader", "less-loader"]
                loader: lessExtract.extract({
                    use: ["css-loader", "less-loader"]
                })
            },
            {
                test: /\.scss$/,
                // loader: ["style-loader", "css-loader", "sass-loader"]
                // loader: sassExtract.extract({
                //     use: ["css-loader", "sass-loader"]
                // })
                loader: sassExtract.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(html|htm)/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            }
        ]
    },//模块配置
    plugins: [
        new UglifyJsWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'public'),
            to: path.join(__dirname, 'dist', 'public')
        }]),
        cssExtract,
        lessExtract,
        sassExtract,
        // 用来自动向模块内部注入变量
        // new webpack.ProvidePlugin({
        //     $: 'jquery'
        // }),
        new CleanWebpackPlugin(),
        //此插件可以自动产出html文件
        new HtmlWebpackPlugin({
            template: './src/index.html',// 指向产出的html模板
            filename: 'index.html',// 产出的html文件名
            title: 'helloworld',
            // chunks: ['vendor', 'index', 'common'],// 会在产出的html文件中引入哪些代码块
            hash: true,// 会在引入的js里加入查询字符串避免缓存
            minify: {
                removeAttributeQuotes: true
            }
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/index.html',// 指向产出的html模板
        //     filename: 'base.html',// 产出的html文件名
        //     title: 'base',
        //     chunks: ['vendor', 'base', 'common'],
        //     hash: true,// 会在引入的js里加入查询字符串避免缓存
        //     minify: {
        //         removeAttributeQuotes: true
        //     }
        // }),
    ],//插件的配置
    // 配置此静态服务器，可以用来预览打包后项目
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8000,
        compress: true,// 服务器返回给浏览器的时候是否启动gzip压缩
    },//开发服务器
    mode: 'development',//可以更改模式
    resolve: {

    }//配置解析
}