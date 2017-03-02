const P	= require('parsimmon');

const commandAPI = (function() {
	this.variables = (function() {
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

	this.options = (function() {
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
							id: flag[1],
							fullflag: flag.join('')
						};
					}),
				this.shortflag.map((flag) => {
					return {
						type: 'shortflag',
						id: flag[1],
						fullflag: flag.join('')
					};
				})
			),
			P.optWhitespace
				.then(P.string(','))
				.then(P.optWhitespace)
		).map((flags) => {
			let toReturn = {
				name: [...flags]
					.reverse()
					.find((flag) => flag.type === 'longflag')
					.id
					.replace(/\-./g,
						([,letter]) => letter.toUpperCase()
					),
				flags: flags,
				parser: P.alt(
					...(flags
						.map((flag) => P.string(flag.fullflag)))
				).map((flag) => {
					return {
						name: toReturn.name,
						value: true
					};
				})
			}

			return toReturn;
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

	this.header = P.alt(
		P.seq(
			P.regex(/[\-A-Za-z0-9.\\=~_/]+/)
				.then(P.whitespace),
			this.args
		),
		P.regex(/[\-A-Za-z0-9.\\=~_/]+/)
			.map((name) => {
				return [name, {}];
			})
	);

	return this;
}).apply({});

module.exports = commandAPI;
