const path = require('path')
const thunkify = require('thunkify')
const co = require('co')

const urlUtils = require('../../tools/url')
const request = thunkify(require('request'))
const fs = require('fs')
const mkdirp = thunkify(require('mkdirp'))
const readFile = thunkify(fs.readFile)
const writeFile = thunkify(fs.writeFile)
const nextTick = thunkify(process.nextTick)

function * spiderLinks (currentUrl, body, nesting) {
  if (nesting === 0) {
    return nextTick()
  }

  const links = urlUtils.getPageLinks(currentUrl, body)
  for (let i = 0; i < links.length; i++) {
    yield spider(links[i], nesting - 1)
  }
}

function * download (url, fileName) {
  console.log(`Downloading ${url}`)
  const response = yield request(url)
  const body = response[1]
  yield mkdirp(path.dirname(fileName))
  yield writeFile(fileName, body)
  console.log(`Downloaded and saved ${url}`)
  return body
}

function * spider (url, nesting) {
  const fileName = urlUtils.urlToFilename(url)
  let body
  try {
    body = yield readFile(fileName, 'utf8')
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    body = yield download(url, fileName)
  }
  yield spiderLinks(url, body, nesting)
}

co(function * () {
  try {
    yield spider(process.argv[2], 1)
    console.log('Download complete')
  } catch (err) {
    console.log(err)
  }
})