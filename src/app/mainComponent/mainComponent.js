/**
*	Controls the index page for the app
*	@author André Barata
*/

module.exports = Vue.component(
	'main-component', {
		components: [
			require('../streamDisplay/streamDisplay')
		],
		template: `
			<div>
				<div class="container-fluid" id="container">
					<stream-display src="stdout">
					</stream-display>
					<div class="command-pane"
						popover-enable="firstRun()"
						popover-placement="bottom-left"
						uib-popover="Type #help for intructions on the syntax and a list of commands">
							<input-highlight onexec="execute">
							</input-highlight>
					</div>
				</div>

				<footer class="navbar navbar-inverse navbar-fixed-bottom">
					<div class="container">
						<div class="navbar-text">
							<path-link of="cwd"/>
						</div>
					</div>
				</footer>
			</div>
		`,
		data() {
			return {
				stdout: null/*commandService
					.stdout*/,
				cwd: process.cwd(),
				command: ''
			}
		},
		method: {
			firstRun() {
				historyService.get()
					.toArray((history) => {
						firstRun = history.length === 0;
					});

				return firstRun;
			}
		}
	}
);
