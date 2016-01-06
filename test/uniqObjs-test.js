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

describe('_.uniqObjs mixin', () => {

    it('Object [{"x":1,"y":2},{"a":1,"b":2},{"x":1,"y":2}] to be converted to [{"x":1,"y":2},{"a":1,"b":2}]', done => {
        expect( JSON.stringify( _([{x:1,y:2},{a:1,b:2},{x:1,y:2}] ).uniqObjs().value() ) ).to.equal( '[{"x":1,"y":2},{"a":1,"b":2}]' )
        done()
    })

    const objectWDupes = [
        { application: 'jenkins', version: 6 },
        { application: 'nginx',  version: 1 },
        { application: 'chef',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 5 },
        { application: 'nagios',  version: 2 },
        { application: 'tripwire', version: 2 },
        { application: 'nginx',  version: 4 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'tripwire',  version: 1 },
        { application: 'chef',  version: 2 },
        { application: 'nagios', version: 4 },
        { application: 'nginx',  version: 1 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 3 },
        { application: 'nginx',  version: 1 },
        { application: 'tripwire',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 6 },
        { application: 'nagios',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'tripwire',  version: 1 },
        { application: 'nginx',  version: 5 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 1 },
        { application: 'chef',  version: 3 },
        { application: 'tripwire', version: 2 },
        { application: 'jenkins',  version: 5 },
        { application: 'nginx',  version: 2 },
        { application: 'nagios', version: 2 },
        { application: 'nginx',  version: 2 },
        { application: 'nginx',  version: 2 },
        { application: 'tripwire', version: 2 },
        { application: 'nginx',  version: 4 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 3 },
        { application: 'chef',  version: 2 },
        { application: 'nagios', version: 4 },
        { application: 'nginx',  version: 1 },
        { application: 'nginx',  version: 4 },
        { application: 'tripwire', version: 2 },
        { application: 'nginx',  version: 5 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 3 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 4 },
        { application: 'chef',  version: 1 },
        { application: 'nginx',  version: 2 },
        { application: 'tripwire', version: 5 },
        { application: 'jenkins',  version: 1 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 5 },
        { application: 'nginx',  version: 1 },
        { application: 'tripwire',  version: 4 },
        { application: 'nagios', version: 2 },
        { application: 'nginx',  version: 1 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 4 },
        { application: 'nginx',  version: 1 },
        { application: 'tripwire',  version: 2 },
        { application: 'nagios', version: 3 },
        { application: 'chef',  version: 1 },
        { application: 'nginx',  version: 5 },
        { application: 'apache', version: 2 },
        { application: 'jenkins',  version: 1 },
        { application: 'nginx',  version: 5 },
        { application: 'apache', version: 2 },
        { application: 'nagios',  version: 1 },
        { application: 'nginx',  version: 3 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 1 },
        { application: 'tripwire',  version: 2 },
        { application: 'apache', version: 4 },
        { application: 'nginx',  version: 1 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 4 },
        { application: 'nginx',  version: 1 },
        { application: 'nginx',  version: 5 },
        { application: 'nagios', version: 2 },
        { application: 'nginx',  version: 3 },
        { application: 'nginx',  version: 2 },
        { application: 'apache', version: 2 },
        { application: 'nginx',  version: 3 },
        { application: 'chef',  version: 2 },
        { application: 'apache', version: 2 }
    ]

    it(`Large object with duplicates to be uniqued from ${objectWDupes.length} down to 24 items`, done => {
        expect( _.uniqObjs(objectWDupes).length ).to.equal( 24 )
        done()
    })

    it('Empty array to equal false', done => {
        expect( _.uniqObjs( [] ) ).to.equal( false )
        done()
    })

    it('String "foo" to equal false', done => {
        expect( _.uniqObjs( 'foo' ) ).to.equal( false )
        done()
    })
})
