# backbone-requirejs

##简介

这是一套backbone+requirejs的基础架构，对于spa项目开发相当高效。

基于路由加载视图，分离view和model，以router充当controller角色。

有全局路由(global)和404路由(notFound)，基本能够满足日常需求，习惯express路由机制的朋友可能会喜欢我的方案，没有体验过express路由的朋友如果看看我的方案相信也会爱上这种处理方式。

这套方案不是基于Restful API，所以并没有用到collection，而是使用ajax替代backbone的数据交互，浪费掉了一部分backbone的优势，但是增加了可扩展性，如果需要用到collection的朋友可以自行改装。

架构适用于单视图应用，但是对于多视图也有对应的解决方案，下面会讲解。

##路由
这套架构以路由为起点，所以路由占用比较重要的一块，路由配置文件在app.js中。

```javascript
var router = Backbone.Router.extend({
				routes: {
					"hello/:name":			Routes.router("hello"),//hello
					"*anything": Routes.notFound//无效路由
				}
			});
```
倘若我们需要再添加一条路由，那么只需要往routes这个对象中直接插入符合backbone语法的路由规则就行了。比如：
```javascript
"detail/:id"    Routes.router("detail"),
```
如此就好，之所以不是直接指向Routes.detail，是因为backbone不直接提供全局路由方式，因此用Routes.router做了一个中转，所有路由都默认走router路由，然后再由router路由分配到我们需要的路由，也就是括号中传递的参数所对应的路由。
具体路由分配规则在routes.js中。
```javascript
var routes = {
        //404
        notFound: function(){
          //错误路由处理方案
        },
        //中转路由
        router: function(name){
            var _this = this;
            //分派路由
            return function(){
                _this[name].apply(null,arguments);
                _this.global(name);
            }  
        },
        //全局路由
        global: function(name){
          //全局路由处理方案
        },
        //hello路由
        hello: function(name){
          //hello路由处理方案
        },
        //detail路由
        detail: function(id){
          //detail路由处理方案
        }
	};
```
就如以上代码所注释的一样，我们在app.js中添加一条路由规则，只需要在routes.js中增加一条属性就好了，处理函数对应的参数与路由规则中申明的参数顺序一致就可以了。

##视图
说完路由说视图，上面的路由规则相信大家已经明白了，那么怎么完成一整套流水，让我们看到最终的显示效果呢，这就需要介绍视图机制了。
我这边的视图处理也相对简单，没有很复杂的东西，如果在此我没有说清楚的话，我建议你看看我的view.js，代码不多，但很有用。
视图处理是在view.js中，我的处理方案是单独分离view模块，并不需要多次操作重复的劳动，view模块返回一个create方法，接受 模板名、model、以及events等参数，动态创建一个新的view对象。

我们只需要在路由处理方法中，比如hello路由中执行以下语句就能输出对应视图。
```javascript
hello: function(name){
  //data装载我们视图对应的model信息
  var data = {name: name};
  //events对象装载我们的事件处理信息，与backbone文档所述语法一致
  var events = {
  'click h2': handle.clickHello
  }
  view('hello',data, events);
}
```
相信看完这段代码，你已经清楚我要干什么了，不错，我需要模板与视图分离，model与view分离，events同样与view分离。
这是单视图的处理方案，我的view模块同样能兼容多视图处理方案。
```javascript
view('hello',data, events,'.loginfo');
```
第四个参数为es5语法的element元素，不为空时view模块会自动加载到指定的element元素中，如果为空，则直接加载到全局视图dom中。
view方法还接受第五个参数，就是当前view的父层视图，由于我创建这个view模块时，都是一对一生成，并不能自动识别谁是父谁是子，因此有需要的话需要手动指定。
```javascript
view('hello',data, events).done(function(nowview){
  //此处nowview返回的即是hello视图
  var data = {}
  data.list = ["2015-10-12 12:11","2015-10-15 12:11","2015-10-16 12:11"];
  return view('loginfo', data, {}, '.loginfo', nowview);
}).done(function(nowview){
  //此处返回的nowview即是loginfo视图，同样的方式可以一层一层的放下绑定
});
```
至于为何我传递给view几个参数就能实现想要的效果，你可以看看view.js具体的实现方式。

