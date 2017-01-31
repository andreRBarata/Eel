const P	= require('parsimmon');

const commandAPI = (() => {
	this.variables = (() => {
		this.single = P.regexp(/[a-zA-Z0-9]+/)
			.map((name) => {
				return {
					name: name,
					multiple: false
				}
			});
		this.multiple = P.lazy(
			() => P.seq(
				commandAPI
					.variables.single,
				P.string('...')
			).map(([single]) => {
				single.multiple = true;
				return single;
			})
		);
		this.required = P.lazy(
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
		);
		this.optional = P.lazy(
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
		);
		this.variable = P.lazy(
			() => P.alt(
				commandAPI
					.variables.optional,
				commandAPI
					.variables.required
			)
		);

		return this;
	}).apply({});
	this.args = P.sepBy(
		P.lazy(() => commandAPI
			.variables.variable),
		P.whitespace
	);

	return this;
}).apply({});

module.exports = commandAPI;
