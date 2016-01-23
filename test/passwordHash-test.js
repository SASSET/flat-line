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

describe('_.passwordHash mixin', () => {
    it('should should generate a 108 character hash', done => {
        expect( _.passwordHash('secret').length ).to.equal( 108 )
        done()
    })

    it('should not match another hash that was generated with the same string', done => {
        expect( _.passwordHash('secret') ).to.not.equal( _.passwordHash('secret') )
        done()
    })

    it('should throw an error when given no password to hash', done => {
        expect(() => _.passwordHash()).to.throw( Error )
        done()
    })

    it('should throw an error when given an empty string', done => {
        expect(() => _.passwordHash('')).to.throw( Error )
        done()
    })

    it('should throw an error when given something other than a string', done => {
        expect(() => _.passwordHash([])).to.throw( Error )
        done()
    })
})