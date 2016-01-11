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

describe('_.sha1 mixin', () => {
    it('should return 0a4d55a8d778e5022fab701977c5d840bbc486d0 when given "Hello World"', done => {
        expect( _.sha1( 'Hello World' ) === '0a4d55a8d778e5022fab701977c5d840bbc486d0' ).to.equal( true )
        done()
    })

    it('should return 1472543473c082833b239fee0f615b284b970519 when given a UTF-8 encoded string (Samea s PHP)', done => {
        expect( _.sha1('TÃ©lÃ©com') === '1472543473c082833b239fee0f615b284b970519' ).to.equal( true )
        done()
    })

    it('should return 1f7baa5ae8ecbfc67e817518a7c1b672089716ea when given a ISO-8859-1 encoded string (Same as PHP)', done => {
        expect( _.sha1('Télécom') === '1f7baa5ae8ecbfc67e817518a7c1b672089716ea' ).to.equal( true )
        done()
    })
})
