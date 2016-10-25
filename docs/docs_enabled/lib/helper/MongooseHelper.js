'use strict'

const _             = require( 'moar-lodash' )
const Promise       = require( 'bluebird' )
const Async         = require( 'async' )
const Util          = require( 'util' )
const AppRoot       = require( 'app-root-path' )
const Mongoose      = require( 'mongoose' )
const Path          = require( 'path' )
const Log           = AppRoot.require('./lib/utils/logger')({ helper: 'Mongoose'})

Log.debug( `Helper file loaded` )

/**
 * Asset Mongoose Model - Used to create/edit/delete any Asset documents, as well as MDB documents in the Field, 
 * Partition and Revision collections that may be associated to the the Asset(s)
 * 
 * @namespace   MongooseHelper
 * @description Lodash mixins for MongooseJS
 * @see {@link http://lodashjs.com/|LodashJS}
 */
const _exports = {}


/**
 * This utility returns the last argument from an array of arguments, if its a function (and thus, can be used as a 
 * callback). This is best when used with BlueBirds asCallback() functionality
 * 
 * @function    getLastCb
 * @memberof    MongooseHelper
 * @param       {array}         methodArgs      All arguments passed to the method that is executing this function
 * @param       {?number=}      limit           Limit of arguments to accept as callback parameters (starting from the 
 *                                              right), Meaning if methodArgs had 3 parameters, and the limit was 2, then 
 *                                              only the last two methodArgs values would be focused on.
 * @return      {function=}                     If a function was found with the argument values and limit specified, then 
 *                                              that function is returned to be used as a callback; Otherwise, void is 
 *                                              returned.
 * @see BluebirdJS Promise modules {@link http://bluebirdjs.com/docs/api/ascallback.html|asCallback()} method
 * @example // Execute the Asset.findAll static method, if the only parameter defined is the first parameter (criteriaOrCb), 
 * // and its defined as a function, then this specific execution instance of Asset.findAll will handle criteriaOrCb as 
 * // a callback function. Now if criteriaOrCb is some criteria, and limitOrCb is a numerical limit, then callback is 
 * // defined as a function, then this execution will be handled as a callback. If NO defined parameters are passed as 
 * // functions, then a Promise will be returned.
 *
 * // EXAMPLE USAGE IN ODM MODEL - Example Mongoose static schema method, using getLastCb()
 *  AssetSchema.statics.findAll = function( criteriaOrCb, limitOrCb, callback ){
 *      return new Promise( ( res, rej ) => {
 *          // Model logic here...
 *      }).asCallback( _m.getLastCb( arguments ) )
 *  }
 *
 * // Example usage of above AssetSchema.statics.findAll() method (as a CALLBACK):
 *  Asset.findAll({ status: 'unlocked' }, ( err, data ) => {
 *      if( err ) 
 *          return console.log( 'Error: %', err )
 *
 *      console.log('Assets Found: %', data.length )
 *  })
 *
 * // Example usage of an identical scenario to above, except this is handled as a PROMIES:
 *  Asset.findAll({ status: 'unlocked' })
 *      .then( data => console.log('Assets Found: %', data.length ) )
 *      .catch( err => console.log( 'Error: %', err ) )
 *
 * @example // Execute the Asset.createAsset static method, this is handled just like the AssetSchema.statics.findAll
 * // example above, the difference here is that this createAsset method can only check the last two of the 
 * // three parameters for a callback function. To do thos, we specify a numerical value for the 2nd parameter 
 * // given to the _m.getLastCb() method, and this will make sure theres no attempt to use the partitionId as 
 * // a callback.
 *
 * // EXAMPLE USAGE IN ODM MODEL - Example Mongoose static schema method, using getLastCb(), this method only allows
 * // the last two arguments to optionally used as callbacks ( as opposed to all arguments, like in the first example)
 *  AssetSchema.statics.createAsset = function( partitionId, attrsOrCb, callback ) {
 *      return new Promise( ( res, rej ) => {
 *          // Model logic here...
 *      }).asCallback( _m.getLastCb( arguments, 2 ) )
 *  }
 *
 * // Example usage of AssetSchema.statics.createAsset() as a CALLBACK:
 *  Asset.createAsset( '56d0819b655baf4a4a7f9cad' { 
 *      Hostname : 'some-hostname',
 *      Status   : 'locked'
 *  }, ( err, assetDoc ) => {
 *      if( err ) 
 *          return console.error( 'Error: %', err )
 *
 *      console.log( 'Assets Created: %', assetDoc.identifier )
 *  })
 *
 * // Example usage of an identical scenario to above, except this is handled as a PROMIES:
 *  Asset.createAsset( '56d0819b655baf4a4a7f9cad' { 
 *      Hostname : 'some-hostname',
 *      Status   : 'locked'
 *  })
 *      .then( assetDoc => console.log( 'Assets Created: %', assetDoc.identifier ) )
 *      .catch( err     => console.error( 'Error: %', err ) )
 *
 * // Example usage of AssetSchema.statics.createAsset() specifying a CALLBACK in the 2nd argument (and omitting any
 * // asset arguments):
 *  Asset.createAsset( '56d0819b655baf4a4a7f9cad' ( err, assetDoc ) => {
 *      if( err ) 
 *          return console.error( 'Error: %', err )
 *
 *      console.log( 'Assets Created: %', assetDoc.identifier )
 *  })
 *
 * @example // Example usage of providing the ability to supply a callback in one of the two last arguments, while
 * // excluding the first parameter (also a function) as a possible callback
 *
 * // Execute a specific command on a list of assets found
 *  AssetSchema.statics.findAndExec = function( cmdToExec, criteriaOrCb, callback ) {
 *      return new Promise( ( res, rej ) => {
 *          // Model logic here...
 *      }).asCallback( _m.getLastCb( arguments, 2 ) )
 *  }
 * 
 * // Example usage of the above, as a callback. This has the cmdToExec specified, as well as criteriaOrCb and callback
 *  Asset.findAndExec( doc => doSomething( doc ), { status: 'unlocked' }, ( err, assetDoc ) => {
 *      if( err ) 
 *          return console.error( 'Error: %', err )
 *
 *      console.log( 'Assets Created: %', assetDoc.identifier )
 *  })
 *
 * // This example would fail, as it is see as no callback is specified, and its not being handled as a promise. This
 * // is because the _m.getLastCb() used in the AssetSchema.statics.findAndExec method restricts the callback search
 * // to the last two parameters only. 
 *  Asset.findAndExec( ( err, assetDoc ) => {
 *      if( err ) 
 *          return console.error( 'Error: %', err )
 *
 *      console.log( 'Assets Created: %', assetDoc.identifier )
 *  })
 */
