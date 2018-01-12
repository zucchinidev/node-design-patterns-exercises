// simple service to monitor the status of a big list of URLs.
// all these URLs are contained in a single file and are newline separated.
'use strict'

const fs = require('fs')
const split = require('split')
const request = require('request')
const ParallelStream = require('./parallelStream')
const urlsFile = 'urls.txt'

const transform = function (url, encoding, push, done) {
  if (!url) {
    return done()
  }
  request.head(url, (err, response) => {
    const status = err ? 'down' : 'up'
    push(`${url} is ${status}\n`)
    done()
  })
}

fs.createReadStream(urlsFile)
  .pipe(split())
  .pipe(new ParallelStream(transform))
  .pipe(fs.createWriteStream('results.txt'))
  .on('finish', () => console.log('all urls were checked'))


