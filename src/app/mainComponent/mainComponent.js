/**
*	Controls the index page for the app
*	@author André Barata
*/

const highland = require('highland');

module.exports = Vue.component(
	'main-component', {
		components: [
			require('../streamDisplay/streamDisplay')
		],
		template: `
			<div>
				<div class="container-fluid" id="container">
					<stream-display :src="stdout">
					</stream-display>
					<div class="command-pane">
						<b-popover placement="bottom"
							content="Type #help for intructions on the syntax and a list of commands">
								<div class="form-control">
									<codemirror v-model="command"
										:options="editorOptions">
									</codemirror>
								</div>
						</b-popover>
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
				stdout: new highland()/*commandService
					.stdout*/,
				cwd: process.cwd(),
				command: '',
				editorOptions: {
					lineNumbers: false,
					indentWithTabs: true,
					lineWrapping: true,
					mode: 'eelscript',
					cursorHeight: 1,
					readOnly: false,
					extraKeys: {
						Enter(cm) {
						},
						Up(cm) {
							if (cm.getCursor().line === 0) {
								return cm.execCommand('autocomplete');
							}
							else {
								return CodeMirror.Pass;
							}
						},
						Down(cm) {
							if (cm.getCursor().line === cm.lastLine()) {
								return cm.execCommand('autocomplete');
							}
							else {
								return CodeMirror.Pass;
							}
						},
						'Ctrl-Space': 'autocomplete'
					}
				}
			}
		},
		created() {
			historyService.get()
				.toArray((history) => {
					firstRun = history.length === 0;
				});

			return firstRun;
		}
	}
);
