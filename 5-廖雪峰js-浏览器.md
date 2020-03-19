# 浏览器对象

## window

`window`对象不但充当全局作用域，而且表示浏览器窗口。

`window`对象有`innerWidth`和`innerHeight`属性，可以获取浏览器窗口的内部宽度和高度。内部宽高是指除去菜单栏、工具栏、边框等占位元素后，用于显示网页的净宽高。

## navigator

`navigator`对象表示浏览器的信息，最常用的属性包括：

- `navigator.appName`：浏览器名称；
- `navigator.appVersion`：浏览器版本；
- `navigator.language`：浏览器设置的语言；
- `navigator.platform`：操作系统类型；
- `navigator.userAgent`：浏览器设定的`User-Agent`字符串。

*请注意*，`navigator`的信息可以很容易地被用户修改，所以JavaScript读取的值不一定是正确的。很多初学者为了针对不同浏览器编写不同的代码，喜欢用`if`判断浏览器版本，例如：

```js
var width;
if (getIEVersion(navigator.userAgent) < 9) {
    width = document.body.clientWidth;
} else {
    width = window.innerWidth;
}
```

但这样既可能判断不准确，也很难维护代码。正确的方法是充分利用JavaScript对不存在属性返回`undefined`的特性，直接用短路运算符`||`计算：

```js
var width = window.innerWidth || document.body.clientWidth;
```

## screen

`screen`对象表示屏幕的信息，常用的属性有：

- `screen.width`：屏幕宽度，以像素为单位；
- `screen.height`：屏幕高度，以像素为单位；
- `screen.colorDepth`：返回颜色位数，如8、16、24。

## location

`location`对象表示当前页面的URL信息。例如，一个完整的URL：

```js
http://www.example.com:8080/path/index.html?a=1&b=2#TOP
```

可以用`location.href`获取。要获得URL各个部分的值，可以这么写：

```js
location.protocol; // 'http'
location.host; // 'www.example.com'
location.port; // '8080'
location.pathname; // '/path/index.html'
location.search; // '?a=1&b=2'
location.hash; // 'TOP'
```

要加载一个新页面，可以调用`location.assign()`。如果要重新加载当前页面，调用`location.reload()`方法非常方便。

## document

`document`对象还有一个`cookie`属性，可以获取当前页面的Cookie。

Cookie是由服务器发送的key-value标示符。因为HTTP协议是无状态的，但是服务器要区分到底是哪个用户发过来的请求，就可以用Cookie来区分。当一个用户成功登录后，服务器发送一个Cookie给浏览器，例如`user=ABC123XYZ(加密的字符串)...`，此后，浏览器访问该网站时，会在请求头附上这个Cookie，服务器根据Cookie即可区分出用户。

由于JavaScript能读取到页面的Cookie，而用户的登录信息通常也存在Cookie中，这就造成了巨大的安全隐患，这是因为在HTML页面中引入第三方的JavaScript代码是允许的：

```html
<!-- 当前页面在wwwexample.com -->
<html>
    <head>
        <script src="http://www.foo.com/jquery.js"></script>
    </head>
    ...
</html>
```

如果引入的第三方的JavaScript中存在恶意代码，则`www.foo.com`网站将直接获取到`www.example.com`网站的用户登录信息。

为了解决这个问题，服务器在设置Cookie时可以使用`httpOnly`，设定了`httpOnly`的Cookie将不能被JavaScript读取。这个行为由浏览器实现，主流浏览器均支持`httpOnly`选项，IE从IE6 SP1开始支持。

为了确保安全，服务器端在设置Cookie时，应该始终坚持使用`httpOnly`。

## history

任何情况，你都不应该使用`history`这个对象了。

# 操作DOM

## 更新DOM

* `innerHTML`

  用`innerHTML`时要注意，是否需要写入HTML。如果写入的字符串是通过网络拿到了，要注意对字符编码来避免XSS攻击。

