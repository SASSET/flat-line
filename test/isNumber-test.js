'use strict';

const _ = require( '../' );
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const suite = lab.suite;
const it = lab.test;
const before = lab.before;
const describe = lab.experiment;
const after = lab.after;
const expect = Code.expect;


describe('_.isNumber mixin', () => {

    const tests = {
        is: [ 1, '1', 2, '2', '1.2' ],
        isnt: [ '1.n','foo']
    }

    // Test numeric values
    _( tests.is )
        .forEach(n => {
            it(`Number ${n} to return true`, done => {
                expect( _.isNumber( n )).to.equal( true );
                done();
            });
        })
        .commit()

    // Test non-numeric values
    _( tests.isnt )
        .forEach(n => {
            it(`Number ${n} to return false`, done => {
                expect( _.isNumber( n )).to.not.equal( true );
                done();
            });
        })
        .commit()
});