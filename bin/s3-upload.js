'use strict';

const fs = require('fs'); // Filesystem Module

let filename = process.argv[2] || '';

// read file, then upload to Amazon S3
// by not specifying an encoding (e.g. utf8), will get back a buffer (binary data)
fs.readFile(filename, (err, data) => {
  if (err) {
    return console.error(err);
  }

  console.log(`${filename} is ${data.length} bytes long.`);
});
