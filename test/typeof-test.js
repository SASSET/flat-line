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

describe('_.typeof mixin', () => {

    // Values to be checked, the withScrutiny enables scrutiny, and the
    // withoutScrutiny... guess. And the item keys determine what they
    // should be typed as
    const checkVals = {
        withScrutiny: {
            boolean: [ true, false, 'true', 'false'],
            number: [ 1, 2.3, '4', '5.6' ],
            string: [ 'foo', '7.8.9' ],
            null: [ null, 'null', 'NULL' ],
            undefined: [ 'undefined' ]
        },
        withoutScrutiny: {
            boolean: [ true, false ],
            number: [ 1, 2.3 ],
            string: [ 'foo', '1', '2.3', '4.5.6', 'null', 'undefined' ],
            null: [ null ],
            regexp: [ /foo/i ],
            undefined: [ undefined ]
        }
    }

    // Automate the majority of the testing
    _.forEach(checkVals, ( types, scrTyp ) => {
        _.forEach(types, ( vals, type ) => {
            _.forEach( vals, v => {
                it(`value ${v} to return ${type} (with scrutiny ${scrTyp === 'withScrutiny' ? 'enabled' : 'disabled'})`, done => {
                    expect( _.typeof( v, scrTyp === 'withScrutiny' ) === type ).to.equal( true )
                    done()
                })
            })
        })
    })

    it('[1,2,3] to identify as an array', done => {
        expect( _.typeof( [1,2,3] ) === 'array').to.equal( true )
        done()
    })

    it('{a:1,b:2} to identify as an object', done => {
        expect( _.typeof( {a:1,b:2} ) === 'object').to.equal( true )
        done()
    })

    it('parseInt() to identify as a function', done => {
        expect( _.typeof( parseInt ) === 'function').to.equal( true )
        done()
    })

    it('new Date() to identify as a date', done => {
        expect( _.typeof( new Date() ) === 'date').to.equal( true )
        done()
    })

    it('foo to identify as a "bar" due to the returnTypes parameter being modified', done => {
        expect( _.typeof( 'foo', null, { string: 'bar' } ) === 'bar').to.equal( true )
        done()
    })

    it('bar to identify as boolean, due to the flaggedVals parameter being modified and scrutinize enabled', done => {
        expect( _.typeof( 'bar', true, null, {boolean: ['bar']} ) === 'boolean').to.equal( true )
        done()
    })

    /*
    it('Illegal additional true type to throw an error', done => {
        expect(() => _.bool( 'foo', {bar: 'baz'} )).to.throw( Error )
        done()
    })
    */
})
