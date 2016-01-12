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

describe('_.swap mixin', () => {
    it('should swap the keys/values in an object with two elements', done => {
        expect( JSON.stringify( _.swap( {a:'b', c:'d'} ) ) === '{"b":"a","d":"c"}' ).to.equal( true )
        done()
    })

    it('should throw an error when given an ARRAY', done => {
        expect(() => _.swap( [] )).to.throw( Error )
        done()
    })

    it('should throw an error when given a STRING', done => {
        expect(() => _.swap( 'test' )).to.throw( Error )
        done()
    })

    it('should throw an error when given a NUMBER', done => {
        expect(() => _.swap( 123 )).to.throw( Error )
        done()
    })
})