_exports.getLastCb = function( methodArgs, limit ){
    let cbList

    if( ! limit || ! _.isNumeric( limit ) ) {
        cbList =  _.takeRight( methodArgs, _.size( methodArgs ) )
    }
    else {
        cbList =  _.takeRight( methodArgs, _.size( methodArgs ) )
    }

    const lastCb = ( args  => _.findLast( args, a => _.isFunction( a ) ) )( cbList )

    if( lastCb && _.isFunction( lastCb ) ){
        return lastCb
    }

    return 
}

/**
 * Check is an item is a Mongoose object ID or not. This works on the real ObjectId type, as well as the string version
 * of
 *
 * @function    isObjectId
 * @memberof    MongooseHelper
 * @param       {Mixed}     elem    Element to check, usually either a string (not populated) or an object (populated)
 * @returns     {boolean}
 *
 * @example  // Find a single Asset, then check if the Object Id can b
 *  AssetModel.findByIdentifier({ 
 *      partitionId : 'd8i3nas0p3na1pvg98d763m',
 *      identifier  : 'webserver.phx.ad' 
 *  })
 *  .then( assetDoc => {
 *      // ------------------------------------------------
 *      // Test the assetDocs _id, see what typeof says, and 
 *      // if isObjectId can detect it.
 *
 *      let assetId = assetDoc._id              // No changes made to ObjectId
 *      console.log( typeof assetId )           // => string 
 *      console.log( _.isObjectId( assetId ) )  // => true 
 *                    
 *      // ------------------------------------------------
 *      // Convert ObjectId to string - Run same commands
 *
 *      assetId = assetId.toString()            // Now convert the ObjectId to a string value
 *      console.log( typeof assetId )           // => string 
 *      console.log( _.isObjectId( assetId ) )  // => true   
 *    } )
 *      .catch( error => console.error( `Error: ${error}` ) )
 */
_exports.isObjectId = elem => {
    return ( ! _.isEmpty( elem ) && Mongoose.Types.ObjectId.isValid( elem.toString() ) )
}


