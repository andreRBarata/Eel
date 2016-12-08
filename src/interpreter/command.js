
module.exports =
	function command(formatstring = '', description = '') {
		let commandname =
			formatstring.substr(
				0,
				formatstring.indexOf(' ')
			);
		let params =
			formatstring.substr(
				formatstring.indexOf(' ') + 1
			);

		let commanddata = {
			'format': [],
			'description': description,
			'help': '',
			'validation': () => {},//function
			'option': {},
			'display': {},
			'action': () => {},//function
		};

		this[commandname] = function () {
			commanddata.action();
		}

		for (let header in commanddata) {
			if (commanddata.hasOwnProperty(header)) {
				if (!this[commandname][header]) {
					this[commandname][header] = function(arg) {
						if (!arg) {
							return commanddata[header];
						}
						else {
							commanddata[header] = arg;
							return this;
						}
					};
				}
			}
		}

		return this[commandname];
	}
