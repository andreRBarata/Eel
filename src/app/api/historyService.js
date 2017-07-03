/**
*	Manages the storage of commands history
*	@author André Barata
*/
const Highland	= require('highland');
const JsonDB	= require('node-json-db');
const remote	= require('electron').remote;
const path		= require('path');

let historyService = {
	_data: new JsonDB(
	   path.join(
		   remote.app.getPath('userData'),
		   'data.json'
	   ),
	   true
   ),
	get() {
		if (!historyService._data.getData('/').history) {
			historyService
				._data.push('/history', []);
		}

		return new Highland(
			historyService
				._data.getData('/history')
		);
	},
	push(element) {
		historyService.get()
			.last()
			.toArray(([last]) => {
				if (last && last !== element || !last) {
					historyService
						._data
						.push(
							'/history[]',
							element
						);
				}
			});
	}
};

module.exports = historyService;
