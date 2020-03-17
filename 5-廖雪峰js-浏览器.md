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

# Promise

# Canvas

