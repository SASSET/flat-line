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

describe('_.nl2br mixin', () => {
    it('should change One\r\nTwo\n\rThree\nFour\rFive to One</br>Two</br>Three</br>Four</br>Five', done => {
        expect( _.nl2br("One\r\nTwo\n\rThree\nFour\rFive") === 'One</br>Two</br>Three</br>Four</br>Five' ).to.equal( true )
        done()
    })

    it('should change One\r\nTwo\n\rThree\nFour\rFive to One</BR>Two</BR>Three</BR>Four</BR>Five', done => {
        expect( _.nl2br("One\r\nTwo\n\rThree\nFour\rFive", '</BR>') === 'One</BR>Two</BR>Three</BR>Four</BR>Five' ).to.equal( true )
        done()
    })
})