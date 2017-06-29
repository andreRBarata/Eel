/**
*	Creates an inputbox for the execution
*	of commands using codemirror
*	@author André Barata
*/
const CodeMirror = require('codemirror');

angular.module('termApp')
	.directive('inputHighlight', (historyService) => {
		return {
			scope: {
				onexec: '=',
				command: '=',
				readonly: '='
			},
			templateUrl: 'inputHighlight/inputHighlight.tpl.html',
			controller: function InputHighlight($scope, $element) {
				CodeMirror.registerHelper(
					'hint',
					'anyword',
					require('codemirror/addon/hint/show-hint')
				);
				CodeMirror.registerHelper(
					'hint',
					'ajax',
					(editor, callback, options) => {
						let cur = editor.getCursor(),
							curLine = editor.getLine(cur.line);

						let start = cur.ch, end = start;

						historyService.get()
							.filter((line) => line.startsWith(curLine))
							.map((line) => line.slice(curLine.length))
							.toArray((history) => {
								callback({
									list: history,
									from: CodeMirror.Pos(
										cur.line, start
									),
									to: CodeMirror.Pos(
										cur.line, end
									)
								})
							});
					}
				);

				CodeMirror.registerHelper(
					'hint', 'eelscript',
					(mirror, options) => {
						CodeMirror
							.commands
							.autocomplete(mirror, CodeMirror.hint.ajax, { async: true })
					}
				);

				//TODO: Try to add greyed out auto complete history id:24
				let cmOption = {
					lineNumbers: false,
					indentWithTabs: true,
					lineWrapping: true,
					mode: 'eelscript',
					cursorHeight: 1,
					readOnly: $scope.readonly,
					extraKeys: {
						Enter(cm) {
							if ($scope.onexec) {
								$scope.onexec(
									cm.getValue()
								);
							}

							cm.setValue('');
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
				};

				$scope.editor = CodeMirror.fromTextArea(
					angular.element($element)
						.find('textarea')[0],
					cmOption
				);

				$scope.$watch('command', (command='') => {
					$scope.editor
						.setValue(command);
				});
			}
		};
	});
