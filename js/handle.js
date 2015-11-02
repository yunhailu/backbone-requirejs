define(['jquery'], function($) {

	var funs = {
		clickHello: function(e){
			var name = this.model.get('name');
			//this.model即是当前view对应的model
			console.log(name);
			//e.currentTarget可以获取当前绑定事件的dom，e.target获取触发事件的dom
			e.currentTarget.style.color = 'red';
		}
	};
	return funs;
});	