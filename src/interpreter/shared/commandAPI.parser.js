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
				this.longflag
					.map((flag) => {
						return {
							type: 'longflag',
							id: flag[1]
						};
					}),
				this.shortflag.map((flag) => {
					return {
						type: 'shortflag',
						id: flag[1]
					};
				})
			),
			P.optWhitespace
			.then(P.string(','))
			.then(P.optWhitespace)
		).map((flags) => {
			return {
				name: [...flags]
					.reverse()
					.find((flag) => flag.type === 'longflag')
					.id
					.replace(/\-./g,
						([,letter]) => letter.toUpperCase()
					),
				flags: flags
			}
		});


		return this;
	}).apply({});

	this.args = P.sepBy(
		this
			.variables.variable,
		P.whitespace
	).map((args) => {
		return args.reduce((arg1, arg2) => {
			function add(val1 = 0, val2 = 0) {
				if (val1 === '*' || val2 === '*') {
					return '*';
				}

				return val1 + val2;
			}

			return {
				string: [arg1.string, arg2.string]
					.filter((ele) => ele)
					.join(' '),
				min: add(arg1.min, arg2.min),
				max: add(arg1.max, arg2.max)
			}
		}, {});
	});

	return this;
}).apply({});

module.exports = commandAPI;
