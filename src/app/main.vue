<template>
	<div class="body">
		<div>
			<span class="fa fa-bath">图标</span>
		</div>
		<div class="logo" @click="show()"></div>
		<p>test</p>
	</div>
</template>
<script>
	import store from '../vuex/store.js';
	import {mapGetters} from 'vuex';
	const d3 = Object.assign({},
	  require("d3-request")
	);
	export default {
		store,
		computed:mapGetters({
			nav:'nav',
			asset_show:'asset_show',
		}),
		components:{},
		methods:{
			show(){
				d3.json('data/stack.json',function(err, res){
					alert(JSON.stringify(res));
				})
			}
		}
	}
</script>