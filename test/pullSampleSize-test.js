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

describe('_.pullSampleSize mixin', () => {
    const testArr = ['foo','bar','baz','quux']

    it('should remove two samples from the test array', done => {
        const cached = _.clone( testArr )
        const sample = _.pullSampleSize( testArr, 2 )

        expect( _.intersection( cached, sample ).length ).to.equal( 2 )
        expect( _.intersection( testArr, sample ).length ).to.equal( 0 )

        done()
    })

    it('should remove two more samples from the test array, emptying the test array', done => {
        const cached = _.clone( testArr )
        const sample = _.pullSampleSize( testArr, 2 )

        expect( _.intersection( cached, sample ).length ).to.equal( 2 )
        expect( _.intersection( testArr, sample ).length ).to.equal( 0 )
        expect( testArr.length ).to.equal( 0 )

        done()
    })

    it('should return an empty array when sampling an empty array', done => {
        expect( _.pullSampleSize( [], 2 ).length ).to.equal( 0 )

        done()
    })

    it('should return an empty array when given a size of 0', done => {
        expect( _.pullSampleSize( [1,2,3], 0 ).length ).to.equal( 0 )

        done()
    })

    it('should return the entire array if size is greater than array length', done => {
        expect( _.pullSampleSize( [1,2,3], 5 ).length ).to.equal( 3 )

        done()
    })

    it('should throw an error when given a non array', done => {
        expect(() => _.pullSampleSize( 'test', 1) ).to.throw( Error )

        done()
    })

    it('should throw an error when given a non numeric value for the size', done => {
        expect(() => _.pullSampleSize( [1,2,3], 'test') ).to.throw( Error )

        done()
    })
})
