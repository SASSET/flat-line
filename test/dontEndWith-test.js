'use strict'

const _ = require( '../' )
const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const suite = lab.suite
const it = lab.test
const before = lab.before
const describe = lab.experiment
const after = lab.after
const expect = Code.expect

describe('_.dontEndWith mixin', () => {
    it('should change /v1/resource/test/ to /v1/resource/test', done => {
        expect( _.dontEndWith('/v1/resource/test/', '/') ).to.equal( '/v1/resource/test' )
        done()
    })

    it('should leave /v1/resource/test as it is', done => {
        expect( _.dontEndWith('/v1/resource/test', '/') ).to.equal( '/v1/resource/test' )
        done()
    })
})