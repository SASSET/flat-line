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

/*
describe('_.passwordHash and _.passwordVerify mixin', () => {

    it('', done => {
        expect( _.randStr(15).length ).to.equal( 15 )
        done()
    })

    it('should return a random string 15 characters long (when given a numeric value in a string)', done => {
        expect( _.randStr('15').length ).to.equal( 15 )
        done()
    })

    it('should return a random string 20 characters long (when given NO length)', done => {
        expect( _.randStr().length ).to.equal( 20 )
        done()
    })

    it('should throw an error when a non-numeric string value is provided as the length parameter', done => {
        expect(() => _.randStr('foo')).to.throw( Error )
        done()
    })
})
*/