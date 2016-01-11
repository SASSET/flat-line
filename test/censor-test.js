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
    it('should change asshat to a***at (with no 2nd or 3rd param)', done => {
        expect( _.censor( 'asshat' ) === 'a***at' ).to.equal( true )
        done()
    })

    it('should fully black out asshat with !', done => {
        expect( _.censor( 'asshat','!','full' ) === '!!!!!!' ).to.equal( true )
        done()
    })

    it('should mask the first and last letters of asshat with #', done => {
        expect( _.censor( 'asshat','#', 'firstlast' ) === '#ssha#' ).to.equal( true )
        done()
    })

    it('should mask all but first and last letters with !', done => {
        expect( _.censor( 'asshat', '!','middle' ) === 'a!!!!t' ).to.equal( true )
        done()
    })

    it('should cover a single letter with *', done => {
        expect( _.censor( 'asshat', null, 'single' ) === 'as*hat' ).to.equal( true )
        done()
    })

    it('should censor the entire word since the mask is more than a single character', done => {
        expect( _.censor( 'asshat', '-CENSORED-' ) === '-CENSORED-' ).to.equal( true )
        done()
    })

    it('should leave foobar as foobar', done => {
        expect( _.censor( 'foobar' ) === 'foobar' ).to.equal( true )
        done()
    })

})
