/**
*	Sets up the app
*	@author André Barata
*/

const VueCodeMirror	= require('vue-codemirror');
const BootstrapVue	= require('bootstrap-vue');

Vue.use(VueCodeMirror);
Vue.use(BootstrapVue);

const app = new Vue({
	el: '#app',
	components: [
		require('./components/MainComponent')
	],
	data: {

	},
	template: `
		<main-component></main-component>
	`
});
