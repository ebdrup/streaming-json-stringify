var assert = require('assert')
var PassThrough = require('stream').PassThrough
var cat = require('cat-stream')

var Stringify = require('..')

describe('Streamify()', function () {
  it('should work with an empty stream', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(Stringify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n\n]\n')
      done()
    }))

    stream.end()
  })

  it('should work with a stream of length 1', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(Stringify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n{}\n]\n')
      done()
    }))

    stream.write({})
    stream.end()
  })

  it('should work with a stream of length 2', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(Stringify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n{}\n,\n{}\n]\n')
      done()
    }))

    stream.write({})
    stream.write({})
    stream.end()
  })

  it('should work with non-objects', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(Stringify()).pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n"hello"\n]\n')
      done()
    }))

    stream.write('hello')
    stream.end()
  })

  it('should return a string if encoding: "utf8"', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    stream.pipe(Stringify({
      encoding: 'utf8'
    })).once('data', function (chunk) {
      assert.equal(typeof chunk, 'string')
      done()
    })

    stream.write({})
    stream.end()
  })

  it('should allow a space argument to JSON.stringify()', function (done) {
    var stream = new PassThrough({
      objectMode: true
    })

    var stringify = Stringify()
    stringify.space = 2

    var obj = {
      a: 1
    }

    stream
    .pipe(stringify)
    .pipe(cat(function (err, buf) {
      assert.ifError(err)
      assert.equal(buf.toString('utf8'), '[\n' + JSON.stringify(obj, null, 2) + '\n]\n')

      done()
    }))

    stream.end(obj)
  })
})