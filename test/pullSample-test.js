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

describe('_.pullSample mixin', () => {
    const testArr = ['foo','bar']

    it('should remove one sample from the test array', done => {
        const cached = _.clone( testArr )
        const sample = _.pullSample( testArr )

        expect( cached ).to.include( sample )
        expect( testArr ).to.not.include( sample )

        done()
    })

    it('should remove one more sample from the test array, emptying the test array', done => {
        const cached = _.clone( testArr )
        const sample = _.pullSample( testArr )

        expect( cached ).to.include( sample )
        expect( testArr ).to.not.include( sample )
        expect( testArr.length ).to.equal( 0 )

        done()
    })

    it('should return undefined when given nothing', done => {
        expect( _.pullSample( ) ).to.equal( undefined )

        done()
    })

    it('should return undefined when given an empty array', done => {
        expect( _.pullSample( [] ) ).to.equal( undefined )

        done()
    })

    it('should throw an error when given a non array', done => {
        expect(() => _.pullSample( 'string' ) ).to.throw( Error )

        done()
    })
})
