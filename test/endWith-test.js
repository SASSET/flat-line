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

describe('_.endWith mixin', () => {
    it('should change /User/john.doe/Documents to /User/john.doe/Documents/', done => {
        expect( _.endWith('/User/john.doe/Documents', '/') === '/User/john.doe/Documents/' ).to.equal( true )
        done()
    })

    it('should leave /User/john.doe/Documents/ as it is', done => {
        expect( _.endWith('/User/john.doe/Documents/', '/') === '/User/john.doe/Documents/' ).to.equal( true )
        done()
    })
})