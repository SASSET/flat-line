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

describe('_.replace mixin', () => {
    it('should convert test to TesT', done => {
        expect( _.replace( 'test', { t: 'T'} ) === 'TesT' ).to.equal( true )
        done()
    })

    it('should replace Windows with Linux and XP with RHEL (using an array of objects for multiple replacements)', done => {
        expect( _.replace( 'Windows XP', [{ windows: 'Linux'}, {xp: 'RHEL'}], 'i' ) === 'Linux RHEL' ).to.equal( true )
        done()
    })

    it('should not convert abcd to DCBA because the case [i]nsensitive flag was not provided (i)', done => {
        expect( _.replace( 'abcd', { ABCD: 'DCBA'} ) === 'abcd' ).to.equal( true )
        done()
    })

    it('to throw an error when given a string value as the replacements parameter', done => {
        expect(() => __.replace('foo', 'bar')).to.throw( Error )
        done()
    })
})