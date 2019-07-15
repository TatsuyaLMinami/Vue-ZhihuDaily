import "./style.css";
//导入Vue框架
import Vue from "vue";
//导入app.vue组件
import App from "./app.vue";
//创建Vue实例
new Vue({
	el:"#app",
	//箭头函数等同于function(h){return h(App)}
	render: h => {
		return h(App)
	}
});
//document.getElementById("app").innerHTML = "Hello webpack gogogo";
