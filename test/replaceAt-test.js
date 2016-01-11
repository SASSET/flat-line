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

describe('_.replaceAt mixin', () => {
    it('should turn baz to bar', done => {
        expect( _.replaceAt( 'baz', 2, 'r') === 'bar' ).to.equal( true )
        done()
    })

    it('should convert bad-word to b**-w**d', done => {
        expect( _.replaceAt( 'bad-word', [1,2,5,6], '*') === 'b**-w**d' ).to.equal( true )
        done()
    })

    it('should convert Hello World to Hello ?????', done => {
        expect( _.replaceAt( 'Hello World', [6,7,8,9,10] ) === 'Hello ?????' ).to.equal( true )
        done()
    })
})
