'use strict';

const fs = require('fs'); // Filesystem Module
const fileType = require('file-type'); // FileType Determinant Module

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

const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));

const awsUpload = (file) => {
  const options = {
    ACL: 'public-read', // Permissions on the uploaded file
    Body: file.data, // The file itself to upload
    Bucket: 'nog-wdi-upload-bucket', // My bucket on AWS
    ContentType: file.mime, // Unencoded binary data
    Key: `test/test.${file.ext}` // Where it's going in the bucket
  };
  return Promise.resolve(options);
};



// Read file and then...
readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
.then((file) => console.log(file))
.catch((err) => console.error(err));
