module.exports.promisify = function (callbackBasedApi) {
  return function promisified () {
    const args = [].slice.call(arguments)
    return new Promise((resolve, reject) => {
      const callback = (err, result) => {
        if (err) {
          return reject(err)
        }

        if (arguments.length <= 2) {
          return resolve(result)
        }
        resolve([].slice.call(arguments, 1))

      }
      args.push(callback)
      callbackBasedApi.apply(null, args)
    })
  }
}
