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


describe('_.isUniq mixin', () => {
    it('should return true when given an empty array as the first param', done => {
        expect( _.isUniq( [ ] ) ).to.equal( true )
        done()
    })

    it('should return false when given a single-level array with duplicates', done => {
        expect( _.isUniq( [ 1, 2, 3, 2 ] ) ).to.equal( false )
        done()
    })

    it('should return true when given a single-level array without duplicates', done => {
        expect( _.isUniq( [ 1, 2, 3, 4 ] ) ).to.equal( true )
        done()
    })

    it('should return false when given an array of objects with duplicates, and no element is provided', done => {
        expect( _.isUniq( [ {a: 1}, {a: 2}, {a: 1} ] ) ).to.equal( false )
        done()
    })

    it('should return true when given an array of objects without duplicates, and no element is provided', done => {
        expect( _.isUniq( [ {a: 1}, {a: 2}, {a: 3} ] ) ).to.equal( true )
        done()
    })

    it('should return false when given an array of objects, and a specific element is provided, which specifies an element containing duplicate values', done => {
        expect( _.isUniq( [ {a: 1, b: 2}, {a: 2, b: 5}, {a: 1, b: 2} ], 'b') ).to.equal( false )
        done()
    })

    it('should return true when given an array of objects, and a specific element is provided, which specifies an element containing unique values', done => {
        expect( _.isUniq( [ {a: 1, b: 3}, {a: 2, b: 5}, {a: 1, b: 2} ], 'b') ).to.equal( true )
        done()
    })

    it('should throw an error when given something other than an array as the collection parameter', done => {
        expect( () => _.isUniq( 'foo' ) ).to.throw( Error )
        done()
    })
})