需要说明的一点是，nowview不仅可以用于绑定父子view关系，同时还可以让我们可以在router中操控一些事情，比如通过nowview.$el查找视图中的dom对象，当然我不建议这么用，但是情非得已话是可以使用的，总比去改view这个公共模块要好，比如自执行一些事情。

因为backbone不提供类似于jq的domready事件，因此我们如果想在视图初始化之后执行某些操作的话，我的这种方式就派上大用场了。
```javascript
view('hello',data, events).done(function(nowview){
  //假设已经指定了jquery.lazyload插件路径
  require( ['lazyload'],function(){
    nowview.$el.find(".lazyload").lazyload({
        effect:'fadeIn'
    });
  });
})；
```

##模板
如果你看过我的view.js你就知道我是通过require.text来加载指定模板的。
```javascript
var viewCreate = function(name, data, events, element, parent){
  //name为view方法接收到的模板名称
  require(['lib/require.text!../template/'+ name +'.html'], function (doc){
    //根据模板名称读取/template目录下的与name同名的html文件作为模板，doc即是模板的内容
    ...
  });
}
```
我通过name读取template信息，然后渲染在视图中。
我没有使用underscore.js提供的模板引擎工具，而是选用了juicer.js有两个原因。其一，效率更高；其二，语法更优雅。
当然我不强制你使用juicer，这一切都由你自己决定。
来看看我的模板页面实际的使用情况，模板文件都在/template目录下，以hello.html和loginfo.html两个模板为例。
hello.html
```html
<div class="main">
	<h2>hello ${name}!</h2>

	<h3>你最近的登陆信息</h3>
	<div class="loginfo"></div>
</div>
```
loginfo.html
```html
<ul>
	{@each list as item}
	<li>
		${item}
	</li>
	{@/each}
</ul>
```
就是这么简单，我们就可以在访问/index.html#hello路由时访问到我们指定的内容信息。

##数据模型
至此，差不多你已经了解我的视图运行方式，下面说说model部分的内容，我是根据view模块中接受到的data数据，动态生成model然后绑定给当前的view。因此data也至关重要。
如果我们想要在模板中获取到model信息，那么只需要将有用的信息添加给data对象就可以了。如：
```javascript
  var data = {name: name, title:'欢迎页面'};
  //还可以插入后端请求的信息
  //假设如下ajax能正常请求
  $.ajax({}).done(info){
    data.info = info;
    view('hello',data, {},'.loginfo');
  }
```
如此我们就为视图hello附加好了model信息，在模板中就可以随意使用了。

##事件
同样的方式，我们可以为视图添加事件绑定，只需要在view方法执行时将事件绑定的对象events穿进去就好。
```javascript
  var events = {
  'click h2': handle.clickHello
  };
  view('hello',data, events);
```
我还提取了一个模块专门用于处理事件回调，那就是handle.js
添加事件之后，只需要在handle.js中的funs对象中添加一个同名的方法就好。
```javascript
  var funs = {
		clickHello: function(e){
			var name = this.model.get('name');
			//this.model即是当前view对应的model
			console.log(name);
			//e.currentTarget可以获取当前绑定事件的dom，e.target获取触发事件的dom
			e.currentTarget.style.color = 'red';
		}
	};
```
在事件处理中函数中this即表示当前元素所处的view对象，通过this.model可以很方便的操控model信息。
至此，这套架构基本已经说完，我觉得相当好用，如果有什么问题可以给我留言。

##打包
requirejs打包其实与这个项目关系不到，但是事情毕竟有始有终为好。
我采用gulp打包requirejs项目，也很简单，主要用到amd-optimize这个插件。
```javascript
var gulp = require('gulp');
//requirejs项目打包
var amdOptimize = require('amd-optimize');
//合并
var concat = require('gulp-concat');
//压缩js
var uglify = require('gulp-uglify');
//创建打包任务
gulp.task('rjs', function() {
return	gulp.src('js/*.js')
	.pipe(amdOptimize('main',{
		name: "main",
		configFile: "js/main.js",//配置文件可以直接饮用项目中的配置文件
		baseUrl: 'js'
	}))
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});
```
