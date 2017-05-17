const navButton = resolve => require(['./navButton.vue'], resolve);
const navButton2 = resolve => require(['./navButton2.vue'], resolve);
export default [
  {
    path: '/',
    component: navButton,
    meta:{
      title: "index"
    }
  },
  {
  	path: '/v2',
  	component: navButton2,
  	meta:{
  		title: "index"
  	}
  },
  {
  	path: '*',
  	component: navButton,
  	meta:{
  		title: "index"
  	}
  },
]