const Highland = require('highland');
const fs = require('fs');

let test = process.env.PATH.split(':');

//test.pop();//Temporary workaround for an unexisting folder

const readdir = Highland.wrapCallback(fs.readdir);
//const stat = Highland.wrapCallback(fs.stat);

//#ForThisSprint:20 Needs filtering for non excutables
let commands = new Highland(test)
	.map((path) => readdir(path)
		.errors((err) => console.log(err))
	)
	.flatten();


commands.toArray((array) => console.log(array));
