<template>
	<div class="body">
		<select name="" id="" v-model="nav">
			<option value="/">样式1</option>
			<option value="/v2">样式2</option>
		</select>
		<router-view></router-view>
	</div>
</template>
<script>
	import store from '../vuex/store.js';
	import {mapGetters} from 'vuex';
	const d3 = Object.assign({},
	  require("d3-request")
	);
	export default {
		data(){
			return {
				nav:'/'
			}
		},
		store,
		watch:{
			$route(to){
				(to.path=='/' || to.path=='v2') && (this.$data.nav = to.path);
			},
			nav(val, prev){
				this.$router.push(val);
			}
		}
	}
</script>