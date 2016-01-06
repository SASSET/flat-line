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

describe('_.sortObj mixin',  () => {
    it('{"b":3,"c":2,"a":1} to be sorted to {"a":1,"b":3,"c":2}', done => {
        expect( JSON.stringify(_.sortObj( {b: 3, c: 2, a: 1} )) ).to.equal( '{"a":1,"b":3,"c":2}' )
        done()
    })

    it('{"2":"g","4":"z","5":"b"} to be sorted to {"2":"g","4":"z","5":"b"}', done => {
        expect( JSON.stringify(_.sortObj({5:'b', 4:'z', 2:'g'})) ).to.equal( '{"2":"g","4":"z","5":"b"}' )
        done()
    })

    it('Non-object to throw an error', done => {
        //expect( _.sortObj( 'foo' ) ).to.throw( Error )
        expect(() => _.sortObj('foo')).to.throw(Error)
        done()
    })

    it('Sort to throw an error due to non-function comparator', done => {
        //expect( _.sortObj({5:'b', 4:'z', 2:'g'}, 'foo') ).to.throw( Error )
        expect(() => _.sortObj({5:'b', 4:'z', 2:'g'}, 'foo')).to.throw(Error)
        done()
    })

    it('{"a":1,"b":3,"c":2} to be sorted to {"a":1,"c":2,"b":3} using a comparator', done => {
        expect( JSON.stringify( _.sortObj({"a":1,"b":3,"c":2}, (value, key) => value) ) ).to.equal( '{"a":1,"c":2,"b":3}' )
        done()
    })
})


describe('_.sortObj mixin',  () => {
    it('Non-object to throw an error', done => {
        //expect( _.sortObj( 'foo' ) ).to.throw( Error )
        expect(() => _.sortObj('foo')).to.throw(Error)
        done()
    })

    it('Sort to throw an error due to non-function comparator', done => {
        //expect( _.sortObj({5:'b', 4:'z', 2:'g'}, 'foo') ).to.throw( Error )
        expect(() => _.sortObj({5:'b', 4:'z', 2:'g'}, 'foo')).to.throw(Error)
        done()
    })
})