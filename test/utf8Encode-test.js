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

describe('_.utf8Encode mixin', () => {
    it('should return "test" when given "test"', done => {
        expect( _.utf8Encode('test') === 'test' ).to.equal( true )
        done()
    })

    it('should return null when given null', done => {
        expect( _.utf8Encode( null ) === null ).to.equal( true )
        done()
    })

    it('should return undefined when given an undefined value', done => {
        expect( typeof _.utf8Encode( undefined ) === 'undefined' ).to.equal( true )
        done()
    })

    it('should return a string of numbers when given a numerical value', done => {
        expect( _.utf8Encode( 123 ) === '123' ).to.equal( true )
        done()
    })

    it('should return 55296 when given 0xD800', done => {
        expect( _.utf8Encode( 0xD800 ) === '55296' ).to.equal( true )
        done()
    })

    it('should return a funky encoded utf8 string, when given an already funky encoded string (Same as PHP)', done => {
        expect( _.utf8Encode('TÃ©lÃ©com') === 'TÃÂ©lÃÂ©com' ).to.equal( true )
        done()
    })

    it('to throw an error when given an object', done => {
        expect(() => _.utf8Encode( {} )).to.throw( Error )
        done()
    })

    it('to throw an error when given an array', done => {
        expect(() => _.utf8Encode( [] )).to.throw( Error )
        done()
    })
})