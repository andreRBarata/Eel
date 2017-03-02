const storage	= require('electron-storage');
const Highland	= require('highland');

angular.module('termApp')
	.factory('historyService', ($window) => {
		let history;

		$window.addEventListener('beforeunload', () => {
			storage.set('history', history || []);
		});

		return {
			get() {
				if (!history) {
					return new Highland(
						storage.get('history')
					)
					.each((_history) => {
						history = _history;
					})
					.errors(() => {
						storage.set('history', [], () => {
							history = [];
						});
					});
				}
				else {
					return new Highland(history);
				}
			},
			push(element) {
				this.get().done(() => {
					let lastCommand = history
						[history.length - 1];

					if (lastCommand !== element) {
							history.push(element);
					}
				});
			}
		};
	});
