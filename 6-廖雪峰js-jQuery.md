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

