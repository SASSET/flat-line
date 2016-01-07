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

    _( trues )
        .forEach( b => {
            it(`${b} (Type ${typeof b}) to equal true`, done => {
                expect( _.bool( b ) === true ).to.equal( true )
                done()
            })
        })
        .commit()

    _( falses )
        .forEach( b => {
            it(`${b} (Type ${typeof b}) to equal false`, done => {
                expect( _.bool( b ) === false ).to.equal( true )
                done()
            })
        })
        .commit()

    it('String "foo" to not equal true', done => {
        expect( _.bool( 'foo' ) === true ).to.equal( false )
        done()
    })

    it('String "foo" to equal true (with array of additional true types)', done => {
        expect( _.bool( 'foo', ['foo','bar'] ) === true ).to.equal( true )
        done()
    })

    it('Custom true type "bar" to equal true', done => {
        expect( _.bool( 'bar', 'bar' ) === true ).to.equal( true )
        done()
    })

    it('Custom true type "BAZ" to equal true', done => {
        expect( _.bool( 'BAZ', 'baz', true ) === true ).to.equal( true )
        done()
    })

    it('Illegal additional true type to throw an error', done => {
        expect(() => _.bool( 'foo', {bar: 'baz'} )).to.throw( Error )
        done()
    })
})
