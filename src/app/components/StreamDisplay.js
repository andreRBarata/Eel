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
		methods: {
			streamMap(stream) {
				let sectionArray = [];

				new Highland(stream)
					.batchWithTimeOrCount(10, 100)
					.each((_data) => {
						if (stream.state === 'unpiped') {
							sectionArray.push(
								_data
							);
						}
					});

				return sectionArray;
			}
		},
		created() {
			this.src
				.filter((data) => data.state === 'unpiped')
				.map((data) => {
					if (data instanceof Error) {
						return div({role: 'alert', class: 'alert alert-danger'},
							data
						);
					}
					else if (data.preprocessor) {
						return this.streamMap(
							data.lens('object/scoped-html')
						);
					}
					else if (data.pipe) {
						return this.streamMap(data);
					}

					return data;
				})
				.batchWithTimeOrCount(30, 100)
				.each((ele) => {
					this.cache.push(...ele);
				});
		},
		render(createElement) {
			return apply(
				createElement,
				div(
					this.cache
						.filter((data) => data.length > 0)
						.map((data) => section(
							{
								class: 'container-fluid'
							}, data
						))
				)
			);
		}
	}
);
