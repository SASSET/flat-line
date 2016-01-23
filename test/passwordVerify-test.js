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

describe('_.passwordVerify mixin', () => {
    const password = 'secret'
    const hash = 'd3eXU3x/LcnvQskL.eDruJHeJO+V6FaDYd+iF/DfrgJ7bYca3G6AR+o3Rd7j20osNLiQNNb/Q/6RZc7c6b/L9l5FW++LE7eX9g3NxWFxXg=='

    it('should throw an error when not given any parameters', done => {
        expect(() => _.passwordVerify()).to.throw( Error )
        done()
    })

    it('should throw an error when not given a hash', done => {
        expect(() => _.passwordVerify('secret')).to.throw( Error )
        done()
    })

    it('should throw an error when given non-string parameters', done => {
        expect(() => _.passwordVerify([], {})).to.throw( Error )
        done()
    })

    it('should return false when given too short of a hash to validate', done => {
        expect( _.passwordVerify('secret', 'ThisIsTooShort') ).to.equal( false )
        done()
    })

    it('should return false when given incorrect password for defined hash', done => {
        expect( _.passwordVerify( 'foo', hash ) ).to.equal( false )
        done()
    })

    it('should return true when given correct password for defined hash', done => {
        expect( _.passwordVerify( password, hash ) ).to.equal( true )
        done()
    })
})