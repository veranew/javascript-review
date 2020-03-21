# 练习

对于下面的表单：

```
<form id="test-form" action="#0" onsubmit="return false;">
    <p><label>Name: <input name="name"></label></p>
    <p><label>Email: <input name="email"></label></p>
    <p><label>Password: <input name="password" type="password"></label></p>
    <p>Gender: <label><input name="gender" type="radio" value="m" checked> Male</label> <label><input name="gender" type="radio" value="f"> Female</label></p>
    <p><label>City: <select name="city">
    	<option value="BJ" selected>Beijing</option>
    	<option value="SH">Shanghai</option>
    	<option value="CD">Chengdu</option>
    	<option value="XM">Xiamen</option>
    </select></label></p>
    <p><button type="submit">Submit</button></p>
</form>
```

输入值后，用jQuery获取表单的JSON字符串，key和value分别对应每个输入的name和相应的value，例如：`{"name":"Michael","email":...}`

```js
``'use strict'; 
var json = null; 
var json = null;
var obj={};
var form = $("#test-form :input");
var ff=form.filter(function(){
if (this.type==='radio' && !this.checked || this.type==='submit')
    return false;
else
    return true;})
ff.map(function(){
return obj[this.name]=this.value;
})
json=JSON.stringify(obj,null,'  ');

// 结果：
{
  "name": "牛晓林",
  "email": "xiaolin_niu@163.com",
  "password": "567890",
  "gender": "m",
  "city": "BJ"
}
```



 感悟：表单加上name，name和后端的字段匹配上，提交表单也许要容易些。

# 获取DOM信息

`attr()`和`prop()`对于属性`checked`处理有所不同：

```js
var radio = $('#test-radio');
radio.attr('checked'); // 'checked'
radio.prop('checked'); // true
```

`prop()`返回值更合理一些。不过，用`is()`方法判断更好：

```js
var radio = $('#test-radio');
radio.is(':checked'); // true
```

类似的属性还有`selected`，处理时最好用`is(':selected')`。

## 修改DOM结构

* 添加

`append()`

`prepend()`

`after()`

`before()`

# 事件

## 鼠标事件

- click: 鼠标单击时触发；

- dblclick：鼠标双击时触发；

- mouseenter：鼠标进入时触发；

- mouseleave：鼠标移出时触发；

- mousemove：鼠标在DOM内部移动时触发；

- hover：鼠标进入和退出时触发两个函数，相当于mouseenter加上mouseleave。

  

## 键盘事件

键盘事件仅作用在当前焦点的DOM上，通常是`<input>`和`<textarea>`。

- keydown：键盘按下时触发；
- keyup：键盘松开时触发；
- keypress：按一次键后触发。

## 其他事件

- focus：当DOM获得焦点时触发；
- blur：当DOM失去焦点时触发；
- change：当`<input>`、`<select>`或`<textarea>`的内容改变时触发；
- submit：当`<form>`提交时触发；
- ready：当页面被载入并且DOM树完成初始化后触发。

## 事件参数

所有事件都会传入`Event`对象作为参数，可以从`Event`对象上获取到更多的信息：

```js
$(function () {
    $('#testMouseMoveDiv').mousemove(function (e) {
        $('#testMouseMoveSpan').text('pageX = ' + e.pageX + ', pageY = ' + e.pageY);
    });
});
```

## 浏览器安全限制

在浏览器中，有些JavaScript代码只有在用户触发下才能执行，例如，`window.open()`函数：

```js
// 无法弹出新窗口，将被浏览器屏蔽:
$(function () {
    window.open('/');
});
```

这些“敏感代码”只能由用户操作来触发：

```js
var button1 = $('#testPopupButton1');
var button2 = $('#testPopupButton2');

function popupTestWindow() {
    window.open('/');
}

button1.click(function () {
    popupTestWindow();
});

button2.click(function () {
    // 不立刻执行popupTestWindow()，3秒后执行:
    setTimeout(popupTestWindow, 3000);
});
```

当用户点击`button1`时，`click`事件被触发，由于`popupTestWindow()`在`click`事件处理函数内执行，这是浏览器允许的，而`button2`的`click`事件并未立刻执行`popupTestWindow()`，延迟执行的`popupTestWindow()`将被浏览器拦截。

## 练习

绑定合适的事件处理函数，实现以下逻辑：

当用户勾上“全选”时，自动选中所有语言，并把“全选”变成“全不选”；

当用户去掉“全不选”时，自动不选中所有语言；

当用户点击“反选”时，自动把所有语言状态反转（选中的变为未选，未选的变为选中）；

当用户把所有语言都手动勾上时，“全选”被自动勾上，并变为“全不选”；

当用户手动去掉选中至少一种语言时，“全不选”自动被去掉选中，并变为“全选”。

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
        <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
        <script type="text/javascript">
            'use strict';
            function buttonState() {
                var
                    form = $('#test-form'),
                    langs = form.find('[name=lang]'),
                    selectAll = form.find('label.selectAll :checkbox'),
                    selectAllLabel = form.find('label.selectAll span.selectAll'),
                    deselectAllLabel = form.find('label.selectAll span.deselectAll'),
                    invertSelect = form.find('a.invertSelect');

                // 重置初始化状态:
                form.find('*').show().off();
                form.find(':checkbox').prop('checked', false).off();
                deselectAllLabel.hide();
                // 拦截form提交事件:
                form.off().submit(function (e) {
                    e.preventDefault();
                    alert(form.serialize());
                });


                // TODO:绑定事件
                function updateLabel() {
                  let allChecked = langs.filter(':checked').length === langs.length

                  selectAll.prop('checked', allChecked)
                  if (allChecked) {
                    selectAllLabel.hide()
                    deselectAllLabel.show() 
                  } else {
                    selectAllLabel.show()
                    deselectAllLabel.hide() 
                  }
                }

                selectAll.change(function(e) {
                  langs.prop('checked', $(this).is(':checked'))
                  updateLabel()
                })

                invertSelect.click(function(e) {
                  langs.click()
                })

                langs.change(() => updateLabel())
            }
        </script>
    </head>
    <body>
        <!-- HTML结构 -->
        <button type="button" onclick="buttonState()">运行</button>
        <form id="test-form" action="test">
            <legend>请选择想要学习的编程语言：</legend>
            <fieldset>
                <p><label class="selectAll"><input type="checkbox"> <span class="selectAll">全选</span><span class="deselectAll">全不选</span></label> <a href="#0" class="invertSelect">反选</a></p>
                <p><label><input type="checkbox" name="lang" value="javascript"> JavaScript</label></p>
                <p><label><input type="checkbox" name="lang" value="python"> Python</label></p>
                <p><label><input type="checkbox" name="lang" value="ruby"> Ruby</label></p>
                <p><label><input type="checkbox" name="lang" value="haskell"> Haskell</label></p>
                <p><label><input type="checkbox" name="lang" value="scheme"> Scheme</label></p>
                <p><button type="submit">Submit</button></p>
            </fieldset>
        </form>
    </body>
</html>
```







