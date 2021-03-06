var expect = require('chai').expect
var config = require('./config')
var Feedback = require('../').Feedback
var xiaomiMocker = require('./xiaomi-mocker')

var feedback = new Feedback({
  appSecret: config.appSecret,
  interval: 0.5,
  production: true
})

describe('Feedback::construct', function () {
  it('should throw if not configure with production', function () {
    expect(function () {
      /* eslint-disable no-new */
      new Feedback({
        appSecret: config.appSecret
      })
    }).to.throw('this feature only vaild in production mode')
  })
})

describe('Feedback::start/cancel', function () {
  it('should work ok with start/cancel', function (done) {
    xiaomiMocker('getInvalidRegIds')
    expect(feedback.interval).to.be.undefined()
    feedback.start()
    expect(feedback.interval).to.not.be.undefined()

    feedback.on('feedback', function (list) {
      expect(list).to.be.instanceof(Array)
      feedback.cancel()
      expect(feedback.interval).to.be.undefined()
      done()
    })
  })
})

describe('Feedback::getInvalidRegIds', function () {
  it('should ok', function * () {
    xiaomiMocker('getInvalidRegIds')
    let list = yield feedback.getInvalidRegIds()
    expect(list).to.be.instanceof(Array)
  })
})
