define(['Backbone','routes'], function(Backbone, Routes) {
	return {
		init : function(){
			//配置路由
			var router = Backbone.Router.extend({
				routes: {
					"hello/:name":			Routes.router("hello"),//hello
					"*anything": Routes.notFound//无效路由
				}
			});
			new router();
			Backbone.history.start({pushstate:true});
		}
	};
});	