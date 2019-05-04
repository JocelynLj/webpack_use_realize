import color from './color';
require('./index.css');
require('./less.less');
require('./sass.scss');
require('bootstrap/dist/css/bootstrap.css');
// 会返回一个打包后的地址

let src = require('./images/Koala.jpg');

let img = new Image();
img.src = src;
document.body.appendChild(img);
console.log(color);

let getColor = () => {
    return color;
}