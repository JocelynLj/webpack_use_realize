// 将$变成全局变量
// 方法: expose-loader?全局变量名!模块名 它会先加载此模块，然后得到模块的导出对象，并挂载到window上

// let $ = require('expose-loader?$!jquery');
let $ = require('jquery');
$("#root").html('root');
require('./i2');

// 加载css代码
// css不是js模块，需要用loader来进行转换
require('style-loader!css-loader!./index.css');