* `innerText`

  修改`innerText`或`textContent`属性，这样可以自动对字符串进行HTML编码，保证无法设置任何HTML标签

  两者的区别在于读取属性时，`innerText`不返回隐藏元素的文本，而`textContent`返回所有文本。另外注意IE<9不支持`textContent`。

## 插入DOM

`appendChild`

`insertBefore`

对于一个已有的HTML结构：

```html
<!-- HTML结构 -->
<ol id="test-list">
    <li class="lang">Scheme</li>
    <li class="lang">JavaScript</li>
    <li class="lang">Python</li>
    <li class="lang">Ruby</li>
    <li class="lang">Haskell</li>
</ol>
```

按字符串顺序重新排序DOM节点：

```js
/* 第一种解法：
* 利用insertBefore方法进行插入   较小的插入到较大的前面
* */
var new_list = document.getElementById('test-list');
var new_list_child = document.getElementsByClassName('lang');
for(var i=0;i<new_list_child.length;i++){
　　for(var j = i+1;j<new_list_child.length;j++){
　　　　if(new_list_child[i].innerText > new_list_child[j].innerText){
　　　　　　new_list.insertBefore(new_list_child[j],new_list_child[i])
		}
	}
}
/* 第二种解法：
* 通过 Array.protptype.slice.call().sort()  转换数组 进行排序  forEach循环遍历进行重新添加节点
*/
var new_list = document.getElementById('test-list');
var new_list_child = new_list.children;
new_list_child = Array.prototype.slice.call(new_list_child).sort(function(a,b){
　　return a.innerHTML > b.innerHTML?1:-1;　　
})
new_list_child.forEach(function(el){
　　new_list.appendChild(el);
})
```



## 删除DOM

`removeChild`

# 操作表单

form提交

# 操作文件

在HTML表单中，可以上传文件的唯一控件就是`<input type="file">`。

*注意*：当一个表单包含`<input type="file">`时，表单的`enctype`必须指定为`multipart/form-data`，`method`必须指定为`post`，浏览器才能正确编码并以`multipart/form-data`格式发送表单的数据。

```js
var f = document.getElementById('test-file-upload');
var filename = f.value; // 'C:\fakepath\test.png'
if (!filename || !(filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.gif'))) {
    alert('Can only upload image file.');
    return false;
}
```

HTML5的File API提供了`File`和`FileReader`两个主要对象，可以获得文件信息并读取文件。

```js
var
    fileInput = document.getElementById('test-image-file'),
    info = document.getElementById('test-file-info'),
    preview = document.getElementById('test-image-preview');
// 监听change事件:
fileInput.addEventListener('change', function () {
    // 清除背景图片:
    preview.style.backgroundImage = '';
    // 检查文件是否选择:
    if (!fileInput.value) {
        info.innerHTML = '没有选择文件';
        return;
    }
    // 获取File引用:
    var file = fileInput.files[0];
    // 获取File信息:
    info.innerHTML = '文件: ' + file.name + '<br>' +
                     '大小: ' + file.size + '<br>' +
                     '修改: ' + file.lastModifiedDate;
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        alert('不是有效的图片文件!');
        return;
    }
    // 读取文件:
    var reader = new FileReader();
    reader.onload = function(e) {
        var
            data = e.target.result; // 'data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...'            
        preview.style.backgroundImage = 'url(' + data + ')';
    };
    // 以DataURL的形式读取文件:
    reader.readAsDataURL(file);
});
```

上面的代码演示了如何通过HTML5的File API读取文件内容。以DataURL的形式读取到的文件是一个字符串，类似于`data:image/jpeg;base64,/9j/4AAQSk...(base64编码)...`，常用于设置图像。如果需要服务器端处理，把字符串`base64,`后面的字符发送给服务器并用Base64解码就可以得到原始文件的二进制内容。

## 回调

上面的代码还演示了JavaScript的一个重要的特性就是单线程执行模式。在JavaScript中，浏览器的JavaScript执行引擎在执行JavaScript代码时，总是以单线程模式执行，也就是说，任何时候，JavaScript代码都不可能同时有多于1个线程在执行。

