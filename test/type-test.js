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

describe('_.type mixin', () => {
    it('should identify an array as an array', done => {
        expect( _.type([]) === 'array' ).to.equal( true )
        done()
    })

    it('should identify an object as an object', done => {
        expect( _.type({}) === 'object' ).to.equal( true )
        done()
    })

    it('should identify a string as a string', done => {
        expect( _.type('test') === 'string' ).to.equal( true )
        done()
    })

    it('should identify a number as a number', done => {
        expect( _.type( 5 ) === 'number' ).to.equal( true )
        done()
    })

    it('should return undefined when no param is provided', done => {
        expect( _.type(  ) === 'undefined' ).to.equal( true )
        done()
    })

    it('should identify a null value', done => {
        expect( _.type( null ) === 'null' ).to.equal( true )
        done()
    })
})
