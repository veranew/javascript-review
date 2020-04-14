'use strict';

var fs = require('fs');

fs.readFile('hello.js', 'utf-8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})
fs.readFile('pic.jpg', (err,data) => {
  if(err) {
    console.log(err)
  } else {
    console.log(data)
    console.log(data.length + ' bytes')
    console.log(' ');
    var text = data.toString('utf-8');
    console.log(text) // 一堆问号乱码
    var buf = Buffer.from(text, 'utf-8');
    console.log(buf); // 转换回来正常
  }
})