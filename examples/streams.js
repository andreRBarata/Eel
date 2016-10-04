const Readable = require('stream').Readable;

const myReadable = new Readable({
  read(size) {}
});

console.log(myReadable.push);
myReadable.push('teste');

myReadable.pipe(process.stdout);

console.log(myReadable);