你可能会问，单线程模式执行的JavaScript，如何处理多任务？

在JavaScript中，执行多任务实际上都是异步调用，比如上面的代码：

```js
reader.readAsDataURL(file);
```

就会发起一个异步操作来读取文件内容。因为是异步操作，所以我们在JavaScript代码中就不知道什么时候操作结束，因此需要先设置一个回调函数：

```js
reader.onload = function(e) {
    // 当文件读取完成后，自动调用此函数:
};
```

当文件读取完成后，JavaScript引擎将自动调用我们设置的回调函数。执行回调函数时，文件已经读取完毕，所以我们可以在回调函数内部安全地获得文件内容。

# AJAX

在现代浏览器上写AJAX主要依靠`XMLHttpRequest`对象：

```js
function success(text) {
    var textarea = document.getElementById('test-response-text');
    textarea.value = text;
}

function fail(code) {
    var textarea = document.getElementById('test-response-text');
    textarea.value = 'Error code: ' + code;
}

var request = new XMLHttpRequest(); // 新建XMLHttpRequest对象

request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
        // 判断响应结果:
        if (request.status === 200) {
            // 成功，通过responseText拿到响应的文本:
            return success(request.responseText);
        } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
    } else {
        // HTTP请求还在继续...
    }
}

// 发送请求:
request.open('GET', '/api/categories');
request.send();

alert('请求已发送，请等待响应...');

```

对于低版本的IE，需要换一个`ActiveXObject`对象：

```js
function success(text) {
    var textarea = document.getElementById('test-ie-response-text');
    textarea.value = text;
}

function fail(code) {
    var textarea = document.getElementById('test-ie-response-text');
    textarea.value = 'Error code: ' + code;
}

var request = new ActiveXObject('Microsoft.XMLHTTP'); // 新建Microsoft.XMLHTTP对象

request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
        // 判断响应结果:
        if (request.status === 200) {
            // 成功，通过responseText拿到响应的文本:
            return success(request.responseText);
        } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
    } else {
        // HTTP请求还在继续...
    }
}

// 发送请求:
request.open('GET', '/api/categories');
request.send();

alert('请求已发送，请等待响应...');

```

如果你想把标准写法和IE写法混在一起，可以这么写：

```js
var request;
if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
} else {
    request = new ActiveXObject('Microsoft.XMLHTTP');
}
```

通过检测`window`对象是否有`XMLHttpRequest`属性来确定浏览器是否支持标准的`XMLHttpRequest`。注意，*不要*根据浏览器的`navigator.userAgent`来检测浏览器是否支持某个JavaScript特性，一是因为这个字符串本身可以伪造，二是通过IE版本判断JavaScript特性将非常复杂。

当创建了`XMLHttpRequest`对象后，要先设置`onreadystatechange`的回调函数。在回调函数中，通常我们只需通过`readyState === 4`判断请求是否完成，如果已完成，再根据`status === 200`判断是否是一个成功的响应。

`XMLHttpRequest`对象的`open()`方法有3个参数，第一个参数指定是`GET`还是`POST`，第二个参数指定URL地址，第三个参数指定是否使用异步，默认是`true`，所以不用写。

*注意*，千万不要把第三个参数指定为`false`，否则浏览器将停止响应，直到AJAX请求完成。如果这个请求耗时10秒，那么10秒内你会发现浏览器处于“假死”状态。

最后调用`send()`方法才真正发送请求。`GET`请求不需要参数，`POST`请求需要把body部分以字符串或者`FormData`对象传进去。

## 安全限制

那是不是用JavaScript无法请求外域（就是其他网站）的URL了呢？方法还是有的，大概有这么几种：

一是通过Flash插件发送HTTP请求，这种方式可以绕过浏览器的安全限制，但必须安装Flash，并且跟Flash交互。不过Flash用起来麻烦，而且现在用得也越来越少了。

