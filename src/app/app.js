/**
*	Sets up the AngularJS app
*	@author André Barata
*/

const app = new Vue({
	el: '#app',
	components: [
		require('./mainComponent/mainComponent')
	],
	data: {

	},
	template: `
		<main-component></main-component>
	`
});
