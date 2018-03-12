const expect = require('chai').expect
var chai = require('chai')
var spies = require('chai-spies')
chai.use(spies)

describe('Simple math confirmation', () => {
  it('does really simple addition', () => {
    expect(2 + 2).to.equal(4)
  })
})



describe('Actual time of timeout', () => {

  it('tests if a setTimout of 1000 ms really takes approximately that long', (done) => {
    let startTime = new Date()
    setTimeout(() => {
      let actualTime = new Date() - startTime
      expect(actualTime).to.be.closeTo(1000, 100)
      done()
    }, 1000)
  })
})

describe('array.forEach', () => {
  it('Counts invocations of the array forEach method', () => {
    let arr = [1, 2, 3, 4]
    let count = 0
    let func = (num) => {count += num}
    func = chai.spy(func);
    arr.forEach(func)
    expect(func).to.have.been.called.exactly(arr.length)
  })
})
