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

// @todo Need better coverage
describe('_.removeObj mixin', () => {

    let statics = [ 'name', 'description','type' ]

    const testObj = {name: 'test name', foo: 'foo something', required: true, unique: false, description: 'idk', type: 'string'}

    console.log('Before',testObj)

    statics = _.removeObj(testObj, statics)


    console.log('After (dynamic)',testObj)
    console.log('After (static)',statics)

    it('', done => {
        expect( _.bool( 'BAZ', 'baz', true ) ).to.equal( true )
        done()
    })
})
