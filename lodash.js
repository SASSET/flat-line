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
    }
}

_.mixin( mixins )

module.exports = _