'use strict'
const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const async = require('async')

const utilities = require('../tools/url')
const DEFAULT_NESTING = 1
const LIMIT_PARALLEL_TASK = 2

const downloadQueue = async.queue((taskData, callback) => {
  spider(taskData.link, taskData.nesting - 1, callback)
}, LIMIT_PARALLEL_TASK)

const spidering = new Map()

function spiderLinks (currentUrl, body, nesting, callback) {
  let hasErrors = false
  let completed = 0
  if (nesting === 0) {
    return process.nextTick(callback)
  }

  const links = utilities.getPageLinks(currentUrl, body)

  links.forEach(link => {
    const taskData = {link, nesting}
    downloadQueue.push(taskData, err => {
      if (err) {
        hasErrors = true
        return callback(err)
      }

      completed += 1
      if (!hasErrors && completed === links.length) {
        callback()
      }
    })
  })
}

function saveFile (fileName, contents, callback) {
  mkdirp(path.dirname(fileName), err => {
    if (err) {
      return callback(err)
    }
    fs.writeFile(fileName, contents, callback)
  })
}

function download (url, fileName, callback) {
  console.log(`Downloading ${url}`)
  request(url, (err, response, body) => {
    if (err) {
      return callback(err)
    }
    saveFile(fileName, body, err => {
      if (err) {
        return callback(err)
      }
      console.log(`Downloaded and saved: ${url}`)
      callback(null, body)
    })
  })
}

function spider (url, nesting, callback) {
  if (spidering.has(url)) {
    return process.nextTick(callback)
  }
  spidering.set(url, true)

  const fileName = utilities.urlToFilename(url)
  fs.readFile(fileName, 'utf-8', (err, body) => {
    if (err) {
      const fileNotFound = err.code === 'ENOENT'
      if (!fileNotFound) {
        return callback(err)
      }

      return download(url, fileName, (err, body) => {
        if (err) {
          return callback(err)
        }
        spiderLinks(url, body, nesting, callback)
      })
    }

    spiderLinks(url, body, nesting, callback)
  })
}

spider(process.argv[2], DEFAULT_NESTING, (err, filename, downloaded) => {
  if (err) {
    console.log(err)
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})
