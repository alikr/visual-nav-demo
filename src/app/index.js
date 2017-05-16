import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes.js';
import main from './main.vue';
import store from '_vuex/store';
Vue.use(VueRouter);
import "lib/bootstrap/less-rewrite/bootstrap.less";
import "lib/font-awesome/css/font-awesome.min.css";
import "../css/main.css";
const router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes
});

var appName = ' - 鹰眼-Web漏洞检测系统';
router.beforeEach((to, from, next) => {
	if(to.meta.title){
		document.title = to.meta.title + appName;
	}
	to.query.asset && store.commit('ASSET',true);
	next();
});

const app = new Vue({
	store,
	el: '#app',
	router,
	render:(h)=>h(main)
});