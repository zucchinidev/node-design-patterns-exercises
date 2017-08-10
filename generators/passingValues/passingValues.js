function* passingValues () {
  const value = yield null
  console.log(`hello ${value}`)
}

const generator = passingValues()
// The first time the next() method is invoked, the generator reaches the first yield statement and is then put on pause.
generator.next()
// When next('world') is invoked, the generator resumes from the point where it was put on pause,
// which is on the yield instruction, but this time we have a value that is passed back to
// the generator. This value will then be set into the value variable.
// The generator then executes the console.log() instruction and terminates.
generator.next('world')