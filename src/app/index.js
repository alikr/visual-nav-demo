import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes.js';
import main from './main.vue';
import store from '_vuex/store';
Vue.use(VueRouter);
import "../css/main.css";
const router = new VueRouter({
	mode: 'hash',
	// mode: 'history',
	base: __dirname,
	routes
});

router.beforeEach((to, from, next) => {
	if(to.meta.title){
		document.title = to.meta.title;
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