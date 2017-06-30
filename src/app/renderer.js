/**
*	This file is required by the index.html file
*	and will be executed in the renderer process
*	for that window.
*
*	All of the Node.js APIs are available in this
*	process.
*
*	@author André Barata
*/

global.CodeMirror =
	require('codemirror/lib/codemirror');

const Highland	= require('highland');
const path		= require('path');

//TODO: Replace this id:16
// Loading the syntaxes
Highland.wrapCallback(
	require('fs').readdir
)(path.join(__dirname, '../../node_modules/codemirror/mode'))
	.flatten()
	.filter((file) => !file.match(/\.js$/))
 	.each((file) => {
		let name = file.replace('.js', '');
		require(`codemirror/mode/${name}/${name}`);
	});


require('./assets/languages/eelscript');

// require('./localRef/localRef.js');
// require('./pathLink/pathLink.js');
// require('./commandService/commandService.js');
// require('./highlightedBlock/highlightedBlock.js');
// require('./historyService/historyService.js');
// require('./inputHighlight/inputHighlight.dir.js');
// require('./streamDisplay/streamDisplay.dir.js');
// require('./mainComponent/mainComponent.js');

global.scrollDown = () => {
	window.scrollTo(0, document.body.scrollHeight);
}