/**
 * Check is an item is a Mongoose object ID or not
 *
 * @function    getCallerModelName
 * @memberof    MongooseHelper
 * @returns     {(sring|False)}     If the function was loated, then return it. Otherwise, return false
 */
_exports.getCallerModelName = ( setpsBack = 2 ) => {
    // Store the original Error.prepareStackTrace to restore after the try/catch
    const originalFunc = Error.prepareStackTrace

    let callerfile

    try {
        const err = new Error()
        let currentfile

        Error.prepareStackTrace = ( err, stack ) => stack

        const stack = err.stack

        stack.shift()

        currentfile = stack.shift().getFileName()

        while ( err.stack.length ) {
            callerfile = stack.shift().getFileName()

            if( currentfile !== callerfile ){
                break
            }
        }
    } catch ( e ) {}

    Error.prepareStackTrace = originalFunc;

    return _exports.file2Model( callerfile ) 
}

_exports.getCallerFile = _exports.getCallerFileName = ( setpsBack = 1 ) => {
    // Store the original Error.prepareStackTrace to restore after the try/catch
    const originalFunc = Error.prepareStackTrace

    let callerfile
    //Path.resolve( __dirname, fileName )
    try {
        const err = new Error()
        let currentfile

        Error.prepareStackTrace = ( err, stack ) => {
            console.log('Stack:',stack)
            return stack
        }

        const stack = err.stack

        //stack.shift()

        if( ! _.isNumeric( setpsBack ) ){
           setpsBack = 1
        }
        
        var names = _.times( setpsBack, () => stack.shift().getFileName() )
        
        console.log('names:',names)

        return names[ names.length-1]

        /*while ( err.stack.length ) {
            callerfile = stack.shift().getFileName()

            if( currentfile !== callerfile ){
                break
            }
        }*/
    } catch ( e ) {}

    Error.prepareStackTrace = originalFunc;

    return callerfile
}

