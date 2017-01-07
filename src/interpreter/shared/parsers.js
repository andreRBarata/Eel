const P		= require('parsimmon');
const sweet	= require('sweet.js');

sweet.loadMacro(
	'./src/interpreter/shared/syntax.sjs'
);

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

let vm = {
	string: P.alt(
		P.regex(/".*"/),
		P.regex(/'.*'/)
	),
	shell: {
		word: P.regex(
			/[\-A-Za-z0-9.\\/]+/
		),
		argument: P.lazy(() => vm.shell.word
			.map((word) => `'${word}'`)),
		variable: P.seq(
			P.string('${'),
			P.lazy(() => vm.shell.word),
			P.string('}')
		).map(([,word,]) => word),
		args: P.sepBy(
			P.alt(
				P.lazy(() => vm.shell.variable),
				P.lazy(() => vm.shell.argument),
				P.lazy(() => vm.string)
			),
			P.whitespace
		),
		command: P.alt(
			P.seq(
				P.string('&'),
				P.lazy(() => vm.shell.argument),
				P.whitespace,
				P.lazy(() => vm.shell.args)
			),
			P.seq(
				P.string('&'),
				P.lazy(() => vm.shell.argument)
			)
		).map(([,word,,args = []]) =>
			`system[${word}](${
				args.join(',')
			})`
		)
	},
	expression: P.alt(
		P.lazy(() => vm.shell.command),
		P.regex(/.*/)
	),
	expressions: P.sepBy(
		P.lazy(() => vm.expression),
		P.optWhitespace
	),
	parse(code) {
		let regex = /&([\-A-Za-z0-9.\\/]+|".*"|'.*')(?: ([\-A-Za-z0-9.\\/${}]+|".*"|'.*')*)?/g;
		let step1 = code.replace(regex,
			(line) => vm.shell.command.parse(line).value
		);

		console.log('test', step1);

		return sweet.compile(
			step1
		).code
	}
};

let parsers = {
	command: {
		variables: variables,
		args: P.sepBy(
			variables.variable,
			P.whitespace
		)
	},
	vm: vm
};

module.exports = parsers;
