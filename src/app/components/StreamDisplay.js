/**
*	Displays the contents of a stream of html
*	@author André Barata
*/
const Highland = require('highland');
const { tag, helpers, apply } = require('vue-vnode-helper');
const { section, div } = helpers;

module.exports = Vue.component(
	'stream-display', {
		props: ['src'],
		data() {
			return {
				cache: []
			};
		},
		created() {
			this.src
				.map((data) => {
					if (data instanceof Error) {
						return div({role: 'alert', class: 'alert alert-danger'},
							data
						);
					}
					else if (data.preprocessor) {
						let sectionArray = [];

						data.lens('object/scoped-html')
							.on('data', (_data) => {
								if (data.state === 'unpiped') {
									sectionArray.push(
										_data
									);
								}
							});

						return sectionArray;
					}
					else if (data.pipe) {
						let sectionArray = [];

						data.on('data', (_data) => {
							if (data.state === 'unpiped') {
								sectionArray.push(
									_data
								);
							}
						});

						return sectionArray;
					}

					return data;
				})
				.each((ele) => {
					this.cache.push(ele);
				});
		},
		render(createElement) {
			console.log(this.cache);
			return apply(
				createElement,
				div(
					this.cache
						.filter((data) => data.length > 0)
						.map((data) => section(
							{
								style: 'display: inline;'
							}, data
						))
				)
			);
		}
	}
);
