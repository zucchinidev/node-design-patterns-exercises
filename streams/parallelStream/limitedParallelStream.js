const stream = require('stream')

class LimitedParallelStream extends stream.Transform {
  constructor (concurrency, userTransform) {
    super({ objectMode: true })
    this.concurrency = concurrency
    this.userTransform = userTransform
    this.runningTask = 0
    this.terminateCallback = null
    this.continueCallback = null // any pending _transform method
  }

  _transform (chunk, encoding, done) {
    this.runningTask++
    this.userTransform(chunk, encoding, this.push.bind(this), this._onUserTransformComplete.bind(this))
    if (this.runningTask < this.concurrency) {
      done()
    } else {
      this.continueCallback = done
    }
  }

  /**
   * this method is invoked just before the stream terminates
   * @param {Function} done
   * @private
   * @override
   */
  _flush (done) {
    if (this.runningTask > 0) {
      // if there are still tasks running we can put on hold the release of the finish event by not invoking the done()
      this.terminateCallback = done
    } else {
      done()
    }
  }

  _onUserTransformComplete (err) {
    this.runningTask--
    if (err) {
      return this.emit('error', err)
    }

    const tmpCallback = this.continueCallback
    this.continueCallback = null
    tmpCallback && tmpCallback()
    if (this.runningTask === 0) {
      this.terminateCallback && this.terminateCallback()
    }
  }
}

module.exports = LimitedParallelStream
