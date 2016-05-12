'use strict';

require('dotenv').config();

const fs = require('fs'); // Filesystem Module
const fileType = require('file-type'); // FileType Determinant Module
const awsS3Upload = require('../lib/aws-s3-upload'); // Module for making AWS Uploads

let filename = process.argv[2] || '';

// read file, then upload to Amazon S3
const readFile = (filename) =>

  // implicit return of new Promise (one-line function declaration)
  new Promise((resolve, reject) => {

  // by not specifying an encoding (e.g. utf8), will get back a buffer (binary data)
  fs.readFile(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

// always return object with extension and mime
// determine filetype
const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));

// Read file and then...
readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsS3Upload)
.then((s3response) => console.log(s3response))
.catch((err) => console.error(err));
