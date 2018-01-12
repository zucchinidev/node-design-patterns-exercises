'use strict'

const stream = require('stream')

class ParallelStream extends stream.Transform {
  constructor (userTransform) {
    super({ objectMode: true })
    this.userTransform = userTransform
    this.runningTask = 0
    this.terminateCallback = null
  }

  _transform (chunk, encoding, done) {
    this.runningTask++
    this.userTransform(chunk, encoding, this.push.bind(this), this._onUserTransformComplete.bind(this))
    done() // The trick for triggering the processing of another item in parallel is exactly this; we are not waiting for the userTransform() function to complete before invoking done(); instead, we do it immediately
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

  /**
   * This method is invoked every time an asynchronous task completes.
   * It checks whether there are any more tasks running and, if there are none,
   * it invokes the this.terminateCallback() function, which will cause the stream to end,
   * releasing the finish event that was put on hold in the _flush() method.
   * @param err
   * @returns {boolean}
   * @private
   */
  _onUserTransformComplete (err) {
    this.runningTask--
    if (err) {
      return this.emit('error', err)
    }
    if (this.runningTask === 0) {
      this.terminateCallback && this.terminateCallback()
    }
  }
}

module.exports = ParallelStream
