/**
*	Displays the contents of a stream of html
*	@author André Barata
*/
const Highland = require('highland');

function map() {
	
}

module.exports = Vue.component(
	'stream-display', {
		props: ['src'],
		data() {
			return {
				cache: []
			};
		},
		created() {
			console.log(this.src, this.cache);

			this.src
				.map((data) => {
					if (data instanceof Error) {
						return compile({
							html:
							`<div class="alert alert-danger" role="alert">{{src}}</div>`,
							scope: data.message
						});
					}

					return data;
				})
				.map(map)
				.compact()
				.each((ele) => {
					this.cache.push(ele);
				});
		},
		render(h) {
			console.log(this.src, this.cache);
			return h();
		}
	}
);