二是通过在同源域名下架设一个代理服务器来转发，JavaScript负责把请求发送到代理服务器：

```html
'/proxy?url=http://www.sina.com.cn'
```

代理服务器再把结果返回，这样就遵守了浏览器的同源策略。这种方式麻烦之处在于需要服务器端额外做开发。

第三种方式称为JSONP，它有个限制，只能用GET请求，并且要求返回JavaScript。这种方式跨域实际上是利用了浏览器允许跨域引用JavaScript资源：

```html
<html>
<head>
    <script src="http://example.com/abc.js"></script>
    ...
</head>
<body>
...
</body>
</html>
```

JSONP通常以函数调用的形式返回，例如，返回JavaScript内容如下：

```js
foo('data');
```

这样一来，我们如果在页面中先准备好`foo()`函数，然后给页面动态加一个`<script>`节点，相当于动态读取外域的JavaScript资源，最后就等着接收回调了。

以163的股票查询URL为例，对于URL：http://api.money.126.net/data/feed/0000001,1399001?callback=refreshPrice，你将得到如下返回：

```
refreshPrice({"0000001":{"code": "0000001", ... });
```

因此我们需要首先在页面中准备好回调函数：

```js
function refreshPrice(data) {
    var p = document.getElementById('test-jsonp');
    p.innerHTML = '当前价格：' +
        data['0000001'].name +': ' + 
        data['0000001'].price + '；' +
        data['1399001'].name + ': ' +
        data['1399001'].price;
}
```

当前价格：上证指数: 2779.64；深证成指: 10202.753

最后用`getPrice()`函数触发：

```js
function getPrice() {
    var
        js = document.createElement('script'),
        head = document.getElementsByTagName('head')[0];
    js.src = 'http://api.money.126.net/data/feed/0000001,1399001?callback=refreshPrice';
    head.appendChild(js);
}
```

## CORS（==需再深入理解==）

CORS全称Cross-Origin Resource Sharing，是HTML5规范定义的如何跨域访问资源。

了解CORS前，我们先搞明白概念：

Origin表示本域，也就是浏览器当前页面的域。当JavaScript向外域（如sina.com）发起请求后，浏览器收到响应后，首先检查`Access-Control-Allow-Origin`是否包含本域，如果是，则此次跨域请求成功，如果不是，则请求失败，JavaScript将无法获取到响应的任何数据。

跨域能否成功，取决于对方服务器是否愿意给你设置一个正确的`Access-Control-Allow-Origin`，决定权始终在对方手中。

上面这种跨域请求，称之为“简单请求”。简单请求包括GET、HEAD和POST（POST的Content-Type类型 仅限`application/x-www-form-urlencoded`、`multipart/form-data`和`text/plain`），并且不能出现任何自定义头（例如，`X-Custom: 12345`），通常能满足90%的需求。

对于PUT、DELETE以及其他类型如`application/json`的POST请求，在发送AJAX请求之前，浏览器会先发送一个`OPTIONS`请求（称为preflighted请求）到这个URL上，询问目标服务器是否接受：

```js
OPTIONS /path/to/resource HTTP/1.1
Host: bar.com
Origin: http://my.com
Access-Control-Request-Method: POST
```

服务器必须响应并明确指出允许的Method：

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://my.com
Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS
Access-Control-Max-Age: 86400
```

浏览器确认服务器响应的`Access-Control-Allow-Methods`头确实包含将要发送的AJAX请求的Method，才会继续发送AJAX，否则，抛出一个错误。

由于以`POST`、`PUT`方式传送JSON格式的数据在REST中很常见，所以要跨域正确处理`POST`和`PUT`请求，服务器端必须正确响应`OPTIONS`请求。

# Promise（==需再深入理解==）

`setTimeout`可以看成一个模拟网络等异步执行的函数。

# Canvas

```html
<!-- HTML代码 -->
<canvas id="test-canvas" width="200" heigth="100">
    <p>你的浏览器不支持Canvas</p>
