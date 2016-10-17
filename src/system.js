const Process	= require('./Process');

const Highland	= require('highland');
const fs		= require('fs');
const readdir	= Highland.wrapCallback(fs.readdir);
const spawn		= require('child_process').spawn;
const defaults	= require('defaults');


//TODO: System command outputs
//#Done:10 Add check to see if command exists
module.exports = function (_context = {}) {
	let context = defaults(_context, {
		$env: {
			PATH: ''
		}
	});

	return new Promise((resolve, reject) => {
		(new Highland(
			//TODO: Check windows support
			context.$env.PATH.split(':')
		))
		.map((path) => readdir(path)
			.errors(() => {}) //TODO:10 Do something with these errors
		)
		.flatten()
		.uniq()
		.map((command) => {
			return {
				[command](...args) {
					//TODO:20 Add error propagation to backend
					let appProcess = new Process((push, next, input) => {
						let systemProcess = spawn(command, (args)? args: []);

						systemProcess.stdout.on('data',
							(data) => {
								push(data);
								next();
							}
						);

						input.pipe(systemProcess.stdin);
					});

					return appProcess;
				}
			};
		})
		.errors((err) => reject(err))
		.toArray((commands) => {
				resolve(Object.assign({}, ...commands));
			}
		);
	});
};
