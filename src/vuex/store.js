import polyfill from 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

var state = {
  name: '',
  nav: {
    hide: false,    //是否隐藏导航(404页面...)
    hover: false,    //导航hover
  },
  asset_show: false,  //是否显示资产弹窗
};

function getters(state) {
  var obj = {};
  for (var key in state) {
    obj[key] = gt(key);
  }
  return obj;
}

function gt(key) {
  return (d) => d[key];
}

const ADD = "ADD";
const ACTIVE = "ACTIVE";
const NAV = "NAV";
const ASSET = "ASSET";

export default new Vuex.Store({
  state,
  getters: getters(state),
  mutations: {
    [ADD]: function(state, msg) {
      state.name = msg;
    },
    [ACTIVE]: function(state, flag) {
      state.nav.hover = flag;
    },
    [NAV]: function(state, msg) {
      state.nav.hide = msg;
    },
    [ASSET]: function(state, msg) {
      state.asset_show = msg;
    },
  },
  actions: {
    
  }
});
