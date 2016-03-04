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

describe('_.validPattern mixin', () => {
    describe('(without reason)',() => {
        it('should pass when given a simple string value', done => {
            expect( _.validPattern( 'foobar') ).to.equal( true )
            done()
        })

        it('should pass when given a numeric value', done => {
            expect( _.validPattern( 123) ).to.equal( true )
            done()
        })

        it('should pass when given a float value', done => {
            expect( _.validPattern( 2.3 ) ).to.equal( true )
            done()
        })

        it('should pass when given a valid pattern and valid flags', done => {
            expect( _.validPattern( 'test','gi' ) ).to.equal( true )
            done()
        })

        it('should fail when given a valid pattern and invalid flags', done => {
            expect( _.validPattern( 'test','gasdfasdfi' ) ).to.equal( false )
            done()
        })

        it('should fail when given an invalid pattern and valid flags', done => {
            expect( _.validPattern( '^[a-z]{3,5}\-(dev|stg|prd|tst', 'gi' ) ).to.equal( false )
            done()
        })

        it('should pass when given a RegExp object', done => {
            expect( _.validPattern( new RegExp(/test/) ) ).to.equal( true )
            done()
        })

        it('should fail when given a string with a broken regex pattern', done => {
            expect( _.validPattern( '^[a-z]{3,5}\-(dev|stg|prd|tst' ) ).to.equal( false )
            done()
        })
    })


    describe('(WITH reason)',() => {
        it('should pass when given a simple string value', done => {
            expect( _.validPattern( 'foobar', null, true ) ).to.equal( true )
            done()
        })

        it('should pass when given a numeric value', done => {
            expect( _.validPattern( 123, null, true ) ).to.equal( true )
            done()
        })

        it('should pass when given a float value', done => {
            expect( _.validPattern( 2.3, null, true ) ).to.equal( true )
            done()
        })

        it('should pass when given a valid pattern and valid flags', done => {
            expect( _.validPattern( 'test','gi', true ) ).to.equal( true )
            done()
        })

        it('should fail when given a valid pattern and invalid flags', done => {
            expect( _.validPattern( 'test','gasdfasdfi', true ) ).to.be.a.string()
            done()
        })

        it('should fail when given an invalid pattern and valid flags', done => {
            expect( _.validPattern( '^[a-z]{3,5}\-(dev|stg|prd|tst', 'gi', true ) ).to.be.a.string()
            done()
        })

        it('should pass when given a RegExp object', done => {
            expect( _.validPattern( new RegExp(/test/), null, true ) ).to.equal( true )
            done()
        })

        it('should fail when given a string with a broken regex pattern', done => {
            expect( _.validPattern( '^[a-z]{3,5}\-(dev|stg|prd|tst', null, true ) ).to.be.a.string()
            done()
        })
    })
})
