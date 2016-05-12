'use strict';

require('dotenv').config();

const fs = require('fs'); // Filesystem Module
const fileType = require('file-type'); // FileType Determinant Module
const AWS = require('aws-sdk'); // Amazon Web Services - Software Development Kit
const crypto = require('crypto'); // Crypto module for generating random filenames

const s3 = new AWS.S3();

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

// determine filetype
const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));

// create a random string for filenames
const randomHexString = (length) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('hex'));
      }
    });
  });

// Upload to Amazon Web Services
const awsUpload = (file) =>
  randomHexString(16)
  .then((filename) => {
    let dir = new Date().toISOString().split('T')[0];
    return {
      ACL: 'public-read', // Permissions on the uploaded file
      Body: file.data, // The file itself to upload
      Bucket: process.env.AWS_S3_BUCKET_NAME, // My bucket on AWS
      ContentType: file.mime, // Unencoded binary data
      Key: `${dir}/${filename}.${file.ext}` // Where it's going in the bucket
    };
  })
  .then((params) =>
    new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  );

// Read file and then...
readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
.then((s3response) => console.log(s3response))
.catch((err) => console.error(err));
