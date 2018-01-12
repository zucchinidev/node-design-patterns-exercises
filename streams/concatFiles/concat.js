const concatFiles = require('./concatFiles')
const destination = process.argv[2]
const files = process.argv.slice(3)
concatFiles(destination, files, () => {
  console.log('Files concatenated successfully')
})

// node concat allTogether.txt file1.txt file2.txt file3.txt
