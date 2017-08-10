'use strict'

const fs = require('fs')
const path = require('path')
const promisify = require('../tools/promises').promisify
const request = promisify(require('request'))
const mkdirp = promisify(require('mkdirp'))
const utilities = require('../tools/url')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const DEFAULT_NESTING = 1

function spiderLinks (currentUrl, body, nesting) {
  const links = utilities.getPageLinks(currentUrl, body)
  let promise = Promise.resolve()
  if (nesting === 0) {
    return promise
  }

  links.forEach(link => {
    promise = promise.then(() => spider(link, nesting - 1))
  })

  return promise
}

function saveFile (fileName, contents, callback) {
  mkdirp(path.dirname(fileName), err => {
    if (err) {
      return callback(err)
    }
    fs.writeFile(fileName, contents, callback)
  })
}

function download (url, fileName) {
  console.log(`Downloading ${url}`)
  let body
  return request(url)
    .then(response => {
      body = response.body
      return mkdirp(path.dirname(fileName))
    })
    .then(() => writeFile(fileName, body))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`)
      return body
    })
}

function spider (url, nesting, callback) {
  const fileName = utilities.urlToFilename(url)
  return readFile(fileName)
    .then(
      body => (spiderLinks(url, body, nesting)),
      err => {
        if (err.code !== 'ENOENT') {
          throw err
        }
        return download(url, fileName).then(body => spiderLinks(url, body, nesting))
      })
}


spider(process.argv[2], DEFAULT_NESTING)
  .then(() => {
    console.log(`Download complete"`)
  })
  .catch(err => console.error(err))
