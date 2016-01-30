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


describe('_.includesAll mixin', () => {
    /**
     * Collection:  array
     * Values:      array
     * Expecting:   true
     */
    it('should return true when given [a, b, c] as the collection, and [a, c] as the values', done => {
        expect( _.includesAll( ['a','b','c'], ['a','c'] ) ).to.equal( true )
        done()
    })

    /**
     * Collection:  array
     * Values:      string
     * Expecting:   true
     */
    it('should return true when given [a, b, c] as the collection, and "a" (string) as the value', done => {
        expect( _.includesAll( ['a','b','c'], 'a' ) ).to.equal( true )
        done()
    })

    /**
     * Collection:  object
     * Values:      string
     * Expecting:   true
     */
    it('should return true when given an object with the keys "user" and "age", and given "fred" (string) as the value', done => {
        expect( _.includesAll( { user: 'fred', age: 40 }, 'fred' ) ).to.equal( true )
        done()
    })

    /**
     * Collection:  object
     * Values:      array
     * Expecting:   true
     */
    it('should return true when given an object with the keys "user" and "age", and given [fred, 40] (array) as the values', done => {
        expect( _.includesAll( { user: 'fred', age: 40 }, ['fred',40] ) ).to.equal( true )
        done()
    })

    /**
     * Collection:  object
     * Values:      array
     * Expecting:   false
     */
    it('should return false when given an object with the keys "user" and "age", and given [fred, 40, foo] (array) as the values', done => {
        expect( _.includesAll( { user: 'fred', age: 40 }, ['fred', 40, 'foo'] ) ).to.equal( false )
        done()
    })

    /**
     * Collection:  string
     * Values:      string
     * Expecting:   true
     */
    it('should return true when given "pebbles" (string) as the collection, and "eb" (string) as the value', done => {
        expect( _.includesAll( 'pebbles', 'eb' ) ).to.equal( true )
        done()
    })

    /**
     * Collection:  string
     * Values:      string
     * Expecting:   true
     */
    it('should return false when given "pebbles" (string) as the collection, and "ss" (string) as the value', done => {
        expect( _.includesAll( 'pebbles', 'ss' ) ).to.equal( false )
        done()
    })

    /**
     * Collection:  string
     * Values:      array
     * Expecting:   true
     */
    it('should return true when given "pebbles" (string) as the collection, and [pe, eb] (array) as the values', done => {
        expect( _.includesAll( 'pebbles', [ 'pe', 'eb' ] ) ).to.equal( true )
        done()
    })

    /**
     * Collection:  string
     * Values:      array
     * Expecting:   true
     */
    it('should return false when given "pebbles" (string) as the collection, and [pe, eb, ss] (array) as the values', done => {
        expect( _.includesAll( 'pebbles', [ 'pe', 'eb', 'ss' ] ) ).to.equal( false )
        done()
    })

    /**
     * Collection:  array
     * Values:      number
     * Start:       2
     * Expecting:   false
     */
    it('should return false when given [1, 2, 3] as the collection, and 1 (int) as the value, and 2 as the fromIndex', done => {
        expect( _.includesAll( [1, 2, 3], 1, 2 ) ).to.equal( false )
        done()
    })

    /**
     * Collection:  array
     * Values:      array
     * Start:       2
     * Expecting:   false
     */
    it('should return false when given [a, b, c, d] as the collection, and [a, b] as the values, and 2 as the fromIndex', done => {
        expect( _.includesAll( ['a','b','c','d'], ['a','b'], 2 ) ).to.equal( false )
        done()
    })

    /**
     * Collection:  array
     * Values:      null
     * Expecting:   Error
     */
    it('should throw an error when given null as the values', done => {
        expect(() => _.includesAll( ['a','b','c'], null ) ).to.throw( Error )
        done()
    })

    /**
     * Collection:  array
     * Values:      undefined
     * Expecting:   Error
     */
    it('should throw an error when given undefined as the values', done => {
        expect(() => _.includesAll( ['a','b','c'], undefined ) ).to.throw( Error )
        done()
    })
})
