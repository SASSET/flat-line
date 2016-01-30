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

describe('_.removeObj mixin', () => {
    let statics = 'foo'

    const testObj = {
        foo: 'a',
        bar: 'b',
        baz: 'c'
    }

    statics = _.removeObj(testObj, statics)

    it('should have added the "foo" element to the statics object (converted from a string)', done => {
        expect( ! _.isUndefined( statics.foo ) ).to.equal( true )
        done()
    })

    it('should have kept the elements "bar" and "baz" in the original object', done => {
        expect( ! _.isUndefined( testObj.bar ) && ! _.isUndefined( testObj.baz ) ).to.equal( true )
        done()
    })

    it('should not have moved the elements "bar" or "baz" to the statics object', done => {
        expect( _.isUndefined( statics.bar ) && _.isUndefined( statics.baz ) ).to.equal( true )
        done()
    })
})