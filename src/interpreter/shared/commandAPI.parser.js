const P			= require('parsimmon');
const eelscript	= require('./eelscript.parser');

module.exports = (function() {
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

		this.required = (base) => P.seq(
				P.string('<'),
				(!base)? P.alt(
					this.multiple,
					this.single
				): base,
				P.string('>')
			).map(([,word,]) => {
				return {
					min: 1,
					max: word.max,
					string: `<${word.string}>`
				};
			});
		this.optional = (base) => P.lazy(
			() => P.seq(
				P.string('['),
				(!base)? P.alt(
					this.multiple,
					this.single
				): base,
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
			this.optional(),
			this.required()
		);

		return this;
	}).apply({parent: this});

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
		).map((flag) => {
			return {
				type: 'longflag',
				id: flag[1],
				fullflag: flag.join('')
			};
		});

		this.shortflag = P.seq(
			P.string('-'),
			this.flagcharacters
		).map((flag) => {
			return {
				type: 'shortflag',
				id: flag[1],
				fullflag: flag.join('')
			};
		});

		this.flag = P.alt(
			this.longflag,
			this.shortflag
		);

		this.flaglist = P.seq(
			P.sepBy(
				this.flag,
				P.optWhitespace
					.then(P.string(','))
					.then(P.optWhitespace)
			),
			P.alt(
				P.seq(
					P.whitespace,
					P.alt(
						this.parent.variables
							.optional(
								this.parent
									.variables
									.single
							)
							.map(() => 'optional'),
						this.parent.variables
							.required(
								this.parent
									.variables
									.single
							)
							.map(() => 'required')
					)
				).map(([,variable]) => variable),
				P.eof
			)
		).map(([flags, variable]) => {
			let fullflagList = flags
				.map((flag) => P.string(flag.fullflag));

			let flaglist = {
				name: [...flags]
					.reverse()
					.find((flag) => flag.type === 'longflag')
					.id
					.replace(/\-./g,
						([,letter]) => letter.toUpperCase()
					),
				flags: flags,
				variable: variable,
				parser: P.seq(
					P.alt(
						...fullflagList
					),
					P.alt(
						P.string('=')
							.then(eelscript.shell.arg)
							.map((args) => args),
						P.eof
					)
				).map(([flag, value]) => {
					return {
						name: flaglist.name,
						value: value || true,
						next: variable && variable === 'required'
					};
				})
			};

			return flaglist;
		});

		return this;
	}).apply({parent: this});

	this.headerArgs = P.sepBy(
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
			this.headerArgs
		),
		P.regex(/[\-A-Za-z0-9.\\=~_/]+/)
			.map((name) => {
				return [name, {}];
			})
	);

	return this;
}).apply({});
