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

//TODO: Refactor
//TODO: Add escaping and fix template strings
let vm = {
	shell: {
		arg: P.alt(
			P.regex(/[\-A-Za-z0-9.\\=/]+/)
				.map((word) => `'${word}'`),
			P.regex(/".*[^\\]"|'.*[^\\]'/)
		),
		args: P.sepBy1(
			P.alt(
				P.lazy(() => vm.templateVariable)
					.map(([,expressions,]) => expressions),
				P.lazy(() => vm.shell.arg)
			),
			P.whitespace
		),
		command: P.alt(
			P.seq(
				P.string('#'),
				P.lazy(() => vm.shell.arg),
				P.whitespace,
				P.lazy(() => vm.shell.args)
			),
			P.seq(
				P.string('#'),
				P.lazy(() => vm.shell.arg)
			)
		).map(([,func,,args = []]) =>
			`$sys[${func}](${
				args.join(',')
			})`
		)
	},
	templateVariable: P.seq(
		P.string('${'),
		P.lazy(() => vm.expressions),
		P.string('}')
	),
	string: P.alt(
		P.regex(/".*[^\\]"/),
		P.regex(/'.*[^\\]'/),
		P.seq(
			P.string('`'),
			P.alt(
				P.lazy(() => vm.templateVariable),
				P.noneOf('`')
			).many(),
			P.string('`')
		)
	),
	expression: P.alt(
		P.lazy(() => vm.string),
		P.lazy(() => vm.shell.command),
		P.seq(
			P.string('{'),
			P.lazy(() => vm.expressions),
			P.string('}')
		),
		P.seq(
			P.string('('),
			P.lazy(() => vm.expressions),
			P.string(')')
		),
		P.seq(
			P.string('['),
			P.lazy(() => vm.expressions),
			P.string(']')
		),
		P.oneOf('><=+-$?|&%/\\.*,:;'),
		P.regex(/[a-zA-Z0-9_]+/),
		P.whitespace
	),
	expressions: P.lazy(() => vm.expression).many()
		.map((...args) => {
			function flatten(arr) {
				const flat = [].concat(...arr);
				return flat.some(Array.isArray) ? flatten(flat) : flat;
			}

			return flatten(args).join('')
		}),
	parse(code) {
		console.log('preparse', code);
		let step1 = vm.expressions
				.parse(code).value;

		console.log('parse 1',step1);

		console.log('parse 2', sweet.compile(
			step1
		).code);

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
