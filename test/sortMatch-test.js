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

describe('_.sortMatch mixin',  () => {
    it('Unsorted arrays with same values to be matched', done => {
        expect( _.sortMatch( [1,2,3], [3,2,1] ) ).to.equal( true )
        done()
    })

    it('Unsorted arrays with different values to be matched', done => {
        expect( _.sortMatch( [1,2,3], [4,5,6] ) ).to.not.equal( true )
        done()
    })

    it('Unsorted objects with same values to be matched', done => {
        expect( _.sortMatch( {a:1,b:2,c:3}, {c:3,b:2,a:1} ) ).to.equal( true )
        done()
    })

    it('Unsorted objects with different values to be matched', done => {
        expect( _.sortMatch( {a:1,b:2,c:3}, {d:4,e:5,f:6} ) ).to.not.equal( true )
        done()
    })

    it('Mismatched object types to return false', done => {
        expect( _.sortMatch( {a:1,b:2,c:3}, [1,2,3] ) ).to.equal( false )
        done()
    })

    it('Array of non-objects to equal false', done => {
        expect( _.sortMatch( [1,2,3],[4,5,6] ) ).to.equal( false )
        done()
    })

    it('Non sortable values to throw an error', done => {
        expect(() => _.sortMatch( 'foo','bar' ) ).to.throw( Error )
        done()
    })

    it('Undefined first parameter to throw an error', done => {
        expect(() => _.sortMatch( [1,2,3] ) ).to.throw( Error )
        done()
    })

    it('Undefined second parameter to throw an error', done => {
        expect(() => _.sortMatch( undefined, [1,2,3] ) ).to.throw( Error )
        done()
    })
})