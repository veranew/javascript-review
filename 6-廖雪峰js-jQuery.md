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

## 事件触发条件

当用户在文本框中输入时，就会触发`change`事件。但是，如果用JavaScript代码去改动文本框的值，将*不会*触发`change`事件：

有些时候，我们希望用代码触发`change`事件，可以直接调用无参数的`change()`方法来触发该事件：

```js
var input = $('#test-input');
input.val('change it!');
input.change(); // 触发change事件
```

`input.change()`相当于`input.trigger('change')`，它是`trigger()`方法的简写。

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

# 动画

## show / hide

`show()`和`hide()`是从左上角逐渐展开或收缩的。`toggle()`方法则根据当前状态决定是`show()`还是`hide()`。

## slideUp / slideDown

`slideUp()`和`slideDown()`则是在垂直方向逐渐展开或收缩的。`slideToggle()`则根据元素是否可见来决定下一步动作。

## fadeIn / fadeOut

`fadeIn()`和`fadeOut()`的动画效果是淡入淡出，也就是通过不断设置DOM元素的`opacity`属性来实现，而`fadeToggle()`则根据元素是否可见来决定下一步动作。

## 自定义动画

```js
   $('.btn-animate').click(()=> {
      $('.animate').animate({
        opacity:0.5,
        backgroundColor:'red', // 只引入jq不能改变背景，需要引入jquery.color.js
        borderRadius: '50%'
      },2000,()=>{
        console.log('complete~')
      })
    })
```

以下为jquery.color.js 的cdn引入方式

```html
  <script
  src="http://code.jquery.com/color/jquery.color-2.1.2.js"
  integrity="sha256-1Cn7TdfHiMcEbTuku97ZRSGt2b3SvZftEIn68UMgHC8="
  crossorigin="anonymous"></script>

```

## 串行动画

```js
    $('.btn-ch-animate').click(()=> {
      $('.ch-animate').animate({
        opacity:0.5,
        backgroundColor:'red',
        borderRadius: '50%'
      },2000)
      .delay(1000)
      .animate({
        opacity:0.3,
        backgroundColor:'green',
        borderRadius: '20%'
      },2000)
    })

```

**注意**

jQuery动画的原理是逐渐改变CSS的值，如`height`从`100px`逐渐变为`0`。所以对不是`block`的元素不起租用。

jQuery也没有实现对`background-color`的动画效果，用`animate()`设置`background-color`也没有效果。这种情况下可以使用CSS3的`transition`实现动画效果。

# AJAX

用JavaScript写AJAX前面已经介绍过了，主要问题就是不同浏览器需要写不同代码，并且状态和错误处理写起来很麻烦。

用jQuery的相关对象来处理AJAX，不但不需要考虑浏览器问题，代码也能大大简化。

```js
    function refreshPrice(data){ // 请求链接里的callback
      console.log(data)
    }
    $.ajax({
      url: 'http://api.money.126.net/data/feed/0000001,1399001?callback=refreshPrice',
      method: 'GET',
      dataType: 'jsonp',
    })

```

jsonp请求的一个例子。

# 拓展

## 编写jQuery插件

给jQuery对象绑定一个新方法是通过扩展**`$.fn`**对象实现的。让我们来编写第一个扩展——`highlight1()`：

```js
$.fn.highlight1 = function () {
    // this已绑定为当前jQuery对象:
    this.css('backgroundColor', '#fffceb').css('color', '#d85030');
    return this;
}
```

为什么最后要`return this;`？因为jQuery对象支持链式操作，我们自己写的扩展方法也要能继续链式下去：

```js
$('span.hl').highlight1().slideDown();
```

但是这个版本并不完美。有的用户希望高亮的颜色能自己来指定，怎么办？

我们可以给方法加个参数，让用户自己把参数用对象传进去。于是我们有了第二个版本的`highlight2()`：

```js
$.fn.highlight2 = function (options) {
    // 要考虑到各种情况:
    // options为undefined
    // options只有部分key
    var bgcolor = options && options.backgroundColor || '#fffceb';
    var color = options && options.color || '#d85030';
    this.css('backgroundColor', bgcolor).css('color', color);
    return this;
}
```

另一种方法是使用jQuery提供的辅助方法**`$.extend(target, obj1, obj2, ...)`**，它把多个object对象的属性合并到第一个target对象中，遇到同名属性，总是使用靠后的对象的值，也就是越往后优先级越高：

```
// 把默认值和用户传入的options合并到对象{}中并返回:
var opts = $.extend({}, {
    backgroundColor: '#00a8e6',
    color: '#ffffff'
}, options);
```

紧接着用户对`highlight2()`提出了意见：每次调用都需要传入自定义的设置，能不能让我自己设定一个缺省值，以后的调用统一使用无参数的`highlight2()`？

也就是说，我们设定的默认值应该能允许用户修改。

于是最终版的`highlight()`终于诞生了：

```js
$.fn.highlight = function (options) {
    // 合并默认值和用户设定值:
    var opts = $.extend({}, $.fn.highlight.defaults, options);
    this.css('backgroundColor', opts.backgroundColor).css('color', opts.color);
    return this;
}

// 设定默认值:
$.fn.highlight.defaults = {
    color: '#d85030',
    backgroundColor: '#fff8de'
}
```

最终，我们得出编写一个jQuery插件的原则：

1. 给`$.fn`绑定函数，实现插件的代码逻辑；
2. 插件函数最后要`return this;`以支持链式调用；
3. 插件函数要有默认值，绑定在`$.fn.<pluginName>.defaults`上；
4. 用户在调用时可传入设定值以便覆盖默认值。

## 针对特定元素的扩展

jQuery的选择器支持`filter()`方法来过滤，我们可以借助这个方法来实现针对特定元素的扩展。

先写出用户调用的代码：

```js
$('#main a').external();
```

然后按照上面的方法编写一个`external`扩展：

```js
$.fn.external = function () {
    // return返回的each()返回结果，支持链式调用:
    return this.filter('a').each(function () {
        // 注意: each()内部的回调函数的this绑定为DOM本身!
        var a = $(this);
        var url = a.attr('href');
        if (url && (url.indexOf('http://')===0 || url.indexOf('https://')===0)) {
            a.attr('href', '#0')
             .removeAttr('target')
             .append(' <i class="uk-icon-external-link"></i>')
             .click(function () {
                if(confirm('你确定要前往' + url + '？')) {
                    window.open(url);
                }
            });
        }
    });
}
```

扩展jQuery对象的功能十分简单，但是我们要遵循jQuery的原则，编写的扩展方法能支持链式调用、具备默认值和过滤特定元素，使得扩展方法看上去和jQuery本身的方法没有什么区别。





















