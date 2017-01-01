const p = require('parsimmon');

let variables = {
	single: p.letters
		.map((name) => {
			return {
				name: name
			}
		}),
	multiple: p.lazy(
		() => p.seq(
			variables.single,
			p.string('...')
		).map(([name]) =>
			Object.assign({multiple: true}, name)
		)
	),
	required: p.lazy(
		() => p.seq(
			p.string('<'),
			p.alt(
				variables.multiple,
				variables.single
			),
			p.string('>')
		).map(([,word,]) =>
			Object.assign({required: true}, word)
		)
	),
	optional: p.lazy(
		() => p.seq(
			p.string('['),
			p.alt(
				variables.multiple,
				variables.single
			),
			p.string(']')
		).map(([,word,]) => word)),
	variable: p.lazy(
		() => p.alt(
			variables.optional,
			variables.required
		)
	)
};

module.exports = {
	command: {
		variables: variables
	}
};