</canvas>
```

`getContext('2d')`方法让我们拿到一个`CanvasRenderingContext2D`对象，所有的绘图操作都需要通过这个对象完成。

```js
var ctx = canvas.getContext('2d');
```

如果需要绘制3D怎么办？HTML5还有一个WebGL规范，允许在Canvas中绘制3D图形：

```js
gl = canvas.getContext("webgl");
```

![canvas-xy](https://www.liaoxuefeng.com/files/attachments/1028111602807456/l)

Canvas的坐标以左上角为原点，水平向右为X轴，垂直向下为Y轴，以像素为单位，所以每个点都是非负整数。

## 绘制矩形

![img](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAFBklEQVR4Xu2b0WpbMRAFnS9v++UtF+JSTA3nRB5FXiZPKUi70pzxXhN6P27+SAAg8AHUtKQEboqlBAgBxUKwWlSxdAAhoFgIVosqlg4gBBQLwWpRxdIBhIBiIVgtqlg6gBBQLASrRRVLBxACioVgtahi6QBCQLEQrBZVLB1ACCgWgtWiiqUDCAHFQrBaVLF0ACGgWAhWiyqWDiAEFAvBalHF0gGEwC6xfiOnt+hXCeC54w0+b65YX1WA2YfnjjdQLMaMxap47ngDxVpUgNmO5443UCzGjMWqeO54A8VaVIDZjueON1AsxozFqnjueAPFWlSA2Y7njjdQLMaMxap47ngDxVpUgNmO5443UCzGjMWqeO54A8VaVIDZjueON1AsxozFqnjueAPFWlSA2Y7njjdQLMaMxap47ngDxVpUgNmO5443UCzGjMWqeO54A8VaVIDZjueON1AsxozFqnjueAPFWlSA2Y7njjeAxNp1bibWvuqr/2s3zg9voFi9Rf/ZoVhPML4dmJfo8Loib8fPifW68MlKivVNE+snmeo31H68j2Ip1ks0VKwQI/2Juwfx7pPr2T1ofmGM+bIp37EUK8/8WonnjjfY9OcGxVKsjsCT1Y8fCMXqsOIDBW/gxKoS9ztWhet2o798OrG6QPCBgjdwYlWJO7EqXE6sFJdipaScWBUpxapwObFSXIqVknJiVaQUq8LlxEpxKVZKyolVkVKsCpcTK8WlWCkpJ1ZFSrEqXE6sFJdipaScWBUpxapwObFSXIqVknJiVaQUq8LlxEpxKVZKyolVkVKsCpcTK8WlWCkpJ1ZFSrEqXE6sFJdipaScWBUpxapwObFSXD8+3/nzTeiQmC9TZKAuoS5Wvx6W0/yy0xWrfJmigLVhqY/CEjL9iZvy+pePQsUqCWTLfRRmnP6ucmJlwHwUZpwUq+Tko7AE5sTKgDmxMk5OrJKTYpXAnFgZMB+FGScnVsnJiVUCc2JlwBQr4+TEKjkpVgnMiZUB8ztWxsmJVXLyL+8lMCdWBsxHYcbJiVVy8lFYAnNiZcAUK+PkxCo5+SgsgTmxMmBOrIyTE6vkpFglMCdWBsxHYcbJiVVyuibW9ePLFCG4XRPr6nO9IHLv9/j7ddz7mvvR//138nt45aVlvv4V4tst1rNjPUqVrEv3hCiiZYoVYeJfWA2P8bbL6A/my8FMea/w5WAOK6hYTwJ5OzCKtUbAibXGb9fut/tgvqtYuwKd2gfPHW/wmcyrP3FTA991Lzx3vIFi7XKl6oPnjjdQrCrwXYvx3PEGirXLlaoPnjveQLGqwHctxnPHGyjWLleqPnjueAPFqgLftRjPHW+gWLtcqfrgueMNFKsKfNdiPHe8gWLtcqXqg+eON1CsKvBdi/Hc8QaKtcuVqg+eO95AsarAdy3Gc8cbKNYuV6o+eO54A8WqAt+1GM8db6BYu1yp+uC54w0Uqwp812I8d7yBYu1ypeqD5443UKwq8F2L8dzxBrtI2ecsAop1Vh5jTqNYY6I86yKKdVYeY06jWGOiPOsiinVWHmNOo1hjojzrIop1Vh5jTqNYY6I86yKKdVYeY06jWGOiPOsiinVWHmNOo1hjojzrIop1Vh5jTqNYY6I86yKKdVYeY06jWGOiPOsiinVWHmNOo1hjojzrIop1Vh5jTqNYY6I86yKKdVYeY06jWGOiPOsiinVWHmNOo1hjojzrIn8A6lcTpnBsMJUAAAAASUVORK5CYII=)

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
}
```

