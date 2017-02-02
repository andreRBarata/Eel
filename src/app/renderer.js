// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('angular');

window.CodeMirror =
	require('codemirror/lib/codemirror');
require('./assets/language/eelscript');
require('./app.js');
require('./inputHighlight/inputHighlight.dir.js');
require('./mainComponent/mainComponent.js');
require('./resultDisplay/resultDisplay.dir.js');
