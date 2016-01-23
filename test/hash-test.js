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

describe('_.hash mixin', () => {
    it('should match pre-defined string, when given the salt 3o3UnhWFB28hGYK', done => {
        expect(  _.hash('secret-word','3o3UnhWFB28hGYK'))
            .to.equal( 'WHJzvf0ZLXXOHW5uVlB/FWaAbsQFzkXgtG7CvDQGWplqlVd20WDZ4eYBX3062dRxJFf+4bx1IBn/LJBst6BN2w==' )
        done()
    })

    it('should throw an error when no parameters are given', done => {
        expect(() =>  _.hash() ).to.throw( Error )
        done()
    })

    it('should throw an error when no salt is given', done => {
        expect(() =>  _.hash('secret-word') ).to.throw( Error )
        done()
    })

    it('should throw an error when non-string salt is given', done => {
        expect(() =>  _.hash('secret-word', {}) ).to.throw( Error )
        done()
    })

    it('should throw an error when non-string value is given', done => {
        expect(() =>  _.hash({}, '123') ).to.throw( Error )
        done()
    })

    it('should throw an error when non-string is given for both value and salt', done => {
        expect(() =>  _.hash({}, []) ).to.throw( Error )
        done()
    })
})
