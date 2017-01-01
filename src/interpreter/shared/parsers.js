const P = require('parsimmon');

let variables = {
	single: P.regexp(/[a-zA-Z0-9]+/)
		.map((name) => {
			return {
				name: name,
				multiple: false
			}
		}),
	multiple: P.lazy(
		() => P.seq(
			variables.single,
			P.string('...')
		).map(([single]) => {
			single.multiple = true;
			return single;
		})
	),
	required: P.lazy(
		() => P.seq(
			P.string('<'),
			P.alt(
				variables.multiple,
				variables.single
			),
			P.string('>')
		).map(([,word,]) =>
			Object.assign({required: true}, word)
		)
	),
	optional: P.lazy(
		() => P.seq(
			P.string('['),
			P.alt(
				variables.multiple,
				variables.single
			),
			P.string(']')
		).map(([,word,]) =>
			Object.assign({required: false}, word)
		)
	),
	variable: P.lazy(
		() => P.alt(
			variables.optional,
			variables.required
		)
	)
};

module.exports = {
	command: {
		variables: variables,
		args: P.sepBy(
			variables.variable,
			P.whitespace
		),
		word: P.regexp(/[\-A-Za-z0-9.\\/]+|".*"|'.*'/),
		words: P.sepBy(
			P.lazy(() => this.command.word),
			P.whitespace
		)
	}
};
