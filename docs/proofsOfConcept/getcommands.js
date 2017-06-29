const Highland = require('highland');
const fs = require('fs');

let test = process.env.PATH.split(':');

//test.pop();//Temporary workaround for an unexisting folder

const readdir = Highland.wrapCallback(fs.readdir);
//const stat = Highland.wrapCallback(fs.stat);

let commands = new Highland(test)
	.map((path) => readdir(path)
		.errors((err) => console.log(err))
	)
	.flatten();


commands.toArray((array) => console.log(array));
