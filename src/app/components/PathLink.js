/**
*	Displays a path as breadcrumbs
*	@author André Barata
*/
const path = require('path');

module.exports = Vue.component(
	'path-link', {
		directives: {
			localRef: require('./LocalRef')
		},
		template: `
			<div>
				<span v-for="(part, index) in parts" :key="index">
					<a v-local-ref="part.path" class="text-primary">
						{{part.segment}}
					</a>
						{{
							index === parts.length - 1?
								'' : seperator
						}}
				</span>
			</div>
		`,
		props: ['of'],
		data: () => {
			return {
				seperator: path.sep
			};
		},
		computed: {
			parts() {
				let partNames = this.of
					.split(path.sep);

				return partNames
					.map((segment, index) => {
						return {
							segment: segment,
							path: partNames
								.slice(0, index + 1)
								.join(path.sep)
						};
					});
			},

		}
	}
);
