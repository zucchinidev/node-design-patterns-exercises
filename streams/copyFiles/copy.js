const copyFiles = require('./copyFiles')
const files = process.argv.slice(2)
copyFiles(files, () => {
  console.log('Files copied successfully')
})
// node copy file1.txt file2.txt file3.txt
