/**
*	Sets up the app
*	@author André Barata
*/

const VueCodeMirror	= require('vue-codemirror');
const VueBootstrap	= require('bootstrap-vue/dist/bootstrap-vue.common');

Vue.use(VueCodeMirror);
Vue.use(VueBootstrap);

const app = new Vue({
	el: '#app',
	components: [
		require('./components/MainComponent'),
	],
	data: {

	},
	template: `
		<main-component></main-component>
	`
});
