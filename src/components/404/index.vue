<script>
	import view from './view.vue';
	import store from '../../vuex/store.js';
	import {mapGetters} from 'vuex';
	export default {
		store,
		computed:mapGetters({
			nav:'nav'
		}),
		mounted(){
			this.nav.hide = true;
		},
		render:(h)=>h(view)
	}
</script>