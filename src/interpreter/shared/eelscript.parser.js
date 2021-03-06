const P		= require('parsimmon');
const sweet	= require('sweet.js');
const path	= require('path');

function flatten(arr) {
	const flat = [].concat(...arr);
	return flat.some(Array.isArray) ? flatten(flat) : flat;
}

sweet.loadMacro(
	path.join(__dirname, 'syntax.sjs')
);

sweet.loadMacro(
	require.resolve('es6-macros')
);

const eelscript = {
	shell: {
		seg: P.regex(/[\-A-Za-z0-9.\\=~_/]+/),
		arg: P.alt(
			P.lazy(() => eelscript.shell.seg)
				.map((word) => `'${word}'`),
			P.lazy(() => eelscript.string)
		).map((arg) => flatten(arg).join('')),
		args: P.sepBy1(
			P.alt(
				P.lazy(() => eelscript.templateVariable)
					.map(([,expressions,]) => expressions),
				P.lazy(() => eelscript.shell.arg)
			),
			P.whitespace
		),
		command: P.alt(
			P.seq(
				P.string('#'),
				P.lazy(() => eelscript.shell.arg)
					.skip(P.whitespace),
				P.lazy(() => eelscript.shell.args)
			),
			P.seq(
				P.string('#'),
				P.lazy(() => eelscript.shell.arg)
				.skip(P.string('(')),
					P.sepBy(
						P.lazy(() => eelscript.expressions),
						P.string(',')
					)
				.skip(P.string(')'))
			),
			P.seq(
				P.string('#'),
				P.lazy(() => eelscript.shell.arg)
			)
		).map(([, func, args = []]) =>
			`process.sys[${func}](${
				args.join(',')
			}).config({parent: process.stdout})`
		)
	},
	excapedCharacter: P.regex(/\\./),
	//TODO: Test this id:6
	comment: P.alt(
		P.regex(/\/\/.*\n/),
		P.regex(/\/\*(.|\n)*\*\//)
	),
	//TODO: Fix escaping id:7
	templateVariable: P.seq(
		P.string('${'),
		P.lazy(() => eelscript.expressions),
		P.string('}')
	),
	templateString: P.seq(
		P.string('`'),
		P.alt(
			P.lazy(() => eelscript.excapedCharacter),
			P.lazy(() => eelscript.templateVariable)
				.map(([,template,]) =>
					['"', '+', ['(', template, ')'], '+', '"']),
			P.regex(/(\\`|[^`])/)
				.map((char) => {
					if (char.match(/\n/)) {
						return '\\n';
					}
					else if (char === '"') {
						return '\\"';
					}
					else {
						return char;
					}
				})
		).many(),
		P.string('`')
	).map(([,content,]) => `"${flatten(content).join('')}"`),
	string: P.alt(
		P.regex(/""|"(.*?[^\\])"/),
		P.regex(/''|'(.*?[^\\])'/),
		P.lazy(() => eelscript.templateString)
	),
	expression: P.alt(
		P.lazy(() => eelscript.comment),
		P.regex(/\/.+\//).desc('regular expression'),
		P.lazy(() => eelscript.string),
		P.lazy(() => eelscript.shell.command),
		P.seq(
			P.string('{'),
			P.lazy(() => eelscript.expressions),
			P.string('}')
		),
		P.seq(
			P.string('('),
			P.lazy(() => eelscript.expressions),
			P.string(')')
		),
		P.seq(
			P.string('['),
			P.lazy(() => eelscript.expressions),
			P.string(']')
		),
		P.oneOf('><=+-?!|&%/\\.*,:;'),
		P.regex(/[a-zA-Z0-9_$]+/),
		P.whitespace
	),
	expressions: P.lazy(() => eelscript.expression).many()
		.map((...args) => flatten(args).join('')),
	//TODO: Write tests for this id:8
	parse(code = '') {
		//console.log('preparse', code);
		let step1 = eelscript.expressions
				.tryParse(code);

		//console.log('parse 1', step1);

		// console.log('parse 2', sweet.compile(
		// 	step1
		// ).code);

		return sweet.compile(
			step1
		).code
	}
};

module.exports = eelscript;
