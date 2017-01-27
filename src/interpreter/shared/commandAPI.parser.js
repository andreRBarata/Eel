const P	= require('parsimmon');

const commandAPI = {
	variables: {
		single: P.regexp(/[a-zA-Z0-9]+/)
			.map((name) => {
				return {
					name: name,
					multiple: false
				}
			}),
		multiple: P.lazy(
			() => P.seq(
				commandAPI
					.variables.single,
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
					commandAPI
						.variables.multiple,
					commandAPI
						.variables.single
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
					commandAPI
						.variables.multiple,
					commandAPI
						.variables.single
				),
				P.string(']')
			).map(([,word,]) =>
				Object.assign({required: false}, word)
			)
		),
		variable: P.lazy(
			() => P.alt(
				commandAPI
					.variables.optional,
				commandAPI
					.variables.required
			)
		)
	},
	args: P.sepBy(
		P.lazy(() => commandAPI
			.variables.variable),
		P.whitespace
	)
};

module.exports = commandAPI;
