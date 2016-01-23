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

describe('_.bool mixin', () => {
    const trues  = [ true, 'true', 1, '1' ]
    const falses = [ false, 'false', 0, '0' ]

    _( trues ).chain()
        .forEach( b => {
            it(`should equal true when given ${b} (typeof: ${typeof b})`, done => {
                expect( _.bool( b )  ).to.equal( true )
                done()
            })
        })
        .commit()

    _( falses ).chain()
        .forEach( b => {
            it(`should equal false when given ${b} (typeof: ${typeof b})`, done => {
                expect( _.bool( b ) === false ).to.equal( true )
                done()
            })
        })
        .commit()

    it('should return false when given string "foo"', done => {
        expect( _.bool( 'foo' ) ).to.equal( false )
        done()
    })

    it('should return true when given string "foo", since foo was provided as an additional true-type value in an ARRAY', done => {
        expect( _.bool( 'foo', ['foo','bar'] ) ).to.equal( true )
        done()
    })

    it('should return true when given string "foo", since foo was provided as an additional true-type value', done => {
        expect( _.bool( 'bar', 'bar' ) ).to.equal( true )
        done()
    })

    it('should return true when given string "BAZ", since baz was provided as an additional true-type value, and case-insensitive matching was enabled', done => {
        expect( _.bool( 'BAZ', 'baz', true ) ).to.equal( true )
        done()
    })

    it('should throw an error, since the 2nd parameter for additional true-types was an object (should be string or array)', done => {
        expect(() => _.bool( 'foo', {bar: 'baz'} )).to.throw( Error )
        done()
    })
})
