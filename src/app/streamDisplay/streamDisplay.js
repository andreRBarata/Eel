/**
*	Displays the contents of a stream of html
*	@author André Barata
*/
const Highland = require('highland');

module.exports = Vue.component(
	'stream-display', {
		props: ['src'],
		render(h) {
			return h();
		}
	}
);