## 绘制路径

```
beginPath()
```

新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

```
closePath()
```

闭合路径之后图形绘制命令又重新指向到上下文中。

```
stroke()
```

通过线条来绘制图形轮廓。

```
fill()
```

通过填充路径的内容区域生成实心的图形。

**注意：当前路径为空，即调用beginPath()之后，或者canvas刚建的时候，第一条路径构造命令通常被视为是moveTo（），无论实际上是什么。出于这个原因，你几乎总是要在设置路径之后专门指定你的起始位置。**

## 绘制一个三角形

![img](https://mdn.mozillademos.org/files/9847/triangle.png)

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }
}
```



## 移动笔触

![img](https://mdn.mozillademos.org/files/252/Canvas_smiley.png)



```js
function draw() {
 var canvas = document.getElementById('canvas');
 if (canvas.getContext){
 var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(75,75,50,0,Math.PI*2,true); // 绘制
    ctx.moveTo(110,75);
    ctx.arc(75,75,35,0,Math.PI,false);   // 口(顺时针)
    ctx.moveTo(65,65);
    ctx.arc(60,65,5,0,Math.PI*2,true);  // 左眼
    ctx.moveTo(95,65);
    ctx.arc(90,65,5,0,Math.PI*2,true);  // 右眼
    ctx.stroke();
 }
}
```

## 圆弧

![img](https://mdn.mozillademos.org/files/204/Canvas_arc.png)



```js
function draw() {
 var canvas = document.getElementById('canvas');
 if (canvas.getContext){
 var ctx = canvas.getContext('2d');

 for(var i=0;i<4;i++){
 for(var j=0;j<3;j++){
 ctx.beginPath();
 var x = 25+j*50; // x 坐标值
 var y = 25+i*50; // y 坐标值
 var radius = 20; // 圆弧半径
 var startAngle = 0; // 开始点
 var endAngle = Math.PI+(Math.PI*j)/2; // 结束点
 var anticlockwise = i%2==0 ? false : true; // 顺时针或逆时针

 ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

 if (i>1){
 ctx.fill();
 } else {
 ctx.stroke();
 }
 }
 }
 }
}
```

### 补充（弧度与角度）

![img](http://c.biancheng.net/uploads/allimg/180806/1-1PP6164113221.jpg)

根据定义，圆一周的弧度数为 2πr/r = 2π，360° = 2πrad，平角（即 180° 角）为 πrad，直角为 π/2rad。

在具体计算中，角度以弧度给出时，通常不写弧度单位，直接写值。最典型的例子是三角函数，例如sin(8π)、tan(3π/2)。

## 二次贝塞尔曲线及三次贝塞尔曲线

```js
quadraticCurveTo(cp1x, cp1y, x, y)
```

绘制二次贝塞尔曲线，`cp1x,cp1y`为一个控制点，`x,y为`结束点。

```js
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
```

绘制三次贝塞尔曲线，`cp1x,cp1y`为控制点一，`cp2x,cp2y`为控制点二，`x,y`为结束点。

**canvas内容太多了，还是先不继续了，先过完一遍js，回头再细研究**





















