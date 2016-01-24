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

describe('_.isEmail mixin', () => {
    it('should return false when given nothing', done => {
        expect( _.isEmail() ).to.equal( false )
        done()
    })

    it('should return false when given non-string', done => {
        expect( _.isEmail({}) ).to.equal( false )
        done()
    })

    it('should return false when given "fakeemail@test,com"', done => {
        expect( _.isEmail('fakeemail@test,com') ).to.equal( false )
        done()
    })

    it('should return false when given "notevenclose"', done => {
        expect( _.isEmail('notevenclose') ).to.equal( false )
        done()
    })

    it('should return false when given "john.doe@@gmail.com"', done => {
        expect( _.isEmail('john.doe@@gmail.com') ).to.equal( false )
        done()
    })

    it('should return true when given "john@gmail.com"', done => {
        expect( _.isEmail('john@gmail.com') ).to.equal( true )
        done()
    })

    it('should return true when given "john.doe@gmail.com"', done => {
        expect( _.isEmail('john.doe@gmail.com') ).to.equal( true )
        done()
    })

    it('should return true when given "john_doe@sub.domain.co.uk"', done => {
        expect( _.isEmail('john_doe@sub.domain.co.uk') ).to.equal( true )
        done()
    })

    it('should return true when given "john.m.doe@another-sub.domain.org"', done => {
        expect( _.isEmail('john.m.doe@another-sub.domain.org') ).to.equal( true )
        done()
    })
})
