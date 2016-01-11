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

describe('_.br2nl mixin', () => {
    it('should change One<br>Two</br>Three</BR>Four<BR>Five to One\r\nTwo\r\nThree\r\nFour\r\nFive', done => {
        expect( _.br2nl("One<br>Two</br>Three</BR>Four<BR>Five") === 'One\r\nTwo\r\nThree\r\nFour\r\nFive' ).to.equal( true )
        done()
    })

    it('should change One<br>Two</br>Three</BR>Four<BR>Five to One\nTwo\nThree\nFour\nFive', done => {
        expect( _.br2nl("One<br>Two</br>Three</BR>Four<BR>Five", '\n') === 'One\nTwo\nThree\nFour\nFive' ).to.equal( true )
        done()
    })
})