const P	= require('parsimmon');

const commandAPI = (() => {
	this.variables = (() => {
		this.single = P.regexp(/[a-zA-Z0-9]+/)
			.map((name) => {
				return {
					max: 1,
					string: name
				};
			});
		this.multiple = P.seq(
				this.single,
				P.string('...')
			).map(([single]) => {
				return {
					max: '*',
					string: `${single.string}...`
				};
			});
		this.required = P.seq(
				P.string('<'),
				P.alt(
					this.multiple,
					this.single
				),
				P.string('>')
			).map(([,word,]) => {
				return {
					min: 1,
					max: word.max,
					string: `<${word.string}>`
				};
			});
		this.optional = P.lazy(
			() => P.seq(
				P.string('['),
				P.alt(
					this.multiple,
					this.single
				),
				P.string(']')
			).map(([,word,]) => {
				return {
					min: 0,
					max: word.max,
					string: `[${word.string}]`
				}
			})
		);
		this.variable = P.alt(
				this.optional,
				this.required
		);

		return this;
	}).apply({});

	this.options = (() => {
		this.flagcharacters =
			 P.regexp(/[a-zA-Z0-9]/);

		this.longflag = P.seq(
			P.string('--'),
			P.seq(
				this.flagcharacters,
				P.alt(
					this.flagcharacters,
					P.string('-')
				).many()
			).map(([letter, rest]) =>
				[letter, ...rest].join('')
			)
		);

		this.shortflag = P.seq(
			P.string('-'),
			this.flagcharacters
		);

		this.flaglist = P.sepBy(
			P.alt(
				this.longflag,
				this.shortflag
			),
			P.optWhitespace.then(
				P.string(',')
			).then(
				P.optWhitespace
			)
		);


		return this;
	}).apply({});

	this.args = P.sepBy(
		this
			.variables.variable,
		P.whitespace
	).map((args) => {
		return args.reduce((arg1, arg2) => {
			function add(val1, val2) {
				if (val1 === '*' || val2 === '*') {
					return '*';
				}

				return val1 + val2;
			}

			return {
				string: arg1.string + ' '
					+ arg2.string,
				min: add(arg1.min, arg2.min),
				max: add(arg1.max, arg2.max)
			}
		}, {
			min: 0,
			max: 0,
			string: ''
		});
	});

	return this;
}).apply({});

module.exports = commandAPI;
