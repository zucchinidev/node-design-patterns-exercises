'use strict'

const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utilities = require('./utilities')

function spiderLinks (currentUrl, body, nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback)
  }

  const links = utilities.getPageLinks(currentUrl, body)
  const iterate = (index) => {
    if (index === links.length) {
      return callback()
    }

    spider(links[index], nesting - 1, (err) => {
      if (err) {
        return callback(err)
      }
      iterate(index + 1)
    })
  }

  iterate(0)
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
  const fileName = utilities.urlToFilename(url)
  fs.readFile(fileName, 'utf-8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return callback(err)
      }

      return download(url, fileName, err => {
        if (err) {
          return callback(err)
        }
        spiderLinks(url, body, nesting, callback)
      })
    }

    spiderLinks(url, body, nesting, callback)
  })
}

spider(process.argv[2], 1, (err, filename, downloaded) => {
  if (err) {
    console.log(err)
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})
