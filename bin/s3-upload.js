'use strict';

const fs = require('fs'); // Filesystem Module

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

const awsS3UploadOptions = {
  ACL: 'public-read', // Permissions on the uploaded file
  Body: '', // The file itself to upload
  Bucket: 'nog-wdi-upload-bucket', // My bucket on AWS
  ContentType: 'application/octet-stream', // Unencoded binary data
  Key: 'test/test.bin' // Where it's going in the bucket
};

// Read file and then...
readFile(filename)
.then((data) => console.log(`${filename} is ${data.length} bytes long.`))
.catch((err) => console.error(err));
