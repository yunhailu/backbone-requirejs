define(['jquery','view','handle'],function($, view, handle){

	var routes = {

        //404
        notFound: function(){
            alert('页面不存在，请检查你输入的地址是否正确！');
        },

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
            //统计
        },

        hello: function(name){
            //data是当前视图绑定的model内容
            var data = {title: '欢迎你', name: name};
            //events是当前视图中的事件处理
            var events = {
                'click h2': handle.clickHello
            };
            //输出视图，支持多视图嵌套
            view('hello', data, events).done(function(nowview){
                //nowview为当前视图对象,以防止子对象需要调用父对象的信息，在此提供绑定
                //获取登陆信息
                var list = ["2015-10-12 12:11","2015-10-15 12:11","2015-10-16 12:11"];
                var data = {list: list};
                var events = {};
                //如果是异步获取那么此处的return需要返回一个jq Deferred对象
                return view('loginfo', data, events, '.loginfo', nowview);
            });
        },
	};
	return routes;
});