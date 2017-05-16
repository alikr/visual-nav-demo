const login = resolve => require(['../components/login/index.vue'], resolve);
const NotFound = resolve => require(['../components/404/index.vue'], resolve);

export default [
  {
  	path: '/login',
  	component: login,
  	meta:{
  		title: "登录"
  	}
  },
  {
  	path: '*',
  	component: NotFound,
  	meta:{
  		title: "error"
  	}
  },
]