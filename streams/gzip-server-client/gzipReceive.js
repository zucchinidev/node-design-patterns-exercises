const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

const server = http.createServer((req, res) => {
  const filename = req.headers.filename
  console.log(`File request received ${filename}`)

  const path = `./tmp/${filename}.copy`
  console.log(path)
  req
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(path))
    .on('finish', () => {
      res.writeHead(201, {'Content-Type': 'text/plain'})
      console.log(`File saved: ${filename}`)
      res.end(`That's it\n`)
    })
})

server.listen(3000, () => console.log('Server listening'))