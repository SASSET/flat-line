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

describe('_.dontStartWith mixin', () => {
    it('should change .unhide-me to unhide-me', done => {
        expect( _.dontStartWith('.unhide-me', '.') ).to.equal( 'unhide-me' )
        done()
    })

    it('should leave unhide-me as it is', done => {
        expect( _.dontStartWith('unhide-me', '.') ).to.equal( 'unhide-me' )
        done()
    })
})