_exports.getCallerFileName3 = ( setpsBack = 1 ) => {
    let originalFunc = Error.prepareStackTrace
    let callerfile

    try {
        let err = new Error()
        console.log('>>> err.stack.length:',err.stack.length)
        let currentfile

        Error.prepareStackTrace = function (err, stack) { 
            return stack 
            console.log('>>> Error.prepareStackTrace - err:',err)
            console.log('>>> Error.prepareStackTrace - err.toString():',err.toString())
            console.log('>>> Error.prepareStackTrace - stack:',stack)
            //console.log('>>> Error.prepareStackTrace - stack.toString():',stack.toString())
            return stack 
        }

        currentfile = err.stack.shift().getFileName()
        console.log('>>> currentfile:',currentfile)
        while ( err.stack.length ) {
            callerfile = err.stack.shift().getFileName()
            console.log('>>> callerfile:',callerfile)
            if( currentfile !== callerfile ){
                break
            }
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 

    return callerfile;
}

_exports.getCallerFileName2 = () => {
    var originalFunc = Error.prepareStackTrace;

    var callerfile;
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();
        console.log('>>> currentfile:',currentfile)
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();
            console.log('>>> callerfile:',callerfile)

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 

    return callerfile;
}

/**
 * Get the names of the files in the stacktrace leading up to this file.
 *
 * @function    getFileStack
 * @alias       getFileTrail
 * @memberof    MongooseHelper
 * @param       {(boolean|Object)=} toBaseOrObj         This can be the boolean value for the toBase parameter, or an 
 *                                                      object with all three parameter values
 * @param       {number=}           limit               Limit of files to return (positive unteger is first N files, 
 *                                                      negative is the LAST n files)
 * @param       {boolean=}          uniq                Return only unique filenames
 * @param       {number=}           toBaseOrObj.toBase  If true, the absolute pathnames for each file will be converted 
 *                                                      to the files basename
 * @param       {number=}           toBaseOrObj.limit   Limit of files to return (positive unteger is first N files, 
 *                                                      negative is the LAST n files)
 * @param       {boolean=}          toBaseOrObj.uniq    Return only unique filenames
 * @returns     {array}
 *
 * @example  // Find a single Asset, then check if the Object Id can b
 *  AssetModel.findByIdentifier({ 
 *      partitionId : 'd8i3nas0p3na1pvg98d763m',
 *      identifier  : 'webserver.phx.ad' 
 *  })
 *  .then( assetDoc => {
 *      // ------------------------------------------------
 *      // Test the assetDocs _id, see what typeof says, and 
 *      // if isObjectId can detect it.
 *
 *      let assetId = assetDoc._id              // No changes made to ObjectId
 *      console.log( typeof assetId )           // => string 
 *      console.log( _.isObjectId( assetId ) )  // => true 
 *                    
 *      // ------------------------------------------------
 *      // Convert ObjectId to string - Run same commands
 *
 *      assetId = assetId.toString()            // Now convert the ObjectId to a string value
 *      console.log( typeof assetId )           // => string 
 *      console.log( _.isObjectId( assetId ) )  // => true   
 *    } )
 *      .catch( error => console.error( `Error: ${error}` ) )
 */
_exports.getFileStack = _exports.getFileTrail = ( toBaseOrObj, limit, uniq ) => {
    let _limit  = null
    let _toBase = false
    let _uniq   = false

    // If the first param is an object, then use it as the source of the toBase/limit/uniq
    if( _.isObject( toBaseOrObj ) ){
        if( ! _.isUndefined( toBaseOrObj.toBase ) && toBaseOrObj.toBase === true ){
            _toBase = true
        }

        if( ! _.isUndefined( toBaseOrObj.limit ) && _.isInteger( toBaseOrObj.limit ) && toBaseOrObj.limit !== 0 ){
            _limit = toBaseOrObj.limit
        }

        if( ! _.isUndefined( toBaseOrObj.uniq ) && toBaseOrObj.uniq === true ){
            _uniq = true
        }
    }

    // Otherwise, assume they're all defined independentaly
    else {
        if( ! _.isUndefined( toBaseOrObj ) && toBaseOrObj === true ){
            _toBasename = true
        }

        if( ! _.isUndefined( limit ) && _.isInteger( limit ) && limit !== 0 ){
            _limit = limit
        }

        if( ! _.isUndefined( uniq ) && uniq === true ){
            _uniq = true
        }
    }

    var originalFunc = Error.prepareStackTrace
    var results = []
    var callerfile

    try {
        var err = new Error()
        var currentfile
        var addFile = thisFile => {
            // results.push( ( _toBasename ? Path.basename( thisFile ) : thisFile ) )
            if( _toBasename === true ){
                results.push( Path.basename( thisFile ) )
            }
            else {
                results.push( thisFile )
            }
        }

        Error.prepareStackTrace = ( err, stack ) => stack

        currentfile = err.stack.shift().getFileName()


        results.push( currentfile )

        while ( err.stack.length ) {
            callerfile = err.stack.shift().getFileName()

            if( callerfile === 'module.js' ){
                break
            }
           
            results.push( callerfile )
        }
    } catch ( e ) {}

    Error.prepareStackTrace = originalFunc;

    // If only unique values are requested...
    if( _uniq === true ){
        results = _.uniq( results )
    }

    // If a limit is requested, then determine if its a positive or negative..
    if( _.isInteger( _limit ) && _limit !== 0 ){
        // Positive limits return `_limit` value from the beginning of the results array
        if( _limit > 0 ){
            results = _.take( results, _limit )
        }

        // Negative limits return `_limit` value from the end (right side) of the results array
        results = _.takeRight( results, Math.abs( _limit ) )
    }
    
    // If only the base name is requested
    if( _toBase === true ){
        results = _.map( results, r => Path.basename( r ) )
    }

    return results
}

/**
 * Retrieve the Object ID of a specific element. This is mainly used for references. When un-populated, they are just
 * ObjectIds, when populated, they are documents with an _id element, which is the object Id. This will return the top
 * level ObjectId, or the populated documents _id value, and converted to string; If no ObjectID is found, then
 * undefined will be returned
 *
 * @function    getObjectId
 * @memberof    MongooseHelper
 * @param       {object|string}     elem    Element to grab the _id from
 * @returns     {string|undefined}          If no _id is found, then undefined, otherwise, the _id in string format is returned
 * @todo        A param to convert the ID to a string, as opposed to handing over what it is exactly (can be an object)
 */
_exports.getObjectId = elem => {
    if( _.isEmpty( elem ) ){
        return undefined
    }
    else if( _exports.isObjectId( elem ) ){
        return elem.toString()
    }
    else if( _.isObject( elem ) && ! _.isUndefined( elem._id ) && _exports.isObjectId( elem._id ) ){
        return elem._id.toString()
    }

    return undefined
}

/**
 * Similar to the getObjectId, except instead of a single reference, this works on elements that are an array of
 * references.
 *
 * @function    getObjectIds
 * @memberof    MongooseHelper
 * @param       {array}                 elem    Document item holding the array of references
 * @param       {(object|string)}       elem[]  Either a populated document, or an ObjectId
 * @returns     {array|false|undefined}         false if elem is not array; undefined if elem is empty; array of objectIDs 
 *                                              if elem is an array of ObjectIds or documents; undefined if anything else
 * @todo    A param to convert the IDs to strings, as opposed to handing over what they are exactly (can be an objects)
 */
_exports.getObjectIds = elem => {
    if( ! _.isArray( elem ) ){
        return false
    }
    else if( _.isEmpty( elem ) ){
        return undefined
    }
    else if( _exports.isObjectId( elem[0] ) ){
        return elem
    }
    else if( _.isObject( elem[0] ) && ! _.isUndefined( elem[0]._id ) && _exports.isObjectId( elem[0]._id ) ){
        return _.map( elem, e => e._id )
    }
        
    return undefined
}

/**
 * Check if a specific document element reference is populated or not. The reason that _.isObject cant simply be used,
 * is because if it isn't populated, the ObjectId value does register as an object. So if the element provided is an
 * ObjectId, or it is NOT a JS object, then the return val will be `false`, otherwise, it's `true`
 *
 * @function    isPopulated
 * @memberof    MongooseHelper
 * @param       {object|string|object}  elem    Element to grab verify
 * @returns     {boolean}
 */
_exports.isPopulated = elem => {
    return ! _exports.isObjectId( elem ) || ! _.isObject( elem )
}

/**
 * Convert a string (file name) to a an appropriate model name
 *
 * @function    file2model
 * @memberof    MongooseHelper
 * @alias       file2Model, fileToModel
 * @param       {string}    fileName    Name of file
 * @returns     {string}                Model name to use
 * @todo        Should strip off any file extensions (even though thats done before it gets here)
 *
 * @example // Example of how to use file2model when creating a new Mongoose model
 *  const MoelName = _m.file2model( __filename ) // SomeResource.js => Someresource
 *
 *  module.exports = Mongoose => {
 *      if( ! _.isUndefined( Mongoose.models[ ModelName ] ) )
 *          return Mongoose.models[ ModelName ]
 *      
 *      const ModelSchema = new Schema({
 *          // Schema stuff.....  
 *      })
 *
 *      return Mongoose.model( ModelName, ModelSchema ) 
 *      // => New model: Someresource
 *  }
 */
_exports.file2model = _exports.file2Model = _exports.fileToModel = file => {
    if( ! file || ! _.isString( file ) ){
        return false
    }

    const fileName = Path.basename( file )

    // Get the model name from the file name
    const filenameRegex = fileName.match( /(.*)\.js/ )

    if( ! filenameRegex || filenameRegex.length < 2  || ! filenameRegex[ 1 ]){
        Log.debug( `Ignoring the file ${file}` )

        return false
    }

    return _.chain( filenameRegex[ 1 ] ).toLower().upperFirst().value()
}

/**
 * Retrieve the type of a specific element. This basically just the _.typeof mixin, just adds the ability to check if
 * an element is a Mongoose ObjectId
 *
 * @function    typeof
 * @memberof    MongooseHelper
 * @param       {Mixed}             elem    Element to determine the type for
 * @returns     {string}                    Element type (undefined, null, string, boolean, array, element, date, 
 *                                          regexp, object, number, function, unknown - and the newly added objectid)
 * @example // Using the _m.typeof to check if an assets identifier is an Object ID or a primary value
 *  Asset.get( '56d0819b655baf4a4a7f9cad' )
 *      .then( doc => {
 *          console.log( 'This documents identifier is the assets ' 
 *              + ( _m.typeof( doc.identifier() ) === 'objectid' ? 'ObjectID' : 'Primary Value' ) 
 *              + ': ' + doc.identifier())
 *          // => This documents identifier is the assets ObjectID: 56d0819b655baf4a4a7f9cad
 *          // .. or, if the partition has a primary field set ..
 *          // => This documents identifier is the assets Primary Value: asset-name-123
 *      })
 *      .catch( err => console.error( err.toString() ) )
 *
 */
_exports.typeof = elem => {
    if( _exports.isObjectId( elem ) ){
        return 'objectid'
    }
    
    return _.typeof( elem )
}

module.exports = _exports
