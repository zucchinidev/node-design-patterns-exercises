// Readable Streams: receive the data in Flowing mode.
// Flowing mode is an inheritance of the old version of the stream interface (also known as Streams1),
// and offers less flexibility to control the flow of data.
// cat file.txt | node readStdin.js
process.stdin
  .on('data', (chunk) => {
    console.log(`
        Chunk read: (${chunk.length}) ${chunk.toString()}`
    )
  })
  .on('end', () => process.stdout.write('End of stream'))