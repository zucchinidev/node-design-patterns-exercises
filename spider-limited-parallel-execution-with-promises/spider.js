'use strict'

const fs = require('fs')
const path = require('path')
const promisify = require('../tools/promises').promisify
const request = promisify(require('request'))
const mkdirp = promisify(require('mkdirp'))
const utilities = require('../tools/url')
const TaskQueue = require('./TaskQueue')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const DEFAULT_NESTING = 1
const CONCURRENCY_TASK = 2
const downloadQueue = new TaskQueue(CONCURRENCY_TASK)

function spiderLinks (currentUrl, body, nesting) {
  const links = utilities.getPageLinks(currentUrl, body)
  let promise = Promise.resolve()
  if (nesting === 0 || links.length === 0) {
    return promise
  }

  return new Promise((resolve, reject) => {
    let completed = 0
    links.forEach(link => {
      const task = () => {
        return spider(link, nesting - 1)
          .then(() => {
            completed += 1
            if (completed === links.length) {
              resolve()
            }
          })
          .catch(() => reject())
      }
      downloadQueue.pushTask(task)
    })
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

const spidering = new Map()

function spider (url, nesting) {
  if (spidering.has(url)) {
    return Promise.resolve()
  }
  spidering.set(url, true)

  const fileName = utilities.urlToFilename(url)
  return readFile(fileName, 'utf8')
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
