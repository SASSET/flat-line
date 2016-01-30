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

// This should not match any of the cases by default
const str = 'Some string'

describe( '_.isSnake mixin', () => {
    it(`should return false when given "${str}"`, done => {
        expect( _.isSnake( str ) ).to.equal( false )
        done()
    })

    it(`should return true when given _.snakeCase("${str}")`, done => {
        expect( _.isSnake( _.snakeCase( str ) ) ).to.equal( true )
        done()
    })
})

describe( '_.isCamel mixin', () => {
    it(`should return false when given "${str}"`, done => {
        expect( _.isCamel( str ) ).to.equal( false )
        done()
    })

    it(`should return true when given _.snakeCase("${str}")`, done => {
        expect( _.isCamel( _.camelCase( str ) ) ).to.equal( true )
        done()
    })
})

describe( '_.isKebab mixin', () => {
    it(`should return false when given "${str}"`, done => {
        expect( _.isKebab( str ) ).to.equal( false )
        done()
    })

    it(`should return true when given _.snakeCase("${str}")`, done => {
        expect( _.isKebab( _.kebabCase( str ) ) ).to.equal( true )
        done()
    })
})

describe( '_.isStart mixin', () => {
    it(`should return false when given "${str}"`, done => {
        expect( _.isStart( str ) ).to.equal( false )
        done()
    })

    it(`should return true when given _.snakeCase("${str}")`, done => {
        expect( _.isStart( _.startCase( str ) ) ).to.equal( true )
        done()
    })
})

describe( '_.isLower mixin', () => {
    it(`should return false when given "${str}"`, done => {
        expect( _.isLower( str ) ).to.equal( false )
        done()
    })

    it(`should return true when given _.snakeCase("${str}")`, done => {
        expect( _.isLower( _.lowerCase( str ) ) ).to.equal( true )
        done()
    })
})

describe( '_.isUpper mixin', () => {
    it(`should return false when given "${str}"`, done => {
        expect( _.isUpper( str ) ).to.equal( false )
        done()
    })

    it(`should return true when given _.snakeCase("${str}")`, done => {
        expect( _.isUpper( _.upperCase( str ) ) ).to.equal( true )
        done()
    })
})

describe( '_.getCase mixin', () => {
    it(`should return camel when given _.camelCase("${str}")`, done => {
        expect( _.getCase( _.camelCase( str ) ) ).to.equal( 'camel' )
        done()
    })

    it(`should return kebab when given _.kebabCase("${str}")`, done => {
        expect( _.getCase(_.kebabCase( str ) ) ).to.equal( 'kebab' )
        done()
    })

    it(`should return snake when given _.snakeCase("${str}")`, done => {
        expect( _.getCase(_.snakeCase( str ) ) ).to.equal( 'snake' )
        done()
    })

    it(`should return lower when given _.lowerCase("${str}")`, done => {
        expect( _.getCase(_.lowerCase( str ) ) ).to.equal( 'lower' )
        done()
    })

    it(`should return upper when given _.upperCase("${str}")`, done => {
        expect( _.getCase(_.upperCase( str ) ) ).to.equal( 'upper' )
        done()
    })

    it(`should return start when given _.startCase("${str}")`, done => {
        expect( _.getCase(_.startCase( str ) ) ).to.equal( 'start' )
        done()
    })
})

describe( '_.isCase mixin', () => {
    it( `should return true when checking ${_.camelCase( str )} as camel`, done => {
        expect( _.isCase( 'camel', _.camelCase( str ) ) ).to.equal( true )
        done()
    } )

    it( `should return true when checking ${_.snakeCase( str )} as snake`, done => {
        expect( _.isCase( 'snake', _.snakeCase( str ) ) ).to.equal( true )
        done()
    } )

    it( `should return true when checking ${_.kebabCase( str )} as kebab`, done => {
        expect( _.isCase( 'kebab', _.kebabCase( str ) ) ).to.equal( true )
        done()
    } )

    it( `should return true when checking ${_.camelCase( str )} as camel`, done => {
        expect( _.isCase( 'camel', _.camelCase( str ) ) ).to.equal( true )
        done()
    } )

    it( `should return true when checking ${_.startCase( str )} as start`, done => {
        expect( _.isCase( 'start', _.startCase( str ) ) ).to.equal( true )
        done()
    } )

    it( `should return true when checking ${_.lowerCase( str )} as lower`, done => {
        expect( _.isCase( 'lower', _.lowerCase( str ) ) ).to.equal( true )
        done()
    } )

    it( `should return true when checking ${_.upperCase( str )} as upper`, done => {
        expect( _.isCase( 'upper', _.upperCase( str ) ) ).to.equal( true )
        done()
    } )


})

