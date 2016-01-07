'use strict'

const _ = require('lodash')

const __ = _.runInContext()

const mixins = {
    /**
     * Return a new array containing only the unique objects inside the provided
     * array. Unlike _.uniq, this will check _every_ key/value in the array
     *
     * @param   {array}     arr     Array of structurally identical objects
     * @return  {array}
     * @example
     *
     * const objs = [ { x: 1, y: 2 }, { a: 1, b: 2 }, { x: 1, y: 2 }]
     *
     * console.log( _( objs ).uniqObjs().value() )
     * console.log( _.uniqObjs( objs ) )
     *
     * // => [ { x: 1, y: 2 }, { a: 1, b: 2 } ]
     */
    uniqObjs: arr => {
        // Make sure that the arr parameter is a defined & populated array of objects
        if( ! __.isArray( arr ) || ! arr.length || ! __.isObject( arr[0] ) )
            return false

        const uniqs = []

        // Filter out the duplicate objects within the array by checking if
        // the stringified object value already exist in the temporary uniqs
        // array (while adding them to the variable)
        return __.filter( arr, ( obj ) => {
            // Use _.sortObj to sort the contents of the object by the keys, since stringify
            // will use the current order (which means identical objects in different orders
            // will be seen as discrepancies)
            if( __.indexOf( uniqs, JSON.stringify( mixins.sortObj( obj ) ) ) === -1 ){
                uniqs.push( JSON.stringify( mixins.sortObj( obj ) ) )
                return true
            }

            return false
        })
    },

    /**
     * Return a copy of the object with the content sorted by the keys
     *
     * @param   {object}    obj         Object to sort by keys
     * @param   {function}  comparator  Function to compare/sort the elements
     * @return  {object}
     * @example
     *
     * const obj = {b: 3, c: 2, a: 1}
     *
     * console.log( _.sortObj( obj ) )
     * console.log( _( obj ).sortObj().value() )
     *
     * // => {a: 1, b: 3, c: 2}
     *
     * _.sortObj(obj, (value, key) => {
     *      return value
     * })
     *
     * // => {a: 1, c: 2, b: 3}
     *
     */
    sortObj: ( obj, comparator ) => {
        // Make sure we were given an object...
        if( ! __.isObject( obj ))
            throw new Error('_.sortObj expects an object obj is: ' + Object.prototype.toString.call( obj ))

        // If comparator is provided, then it needs to be a function, if it isn't
        // a function, then throw an error
        if( ! __.isUndefined( comparator ) && ! __.isFunction( comparator ) )
            throw new Error('_.sortObj expects the comparator to be a function (if defined), but received a: '+ Object.prototype.toString.call( comparator ))

        // Create an array of the object keys, sorted either alpha/numeric
        // by default, or using the comparator if defined
        const keys = __.sortBy( __.keys( obj ), key => {
            return __.isFunction( comparator ) ? comparator( obj[ key ], key ) : key
        })

        // Return a newly created object which uses the keys in the array
        // created above, and grabs the associated data from the object
        // provided
        return __.object( keys, __.map( keys, key => {
            return obj[ key ]
        }))
    },

    /**
     * Check if the provided number is a float or integer value. This just tacks
     * a 2nd check onto lodashes isNumber, which uses a lenient comparative operator
     * to check if the value of parseFloat is the same as the provided number
     *
     * @param   {string|integer|number}  num     Number to check
     * @return  {boolean}
     * @example
     *
     * _.isNumber( 123   )
     * _.isNumber( '123' )
     * _.isNumber( 1.2   )
     * _.isNumber( '1.2' )
     *
     * // => true
     *
     */
    isNumber: ( num ) => {
        return __.isNumber( num ) || parseFloat( num ) == num
    },

    /**
     * Check if two values match each other. Basically sorts the object and
     * source, then passes it off to _.isMatch, (Since objects/arrays with
     * same values in different orders would be considered discrepancies
     *
     * @oaram   {*}         object      Item A to match to B
     * @oaram   {*}         source      Item B to match to A
     * @oaram   {function}  customizer  Function to cuztomize the object and src
     *                                  (Just handed of to _.isMatch)
     * @return  {boolean}
     *
     * _.sortMatch([1,2,3], [3,2,1])
     *
     * // => true
     *
     */
    sortMatch: ( object, source, customizer ) => {
        if( __.isUndefined( object ) || __.isUndefined( source ))
            throw new Error('Must define two same-type values to sort and match')

        if( Object.prototype.toString.call( object ) !== Object.prototype.toString.call( source ) )
            return false

        if( __.isPlainObject( object )) {
            object = mixins.sortObj( object )
            source = mixins.sortObj( source )
        }
        else if( __.isArray( object )) {
            object = object.sort()
            source = source.sort()
        }
        else {
            throw new Error('test')
        }

        return __.isMatch( object, source, customizer )
    },

    /**
     * Just a boolean comparison tool, Allows you to specify other true-type
     * variables, as well as convert the value to lower case (Since the string
     * representations of the boolean values are lower). Also compares integer
     * values
     *
     * @param   {string|boolean|integer} value  Value to compare
     * @param   {array|string}           trues  Any other custom 'true' type
     *                                          variables, an attempt is made
     *                                          to convert any value to an array
     * @param   {boolean}                lower  toLowerCase() the input val
     * @example bool( true ) === true
     *          bool( 'true' ) === true
     *          bool( 'false' ) === false
     *          bool( false ) === false
     *          bool( 1 ) === true
     *          bool( '1' ) === true
     *          bool( 0 ) === false
     *          bool( '0' ) === false
     *          bool( 'foo', [ 'foo', 'bar' ] ) === true
     *          bool( 'foo', [ 'bar', 'baz' ] ) === false
     */
    bool: ( value, trues, lower ) => {
        if( _.isUndefined( trues ))
            trues = []
        else if(_.isString( trues ))
            trues = [ trues ]
        else if( ! _.isArray( trues ))
            throw new Error( 'Illegal additional true types, must be string or array, received: ' + Object.prototype.toString.call( trues ))

        trues = _.union( [ 1, '1', true, 'true' ], trues )

        return _.indexOf( trues, !!lower === true ? value.toLowerCase() : value ) !== -1
    },

    /**
     * Return the type of a specific variable, much like the standard 'typeof', only
     * with a little more functionality. This is primarily used for input from
     * libraries/packages/modules that may convert the variable to a different type
     * when interacting with it. For example, pretty much anything passed through the
     * URI parameters will be a string, as well as anything passed through GetOpts,
     * but you may want integers, for example, to actually be identified as numbers, or
     * true/false/null/undefined strings to be identified as boolean/null/undefined.
     * That's what the scrutinize parameter does here, it will process the variable
     * to attempt to identify the type it originally was.
     *
     * NOTE: If no type is matched, then the toString() value will be returned
     *
     * @param   {*}         value           Value to process
     * @param   {boolean}   scrutinize      Determine if the true value type should be
     *                                      determined through logical processing
     * @param   {object}    returnTypes     Object of return type strings to overwrite
     * @param   {object}    flaggedVals     Values used to determine the real value types
     *                                      of flagged values (Only used if scrutinize is
     *                                      enabled)
     * @return  {string}    The variable type (string, array, object, boolean, etc)
     * @example _.typeof( [1,2] )       // array
     *          _.typeof( 'foo' )       // string
     *          _.typeof( true )        // boolean
     *          _.typeof( 'true' )      // string
     *          _.typeof( 'true',true ) // boolean
     *          _.typeof( null )        // null
     *          _.typeof( 'null' )      // string
     *          _.typeof( 'null',true ) // null
     */
    typeof: ( value, scrutinize, returnTypes, flaggedVals ) => {
        // String representations of the value types (Overridden by
        // returnTypes if defined)
        const types = __.extend( {
            undefined:  'undefined',
            null:       'null',
            string:     'string',
            boolean:    'boolean',
            array:      'array',
            element:    'element',
            regexp:     'regexp',
            object:     'object',
            number:     'number',
            function:   'function',
            unknown:    'unknown'
        }, returnTypes || {} )

        // Flagged values for string variables; EG: if string is 'true',
        // then the it's Boolean (Overridden by flaggedVals if defined)
        const flagged = __.extend( {
            boolean:    [ 'true', 'false' ],
            null:       [ 'null', 'NULL' ],
            undefined:  [ 'undefined' ]
        }, flaggedVals || {} )


        // Retrieve the actual object type from the prototype
        const objType = Object.prototype.toString.call( value )

        // Attempt to regex match the type (value should be [object TYPE]
        const objTypeRegex = objType.match( /^\[object\s(.*)\]$/ )

        /* $lab:coverage:off$ */
        // Match the type, or use the types.undefined (This shouldn't ever not
        // match, but it helps me sleep at night)
        const objTypeString = objTypeRegex[1] ? objTypeRegex[1].toLowerCase() : types.unknown
        /* $lab:coverage:on$ */

        if( __.isUndefined( value ) )
            return types.undefined

        if( __.isNull( value ) )
            return types.null

        // String values are what get opened to scrutiny, if enabled
        if( __.isString( value ) ){
            // If scrutinize isnt enabled, then just return string
            if( !! scrutinize === false )
                return types.string

            // Numbers should be the same value if leniently compared against it's float-parsed self
            if( parseFloat( value ) == value )
                return types.number

            // Check if this string is inside the boolean flags
            if( __.indexOf( flagged.boolean, value ) !== -1 )
                return types.boolean

            // Check if its inside any null flags
            if(  __.indexOf( flagged.null, value ) !== -1 )
                return types.null

            // Check if its inside any undefined flags
            if( __.indexOf( flagged.undefined, value ) !== -1 )
                return types.undefined

            // If no parser caught it, then it must be a string
            return types.string
        }

        // Certain check types can't be misconstrued as other types, unlike other
        // types (such as objects), get those out of the way
        if( __.isBoolean( value ) )
            return types.boolean

        if( __.isRegExp( value ))
            return types.regexp

        /* $lab:coverage:off$ */
        // Disabling coverage for this, since unit testing is done via node
        if( __.isElement( value ))
            return types.element
        /* $lab:coverage:on$ */

        // Since isObject returns true for functions, check this before that
        if( __.isFunction( value ))
            return types.function

        // Since isObject also returns true for arrays, check that before as well
        if( __.isArray( value ))
            return types.array

        // isObject should be last for any possible object 'types'
        if( __.isObject( value ))
            return types.object

        // If nothing else was caught, then return the type found via
        // the prototypes toString() call
        return objTypeString
    }
}

_.mixin( mixins )

module.exports = _