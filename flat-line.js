'use strict'

/**
 * @title Lodash Mixins aka flat-line
 * @description Extra useful Lodash mixins
 * @requires lodash, crypto, ./data.js
 *
 * Note: A few of the mixins were originally from phpjs.org methods, and were modified to use some of the lodash methods,
 * and to work as a mixin with the other methods. Also, they may have been optimized a bit, as they may have originally
 * been created some time ago. The methods that were originally from phpjs.org are: utf8Encode, utf8Decode and sha1.
 * Authors of borrowed functions are noted inside the functions themselves
 *
 * @author Justin Hyland (Mostly)
 * @url https://github.com/SASSET/flat-line
 * @see https://github.com/SASSET/flat-line
 * @version 0.1.0
 * @todo Split all functions into separate .js files; which can all be loaded by loading the index
 */

const Util = require('util')

/**
 * @module _
 */
const _ = require('lodash')

// Get a fresh copy of lodash, since implementing mixins in the instance
// being used to add the mixins, doesn't work very well
const __ = _.runInContext()

const _m = _.runInContext()

// Used for makeHash
const crypto = require('crypto')

// Functions and storage for internal use only
const _internals = {
    alternator: {
        i: 0,
        params: null
    },
    uncountable: require('./data').uncountable,
    censored: require('./data').censored,
    htmlEntities: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }
}


/**
 * Encodes an ISO-8859-1 string to UTF-8, this is meant to provide the same functionality
 * as the PHP utf8_encode function.
 *
 * @name        module:_.utf8Encode
 * @function    module:_.utf8Encode
 * @memberof    module:_
 * @param       {string}    str     Standard ISO-8859-1 encoded string
 * @returns     {string}    UTF-8 encoded version of the str param value
 * @example _.utf8Encode('Hello World')
 *              // => Hello World
 */
function utf8Encode ( str ) {
    if ( _.isNull( str ) || _.isUndefined( str ) || str === '' )
        return str

    if( ! _.isString( str ) && ! _.isNumber( str ))
        throw new Error( `Illegal value type given to utf8Encode, expected a ISO-8859-1 encoded string, but received a ${typeof str}` )

    const string = (str + '') // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    let utftext = '',
        stringl = 0,
        start, end

    start = end = 0
    stringl = _.size( string )
    for (let n = 0; n < stringl; n++) {
        let c1 = string.charCodeAt(n)
        let enc = null

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            )
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800)
                throw new RangeError('Unmatched trail surrogate at ' + n)

            var c2 = string.charCodeAt(++n)
            if ((c2 & 0xFC00) != 0xDC00)
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1))

            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            )
        }
        if ( ! _.isNull( enc )) {
            if (end > start)
                utftext += string.slice(start, end)

            utftext += enc
            start = end = n + 1
        }
    }

    if (end > start)
        utftext += string.slice(start, stringl)

    return utftext
}

/**
 * Decodes a UTF-8 encoded string to the standard ISO-8859-1, this is meant to provide the same functionality
 * as the PHP utf8_decode function.
 *
 * @name        module:_.utf8Decode
 * @function    module:_.utf8Decode
 * @memberof    module:_
 * @param       {string}    str     UTF-8 encoded string
 * @returns     {string}   ISO-8859-1 decoded string
 * @example _.utf8Decode('Hello World')
 *              // => Hello World
 */
function utf8Decode ( str ) {
    if ( _.isNull( str ) || _.isUndefined( str ) || str === '' )
        return str

    //if( ! _.isString( str ) && ! _.isNumber( str ))
        //throw new Error( `Illegal value type given to utf8Decode, expected a UTF-8 encoded string, but received a ${typeof str}` )

    let tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0,
        c4 = 0

    str += ''

    while ( i < _.size( str ) ) {
        c1 = str.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1)
            i++
        } else if (c1 <= 223) {
            c2 = str.charCodeAt(i + 1)
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63))
            i += 2
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str.charCodeAt(i + 1)
            c3 = str.charCodeAt(i + 2)
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
            i += 3
        } else {
            c2 = str.charCodeAt(i + 1)
            c3 = str.charCodeAt(i + 2)
            c4 = str.charCodeAt(i + 3)
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)
            c1 -= 0x10000
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF))
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF))
            i += 4
        }
    }

    return tmp_arr.join('')
}

/**
 * Alternate through the parameters provided, returning the next one in line every time.
 *
 * Instructions:
 *      - Calling alternator() with the SAME parameters will return the next param each time
 *      - Calling alternator() with NEW parameters will re-initialize the rotation, and return
 *          the first new parameter listed
 *      - Calling alternator() with NO parameters will reset the rotation to null, and return nothing
 *
 * @name        module:_.alternator
 * @function    module:_.alternator
 * @memberof    module:_
 * @var         {array}     parameters  Parameters to rotate through
 * @returns     {Mixed}     Whatever array element is next in line, or nothing when resetting
 * @todo    Create unit tests
 * @example
 * for(i = 0; i< 6; i++)
 *      _.alternator('a','b','c')
 *      // returns (incrementally) : a, b, c, a, b, c
 */
function alternator() {
    // If no params are set, just reset everything, return nothing
    if( ! arguments ){
        //console.log('# A')
        _internals.alternator.i = 0
        _internals.alternator.params = null
    }

    // If this is the first time passing params, OR the params md5sum has changed
    // (meaning new params), then reset the alternator with the new params
    if( _internals.alternator.params === null || md5( JSON.stringify( arguments ) ) !== _internals.alternator.params ){
        //console.log('# B')
        _internals.alternator.i = 0
        _internals.alternator.params = md5( JSON.stringify( arguments ) )

        return arguments[ _internals.alternator.i ++ ]
    }

    // Just calling alternator again with the same params as last time..
    if( _internals.alternator.i === arguments.length ){
        _internals.alternator.i = 0
    }

    return arguments[ _internals.alternator.i ++ ]
}

/**
 * Retrieve the md5sum value for a specific string.
 *
 * This source was taken from the PHP.js project, I take no credit for this code
 *
 * @name        module:_.md5
 * @function    module:_.md5
 * @memberof    module:_
 * @author Not me (Justin Hyland)
 * @see http://phpjs.org/functions/md5/
 * @param   {string}    str     String to hash
 * @returns {string}    32 character MD5 sum
 * @todo    Create unit tests
 * @example md5('Hello World') === 'b10a8db164e0754105b7a99be72e3fe5'
 */
function md5( str ) {
    //  discuss at: http://phpjs.org/functions/md5/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  depends on: utf8_encode
    //   example 1: md5('Kevin van Zonneveld');
    //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    var xl;

    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function(x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function(x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function(x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function(x, y, z) {
        return (y ^ (x | (~z)));
    };

    var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function(lValue) {
        var wordToHexValue = '',
            wordToHexValue_temp = '',
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = '0' + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    str = utf8Decode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
}

/**
 * Iterate through an array of absolute file paths, removing the common paths from each element. This is useful
 * for when you don't need to have the entire absolute path in the name.
 *
 * @function    module:_.stripCommonRoot
 * @name        module:_.stripCommonRoot
 * @memberof    module:_
 * @param       {array}     pathArray   Array of paths..
 * @returns     {array}                 Modified version of the provided array
 *
 * @example  
 *  Gizmo.stripCommonRoot([ 
 *      '/home/jdoe/app/lib/helpers/mongoose-helper.js',
 *      '/home/jdoe/app/dev/file-foo.js',
 *      '/home/jdoe/app/dev/some-file.js' 
 * ]).join(', ')
 * // => /lib/helpers/mongoose-helper.js, /dev/file-foo.js, /dev/some-file.js
 */
function stripCommonRoot( pathArray ){
    if( ! _.isArray( pathArray ) ){
        Log.debug( `Expected an array - received ${_.typeof(pathArray)}` )

        return false
    }

    if( ! _.size( pathArray ) ){
        return []
    }

    if( ! _.every( pathArray, _.isString ) ){
        Log.debug( `Expected an array of strings - received ${_.typeof(pathArray)}` )

        return false
    }

    let pathsSplit = _.map( pathArray, p => _.split( p, '/') )
    let currentVal = null
    let result = null

    let isFirstSame = p => {
        if( currentVal === null ){
            currentVal = p[0]
            return true
        }
        return p[0] == currentVal
    }

    // Iterate over the segments of the path, checking if all of the values for this segment in every path is the same.
    do {
        if( _.every( pathsSplit, isFirstSame ) ){
            pathsSplit = _.map( pathsSplit, p => _.drop( p ) )
            currentVal = null
        }

        // When we reach a segment thats not the same in every path, then set the `result` variable, which will abort 
        // the do/while loop
        else {
            result = _.map( pathsSplit, p => '/' + _.join( p, '/' ) )
        }
    }
    while ( result === null )
    
    return result
}

/**
 * Iterate through an array of absolute file paths, removing the common paths from each absolute path. The shortened 
 * filenames are returned in an array, while the common path 
 *
 * @function    module:_.sumPaths
 * @alias       module:_.summarizePaths
 * @memberof    module:_
 * @param       {array}     pathArray       Array of paths..
 * @returns     {Object}    pathObj         Object containing the common absolute path, and an array of files (with 
 *                                          paths relative to the common absolute path)
 * @returns     {string}    pathObj.path    The absolute path up to the last common folder that all files share
 * @returns     {array}     pathObj.files   Array of filenames, paths starting where {pathObj.path} left off
 *
 * @example  
 *  _.sumPaths.summarizePaths([ 
 *      '/home/jdoe/app/lib/helpers/mongoose-helper.js',
 *      '/home/jdoe/app/dev/file-foo.js',
 *      '/home/jdoe/app/dev/some-file.js' 
 * ])
 * // => { path: '/home/jdoe/app',
 *          files: [ 
 *              '/lib/helpers/mongoose-helper.js', '/dev/file-foo.js', '/dev/some-file.js' 
 *          ] 
 *      }
 */
function sumPaths( pathArray ){ 
    if( ! _.isArray( pathArray ) ){
        Log.debug( `Expected an array - received ${_.typeof(pathArray)}` )

        return false
    }

    if( ! _.size( pathArray ) ){
        return []
    }

    if( ! _.every( pathArray, _.isString ) ){
        Log.debug( `Expected an array of strings - received ${_.typeof(pathArray)}` )

        return false
    }

    let pathsSplit = _.map( pathArray, p => _.split( p, '/') )
    let currentVal = null
    let result = null
    let commonRoot = []

    let isFirstSame = p => {
        // If the 'currentVal' is null, then this is the first iteration, so set it to this
        // value, which will be compared with all the others
        if( currentVal === null ){
            currentVal = p[0]
            return true
        }

        // Not the first iteration, compare it to the value
        return p[0] == currentVal
    }

    // Iterate over the segments of the path, checking if all of the values for this segment in every path is the same.
    do {
        // Check if the [0] element in each array is the same..
        if( _.every( pathsSplit, isFirstSame ) ){
            // .. If they are all the same, then drop the first item from each path,
            pathsSplit = _.map( pathsSplit, _.drop )
            // Add the path segment to the common root array/path
            commonRoot.push( currentVal )
            // Reset the currentVal
            currentVal = null
        }

        // When we reach a segment thats not the same in every path, then set the `result` variable, which will abort 
        // the do/while loop
        else {
            result = _.map( pathsSplit, p => '/' + _.join( p, '/' ) )
        }
    }
    while ( result === null )
    
    return {
        path : commonRoot.join('/'),
        files: result
    }
}

/**
 * Retrieve the types of values in an array or an object. 
 *
 * @name        module:_.valTypes
 * @alias       module:_.valueTypes
 * @function    module:_.valTypes
 * @memberof    module:_
 * @param       {(Object|array)}    collection  Array or object (collection of data).
 * @param       {?function=}         filter      Filter the collection using a simple function
 * @returns     {array}                         Array of types of values in the collection
 *
 * @example // Example showing how duplicate value types only display the value type once
 *  _.valTypes([ 
 *      1, 'Str', false, [], null, new Array(), undefined, {}, 
 *      new Date(), function(){}, (s => `This is a ${s}`)('str')
 *  ]).join(', ').join(', ')
 *  // => number, string, boolean, array, null, undefined, object, date, function
 *
 * @example // Using Gizmo.valueTypes to verify all parameters are string types
 *  function onlyAcceptsStringParams( foo, bar, baz, bang ){
 *      var invalidParamTypes = Gizmo.valTypes( arguments, f => ! _.isString(f) )
 *      if( invalidParamTypes.length > 0 ) 
 *          throw new Error( 'Expected ll parameters to be strings - received invalid type(s): ' + invalidParamTypes.join(', ') ) 
 *  }
 */
function valTypes( collection, filter ){ 

    if( _.isObject( collection ) ){
        collection = _.values( collection )
    }
    else if( ! _.isArray( collection ) ){
        throw new Error( `Helper function valTypes expected an object or array for the collection value - received type: ${_.type(collection)}` )
    }

    var chain = _.chain( collection )

    if( _.isFunction( filter ) ){
        chain = chain.filter( filter )
    }

    return chain
        //.map( v => _.lowerCase( _.typeof( v ) ) )
        .map( _.typeof )
        .map( _.lowerCase )
        .uniq()
        .value() 
}

/**
 * Calculate the sha1 hash of a specific string. This is the equivalent of PHP's sha1()
 * function.
 *
 * @name        module:_.sha1
 * @function    module:_.sha1
 * @memberof    module:_
 * @param       {string}    str     String to calculate hash for
 * @returns     {string}    SHA1 hash
 * @example 
 *  _.sha1('test')
 *  // => a94a8fe5ccb19ba61c4c0873d391e987982fbbd3
 */
function sha1 ( str ) {
    const rotate_left = ( n, s ) => (n << s) | (n >>> (32 - s))

    /*var lsb_hex = function (val) { // Not in use; needed?
     var str="";
     var i;
     var vh;
     var vl;

     for ( i=0; i<=6; i+=2 ) {
     vh = (val>>>(i*4+4))&0x0f;
     vl = (val>>>(i*4))&0x0f;
     str += vh.toString(16) + vl.toString(16);
     }
     return str;
     };*/

    const cvt_hex = val => {
        let str = ''
        let i
        let v

        for (i = 7; i >= 0; i--) {
            str += ((val >>> (i * 4)) & 0x0f).toString(16)
        }
        return str
    }

    let blockstart
    let i, j
    const W = new Array(80)
    let H0 = 0x67452301
    let H1 = 0xEFCDAB89
    let H2 = 0x98BADCFE
    let H3 = 0x10325476
    let H4 = 0xC3D2E1F0
    let A, B, C, D, E
    let temp

    str = utf8Encode(str)
    const str_len = _.size( str )

    const word_array = []

    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3)
        word_array.push(j)
    }

    switch (str_len % 4) {
        case 0:
            i = 0x080000000
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
            8 | 0x80
            break;
    }

    word_array.push(i)

    while ((_.size( word_array ) % 16) != 14) {
        word_array.push(0)
    }

    word_array.push(str_len >>> 29)
    word_array.push((str_len << 3) & 0x0ffffffff)

    for (blockstart = 0; blockstart < _.size( word_array ); blockstart += 16) {
        for (i = 0; i < 16; i++) {
            W[i] = word_array[blockstart + i]
        }
        for (i = 16; i <= 79; i++) {
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
        }

        A = H0
        B = H1
        C = H2
        D = H3
        E = H4

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
            E = D
            D = C
            C = rotate_left(B, 30)
            B = A
            A = temp
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
            E = D
            D = C
            C = rotate_left(B, 30)
            B = A
            A = temp
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
            E = D
            D = C
            C = rotate_left(B, 30)
            B = A
            A = temp
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
            E = D
            D = C
            C = rotate_left(B, 30)
            B = A
            A = temp
        }

        H0 = (H0 + A) & 0x0ffffffff
        H1 = (H1 + B) & 0x0ffffffff
        H2 = (H2 + C) & 0x0ffffffff
        H3 = (H3 + D) & 0x0ffffffff
        H4 = (H4 + E) & 0x0ffffffff
    }

    return ( cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4) ).toLowerCase()
}

/**
 * Generate a hash of a given string, using the provided salt
 *
 * @name        module:_.makeHash
 * @function    module:_.makeHash
 * @memberof    module:_
 * @param       {string}    str     String to hash
 * @param       {string}    salt    Salt to use for hash
 * @returns     {string}    base64 encoded hash
 * @example 
 *  _.makeHash('superSecretPassword','secret-salt')
 *  // => ebA3UZET3LDQWzl <cut> TUnV5oRxAvOLsA==
 */
function makeHash ( str, salt ) {
    if( ! _.isString( str ) || ! _.isString( salt ))
        throw new Error('_.hash() requires two string parameters, a string to hash and a salt')

    const h = crypto.createHash('sha512')

    h.update(str)
    h.update(salt)

    return h.digest('base64')
}

/**
 * Return a randomly generated string - at a specific length
 *
 * @name        module:_.randStr
 * @function    module:_.randStr
 * @memberof    module:_
 * @param       {number}    length  Length of the desored string (Default: 20)
 * @returns     {string}
 * @todo    Add the ability to specify the 'possible' string characters
 * @example 
 *  _.randStr( 15 )
 *  // => gyC8Q9MABoEjGK6
 */
function randStr ( length ) {
    length = length || 20

    if( ! isNumeric( length ))
        throw new Error('_.randStr needs a numeric value')

    let result = ''

    const possible = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '$./'
        //'`~!@#$%^&*()-_=+[{]}\\|\'";:/?.>,<'
    ].join('')

    for( let i=0; i < Number( length ); i++ )
        result += possible.charAt(Math.floor(Math.random() * possible.length))

    return result
}

/**
 * Substitute specific characters within a string with a specified replacement.
 * Replacement positions are specified by either a single (numeric) value, or an
 * array of numeric values
 *
 * @name        module:_.replaceAt
 * @function    module:_.replaceAt
 * @memberof    module:_
 * @param       {string}            str         String to process
 * @param       {(number|array)}    indexndex   Location(s) to be substituted
 * @param       {string}            character   Character to substitute replacements with
 * @returns     {string}    Parsed/modified version of the provided string
 * @todo    Allow the character parameter to be an array, and use the alternator method to iterate through them while substituting the replacements
 * @todo    Allow the index to be a range
 * @example 
 *  _.replaceAt( 'baz', 2, 'r')
 *  // => bar
 *  _.replaceAt( 'bad-word', [1,2,5,6], '*')
 *  // => b**-w**d
 *  _.replaceAt( 'Hello World', [6,7,8,9,10] )
 *  // => Hello ?????
 */
function replaceAt ( str, index, character ) {
    character = character || '?'
    if( _.isArray( index ) ){
        return __( str )
            .map((s, i) => {
                if( _.indexOf(index, i ) === -1 ){
                    return s
                }

                return character
            })
            .value()
            .join('')
    }
    
    return str.substr(0, index) + character + str.substr(index+character.length)
}

/**
 * Return items true type by grabbing the 2nd string content from Object.prototype.toString.call, as opposed to the 
 * less-specific 'typeof'
 *
 * @name        module:_.getType
 * @function    module:_.getType
 * @memberof    module:_
 * @param       {*}     item    Item to retrieve type for
 * @returns     {string}    Type of variable
 * @example 
 *  _.type([])
 *  // => array
 *  _.type({})
 *  // => object
 *  _.type(() => {})
 *  // => function
 */
function getType ( item ) {
    const objType = Object.prototype.toString.call( item )

    const match = objType.match( /^\[object\s(.*)\]$/ )

    return match[1].toLowerCase()
}

/**
 * This performs a series of replacements in a string, using the items within
 * an object/array. Just a quicker/easier way than chaining .replace() over
 * and over again. The replacements can be an array of arrays, an array of objects,
 * or an object
 *
 * @name        module:_.multiReplace
 * @function    module:_.multiReplace
 * @memberof    module:_
 * @param       {string}            str             String to be parsed/returned
 * @param       {(object|array)}    replacements    Replacements, with original string as the key, and replacement as 
 *                                                  the value
 * @param       {string}            modifiers       Regex modifiers to use for search (EG: i for case-insensitivity) 
 *                                                  'g' (global) is included by default
 * @returns     {string}    Parsed and modified version of the provided string
 * @example 
 *  _.multiReplace( 'test', { t: 'T'} )
 *  // => TesT
 *  _.multiReplace( 'foo', { FOO: 'bar'}, 'i' )
 *  // => bar
 *  _.multiReplace( 'Windows XP', [{ windows: 'Linux'}, {xp: 'RHEL'}], 'i' )
 *  // => Linux RHEL
 */
function multiReplace ( str, replacements, modifiers ) {
    if( ! str || ! _.isString(str) ){
        return str
    }

    if( ! replacements ){
        return str
    }

    // Replacements need to be an object, or an array with two values (which is verified later)
    if( ! _.isPlainObject( replacements ) && ! _.isArray( replacements ) ){
        throw new Error(`Replacements need to be an array or plain object, you gave us a ${getType(str)}`)
    }

    // Since we later expect for the replacements to be an object, check if its
    // an array, if so, reconstruct it into an object
    if( _.isArray( replacements ) ) {
        const replacementsObj = {}

        // Loop through each replacement, checking the values, making sure both a search/replace is present
        _.forEach( replacements, r => {
            // If its an array, then it needs atleast two values in it
            if( _.isArray(r)) {
                if( _.isUndefined( r[0] ) || _.isUndefined( r[1] ) ) {
                    throw new Error( 'Replacement structure illegal - Array of unfulfilled array' )
                }
                else {
                    replacementsObj[ r[ 0 ] ] = r[ 1 ]
                }
            }
            // If its an object, use hte key/val
            else if(_.isPlainObject(r)) {
                replacementsObj[ Object.keys(r)[0]] = r[Object.keys(r)[0]]
            }
            
            // Shouldnt ever really get here, but I guess im just paranoid
            else {
                throw new Error(`Replacement structure illegal - Array of non-array and non-object`)
            }
        } )

        replacements = replacementsObj
    }

    // Execute the replacements!
    _.forEach( replacements, ( r, f ) => {
        str = str.replace( new RegExp( f, `g${modifiers || ''}` ), r )
    })

    return str
}

/**
 * Swap the keys and values of a simple plain object
 *
 * @name        module:_.swap
 * @function    module:_.swap
 * @memberof    module:_
 * @param       {object}    obj     Object to swap values for
 * @returns     {object}    Returns a version of the original object with the keys and values switched (wherever possible)
 * @example 
 *  _.swap({a:'b', c:'d'})
 *  // => {b:'a', d:'c'}
 */
function swap ( obj ) {
    if( ! _.isPlainObject( obj ) ){
        throw new Error(`Only plain objects can be swapped, you gave us a ${getType(obj)}`)
    }

    const result = {}

    _.forEach(obj, ( v, k ) => {
        result[v] = k
    })

    return result
}

/**
 * Return a new array containing only the unique objects inside the provided
 * array. Unlike _.uniq, this will check _every_ key/value in the array
 *
 * @name        module:_.uniqObjs
 * @function    module:_.uniqObjs
 * @memberof    module:_
 * @param       {array}     arr     Array of structurally identical objects
 * @param       {object}    arr[]   All values in the provided array need to be objects
 * @returns     {array}
 * @example
 *  // Remove any duplicate objects
 *  const objs = [ { x: 1, y: 2 }, { a: 1, b: 2 }, { x: 1, y: 2 }]
 *  console.log( _( objs ).uniqObjs().value() )
 *  console.log( _.uniqObjs( objs ) )
 *  // => [ { x: 1, y: 2 }, { a: 1, b: 2 } ]
 */
function uniqObjs ( arr ) {
    // Make sure that the arr parameter is a defined & populated array of objects
    if( ! _.isArray( arr ) || ! arr.length || ! _.isObject( arr[0] ) ){
        return false
    }

    const uniqs = []

    // Filter out the duplicate objects within the array by checking if
    // the stringified object value already exist in the temporary uniqs
    // array (while adding them to the variable)
    return _.filter( arr, ( obj ) => {
        // Use _.sortObj to sort the contents of the object by the keys, since stringify
        // will use the current order (which means identical objects in different orders
        // will be seen as discrepancies)
        if( _.indexOf( uniqs, JSON.stringify( sortObj( obj ) ) ) === -1 ){
            uniqs.push( JSON.stringify( sortObj( obj ) ) )
            return true
        }

        return false
    })
}

/**
 * Check if the provided number is a float or integer value. This just tacks
 * a 2nd check onto lodashes isNumber, which uses a lenient comparative operator
 * to check if the value of Number is the same as the provided number
 *
 * @name        module:_.isNumeric
 * @function    module:_.isNumeric
 * @memberof    module:_
 * @param       {(string|integer|number)}   num     Number to check
 * @returns     {boolean}
 * @example
 *  _.isNumber( 123 )  
 *  _.isNumber( '123' )
 *  _.isNumber( 1.2 )  
 *  _.isNumber( '1.2' )
 *  // => true
 *
 *  _.isNumber( 'foo' )
 *  _.isNumber( [] )   
 *  _.isNumber( {} ) 
 *  // => false
 */
function isNumeric ( num ) {
    return _.isNumber( num ) || Number( num ) == num
}

/**
 * Validate a string against an RFC822 compliant pattern
 *
 * @name        module:_.isEmail
 * @function    module:_.isEmail
 * @memberof    module:_
 * @param       {string}    email   Email address to validate against pattern
 * @returns     {boolean}
 * @example
 *  _.isEmail( 'j@linux.com' ) 
 *  // => true
 *
 *  _.isEmail( 'j@linux.c' ) 
 *  _.isEmail( 'jinux.com' ) 
 *  _.isEmail( null )  
 *  // => false
 */
function isEmail ( email ) {
    // Must be a string!
    if( ! _.isString( email ) ){
        return false
    }

    // Verify the length (using min/max standards)
    if( email.length < 4 || email.length > 255 ){
        return false
    }

    // Only RFC822 compliant pattern that would work with JS
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email )
}

/**
 * Check if two values match each other. Basically sorts the object and
 * source, then passes it off to _.isMatch, (Since objects/arrays with
 * same values in different orders would be considered discrepancies
 *
 * @name        module:_.sortMatch
 * @function    module:_.sortMatch
 * @memberof    module:_
 * @param       {*}         object      Item A to match to B
 * @param       {*}         source      Item B to match to A
 * @param       {function=} customizer  Function to cuztomize the object and src (Just handed of to _.isMatch)
 * @returns     {boolean}
 * @example
 *  _.sortMatch( [1,2,3], [3,2,1] )
 *  // => true
 *  _.sortMatch( [1,2,'3'], [3,2,1] )
 *  // => false
 */
function sortMatch ( object, source, customizer ) {
    if( _.isUndefined( object ) || _.isUndefined( source ) ){
        throw new Error('Must define two same-type values to sort and match')
    }

    if( getType( object ) !== getType( source ) ){
        return false
    }

    if( _.isPlainObject( object )) {
        object = sortObj( object )
        source = sortObj( source )
    }
    else if( _.isArray( object )) {
        object = object.sort()
        source = source.sort()
    }
    else {
        throw new Error('test')
    }

    return _.isMatch( object, source, customizer )
}

/**
 * Just a boolean comparison tool, Allows you to specify other true-type
 * variables, as well as convert the value to lower case (Since the string
 * representations of the boolean values are lower). Also compares integer
 * values
 *
 * @name        module:_.bool
 * @function    module:_.bool
 * @memberof    module:_
 * @param       {(string|boolean|integer)}  value           Value to compare
 * @param       {(array|string)}            trues           Any other custom 'true' type variables, an attempt is made 
 *                                                          to convert any  value to an array
 * @param       {boolean}                   [lower=false]   Process the values after toLowerCase() is called
 * @returns     Boolean casted version of the provided value
 * @example 
 *  _.bool( true ) === true
 *  _.bool( 'true' ) === true
 *  _.bool( 1 ) === true
 *  _.bool( 'foo', [ 'foo', 'bar' ] ) === true
 *  _.bool( '1' ) === true
 *  _.bool( 'false' ) === false
 *  _.bool( false ) === false
 *  _.bool( 0 ) === false
 *  _.bool( '0' ) === false
 *  _.bool( 'foo', [ 'bar', 'baz' ] ) === false
 */
function bool ( value, trues, lower ) {
    if( _.isUndefined( trues ) ){
        trues = []
    }
    else if(_.isString( trues )){
        trues = [ trues ]
    }
    else if( ! _.isArray( trues )){
        throw new Error( `Illegal additional true types, must be string or array, received: ${getType(trues)}`)
    }

    trues = _.union( [ 1, '1', true, 'true' ], trues )

    return _.indexOf( trues, !!lower === true ? value.toLowerCase() : value ) !== -1
}

/**
 * Ensure a specific string ends with a certain character
 *
 * @name        module:_.endWith
 * @function    module:_.endWith
 * @memberof    module:_
 * @param       {string}    str         String to parse and modify (if needed)
 * @param       {string}    endChar     String to check for on the ending, and possibly append
 * @returns     {string}    The string returned will be either the exact same string provided, or ${str + endChar} if 
 *                          the original string doesn't end with the endChar character
 * @example 
 *  _.endWith('/User/john.doe/Documents', '/')
 *  // => /User/john.doe/Documents/
 *  _.endWith('Something else.', '.')
 *  // => Something else.
 */
function endWith ( str, endChar ) {
    return _.endsWith( str, endChar )
        ? str
        : str + endChar
}

/**
 * Ensure a specific string DOESN'T end with a certain character
 *
 * @name        module:_.dontEndWith
 * @function    module:_.dontEndWith
 * @memberof    module:_
 * @todo Should be able to replace an ending str like // with /
 * @param       {string}    str     String to parse and modify (if needed)
 * @param       {string}    endChar     String to check for on the ending, and possibly remove
 * @returns     {string}    The string returned will be either the exact same string provided, or a version of the
 *                          original string with the value of endChar removed from the end
 * @example 
 *  _.dontEndWith('/v1/resource/name/', '/')
 *  // => /v1/resource/name
 */
function dontEndWith ( str, endChar ) {
    return _.endsWith( str, endChar )
        ? str.replace( new RegExp( endChar+'$'), '')
        : str
}

/**
 * Ensure a specific string starts with a certain character
 *
 * @name        module:_.startWith
 * @function    module:_.startWith
 * @memberof    module:_
 * @param       {string}    str         String to parse and modify (if needed)
 * @param       {string}    startChar   String to check for on the beginning, and possibly append
 * @returns     {string}    The string returned will be either the exact same string provided, or ${startChar + str} if 
 *                          the original string doesn't begin with the startChar character
 * @example 
 *  _.startWith('Documents/', '~/')
 *  // => ~/Documents/
 *  _.startWith('Something else.', '.')
 *  // => Something else.
 *  _( 'Using startsWith and endsWith together' )
 *  .startWith('(')
 *  .endWith(')')
 *  .value()
 *  // => (Using startsWith and endsWith together)
 */
function startWith ( str, startChar ) {
    return _.startsWith( str, startChar )
        ? str
        : startChar + str
}

/**
 * Ensure a specific string DOESN'T start with a certain character
 *
 * @name        module:_.dontStartWith
 * @function    module:_.dontStartWith
 * @memberof    module:_
 * @todo Should be able to replace an starting str like // with /
 * @param       {string}    str         String to parse and modify (if needed)
 * @param       {string}    startChar   String to check for on the beginning, and possibly remove
 * @returns     {string}    The string returned will be either the exact same string provided, or a version of the 
 *                          original string with the value of startChar removed from the beginning
 * @example 
 *  _.dontStartWith('.unhide-me', '.')
 *  // => unhide-me
 */
function dontStartWith ( str, startChar ) {
    return _.startsWith( str, startChar )
        ? str.replace( new RegExp( '^'+startChar ), '')
        : str
}

/**
 * Convert any new-line characters to HTML Line breaks, which can optionally be specified,
 * but defaults to just </br>. The replaced characters consists of \r\n, \n\r, \n and \r.
 *
 * @name        module:_.nl2br
 * @function    module:_.nl2br
 * @memberof    module:_
 * @param       {string}    str             String to process and replace any new lines for
 * @param       {string}    [br='</br>']    HTML Break (</br> by default)
 * @returns     {string}    Modified version of ${str}, with all new-line characters replaced with an HTML line break
 * @todo    Another parameter to optionally trim the string before line breaks to get rid of first/last
 * @todo    Another parameter to keep the \n on the end of the newly added </br> tag
 * @example 
 *  _.nl2br("One\r\nTwo\n\rThree\nFour\rFive")
 *  // => One</br>Two</br>Three</br>Four</br>Five
 */
function nl2br ( str, br ) {
    return str.split(/\r\n|\n\r|\n|\r/).join( br || '</br>' )
}

/**
 * Complete opposite of the _.nl2br - This replaces any HTML Line breaks with the line return character,
 * which can optionally be specified, but defaults to just \r\n. The HTML break replaced is </br>, <br>,
 * </BR> or <BR>
 *
 * @name        module:_.br2nl
 * @function    module:_.br2nl
 * @memberof    module:_
 * @param       {string}    str             String to process and replace any HTML line breaks for
 * @param       {string}    [nl='\r\n']     New line character (\r\n by default)
 * @returns     {string}    Modified version of ${str}, with all HTML line breaks replaced with new-line characters
 * @todo    Another parameter to optionally trim the string before line breaks to get rid of first/last
 * @todo    Another parameter to keep the \</br> tag on the end of the newly added \n
 * @example 
 *  _.nl2br("One<br>Two</br>Three</BR>Four<BR>Five")
 *  // => One\r\nTwo\r\nThree\r\nFour\r\nFive
 */
function br2nl ( str, nl ) {
    return str.split(/<\/?br>/i).join( nl || "\r\n" )
}

/**
 * Censor any common profanity words by replacing it with a specified word, or masking all or
 * some of the characters with a single specified character. The words are kept in the separate
 * data.js file, and base64 encrypted, as to not store a huge list of profanity on any users
 * computer. The list of words is actually a list that was downloaded from a TeamSpeak related
 * website of words to ban:
 * http://addons.teamspeak.com/directory/addon/miscellaneous-tools/TXT-English-badwords-bans-and-list.html
 * Note: This only supports the English language, the dirty version
 *
 * @name        module:_.censor
 * @function    module:_.censor
 * @memberof    module:_
 * @param       {string}    word                    Word to censor and parse
 * @param       {string}    [masker='*']            Single character or full single word
 * @param       {string}    [maskType='partial']    The masking 'type', can be:
 *                                      full        Entire word
 *                                      single      Single character
 *                                      firstlast   First and last letters
 *                                      middle      All BUT first and last
 *                                      partial     Majority of letters (55% after first letter)
 * @returns     {string}    Parsed and censored version of the provided word
 * @example 
 *  _.censor('damn')
 *  // => d**n
 */
function censor ( word, masker, maskType ) {
    if( ! word ){
        return word
    }

    masker   = masker ||'*'
    maskType = maskType || 'partial'

    const censored = _internals.censored
    const encWord  = new Buffer( word ).toString( 'base64' )

    // Lets hope this is a God fearing christian without a potty mouth
    if( _.indexOf( censored, encWord ) === -1 ){
        return word
    }

    // Return the masker to default if it's not a string
    if( ! masker || ! _.isString( masker ) ){
        masker = '*'
    }

    // If just a single character was given for the masker, then we can use the maskType
    if( masker.length <= 1 ){
        switch ( maskType ) {
            case 'full':
                return _.repeat( masker, word.length )
                break

            case 'single':
                return replaceAt( word, 2, masker )
                break

            case 'firstlast':
                return replaceAt( word, [0, word.length-1], masker )
                break

            case 'middle':
                const middles = _( word ).map(( s, i ) => i).drop().dropRight().value();
                return replaceAt( word, middles, masker )
                break

            default: // Partial
                const replaceNum = Math.floor(( 55 / 100 ) *  word.length)
                const range = _.range(1, replaceNum+1)
                return replaceAt( word, range, masker )
                break
        }
    }

    // If we were given a phrase as the mask, then just replace the entire word with that
    return masker
}

/**
 * Generate a salted hash of a specified password string - Similar to PHPs
 * password_hash function, which returns a string with the hash AND the salt,
 * making it easier to store in a database, and easier to verify
 *
 * @name        module:_.passwordHash
 * @function    module:_.passwordHash
 * @memberof    module:_
 * @param       {string}    password        Password to hash
 * @returns     {string}    109 character password hash (salt is first 20 characters)
 * @note        Every password hash is generated by using a salt value that is randomly generated every time, this means 
 *              that the resulting hash will be different every time it executes, even if the passwords are the same
 * @example 
 *  const pwd1 = _.passwordHash('SomePass')
 *  // => LIE9OKy0g$eNB <cut> XFMcfx78L5SuZZivA==
 *  const pwd2 = _.passwordHash('SomePass')
 *  pwd1 === pwd2
 *  // => false
 */
function passwordHash ( password ) {
    if( ! password ){
        throw new Error('No password was given to hash')
    }

    if( ! _.isString( password ) ){
        throw new Error('Must provide a STRING as a password')
    }

    // Generate the salt
    // THIS MUST NOT CHANGE! If this value is not the same as what
    // passwordVerify expects, no hash will be validated
    const salt = randStr( 20 )

    // Return the salted hash with the salt prepended to it
    return salt + makeHash( password, salt )
}

/**
 * Verify a password against a password hash generated by _.passwordHash
 *
 * @name        module:_.passwordVerify
 * @function    module:_.passwordVerify
 * @memberof    module:_
 * @param       {string}    password        Password to verify
 * @param       {string}    passwdHash      String generated by _.passwordHash
 * @returns     {boolean}   TRUE if the result of a hash generated with the
 *                          same password and the salt found in passwordHash,
 *                          matches the hash inside passwordHash
 * @example 
 *  const hashA = _.passwordHash( 'secret' )
 *  _.passwordVerify( 'secret', hashA )
 *  // => true
 */
function passwordVerify ( password, passwdHash ) {
    if( ! password || ! passwdHash ){
        throw new Error('Need to provide both a password and a hash to verify')
    }

    if( ! _.isString( password ) || ! _.isString( passwdHash ) ){
        throw new Error('Password and hash both need to be strings')
    }

    // If the hash isn't even the proper length, don't bother checking
    if( passwdHash.length !== 108 ){
        return false
    }

    // Get the salt from the password hash - first 20 chars
    const salt = passwdHash.substr( 0, 20 )
    // Get the password hash, everything after the first 20 chars
    const hash = passwdHash.substr( 20 )

    // Check the hash against a hash generated with the same data
    return makeHash( password, salt ) === hash
}

/**
 * Return a copy of the object with the content sorted by the keys
 *
 * @name        module:_.sortObj
 * @function    module:_.sortObj
 * @memberof    module:_
 * @param       {object}    obj         Object to sort by keys
 * @param       {function}  comparator  Function to compare/sort the elements
 * @returns     {object}
 * @example
 *  const obj = {b: 3, c: 2, a: 1}
 *  console.log( _.sortObj( obj ) )
 *  console.log( _( obj ).sortObj().value() )
 *
 *  // => {a: 1, b: 3, c: 2}
 *
 *  _.sortObj( obj, ( value, key ) => value )
 *  // => {a: 1, c: 2, b: 3}
 */
function sortObj( obj, comparator ) {
    // Make sure we were given an object...
    if( ! _.isObject( obj ) ){
        throw new Error(`_.sortObj expects an object obj is: ${getType(obj)}`)
    }

    // If comparator is provided, then it needs to be a function, if it isn't
    // a function, then throw an error
    if( ! _.isUndefined( comparator ) && ! _.isFunction( comparator ) ){
        throw new Error(`_.sortObj expects the comparator to be a function (if defined), but received a: ${getType(comparator)}`)
    }

    // Create an array of the object keys, sorted either alpha/numeric
    // by default, or using the comparator if defined
    const keys = _.sortBy( _.keys( obj ), key => {
        return _.isFunction( comparator )
            ? comparator( obj[ key ], key )
            : key
    })

    // Return a newly created object which uses the keys in the array
    // created above, and grabs the associated data from the object
    // provided
    return _.zipObject( keys, _.map( keys, key => {
        return obj[ key ]
    }))
}

/**
 * Validate that an array, or objects in an array, or elements within the
 * objects in an array are all unique
 *
 * @name        module:_.isUniq
 * @function    module:_.isUniq
 * @memberof    module:_
 * @param       {array}     collection  Single level array or array of objects
 * @param       {string=}   element     If `collection` is an array of objects, and we are to check that a specific 
 *                                      element in those objects is unique, then this should be the name of the element
 *                                      in the object
 * @returns     {boolean}  
 * @example 
 *  _.isUniq( [ 1, 2, 3, 2 ] )
 *  // => false
 *  _.isUniq( [ {a: 1}, {a: 2}, {a: 1} ] ) 
 *  // => false
 *  _.isUniq( [ {a: 1, b: 2}, {a: 2, b: 5}, {a: 1, b: 2} ], 'b')
 *  // => false
 */
function isUniq ( collection, element ) {
    if( ! _.isArray( collection ) ){
        throw new Error( 'Collection needs to be an array, you provided a ' + getTypeof( collection ) )
    }

    if( collection.length === 0 ){
        return true
    }

    // If this is an array of objects, then handle it differently than if its just an array
    if( _.isObject( collection[0] ) ) {
        // If no specific element is provided, then uniq the entire object
        if ( _.isUndefined( element ) ) {
            return uniqObjs( collection ).length === collection.length
        }
        // If an element was provided, then check that just that element is unique
        return _.uniqBy( collection, element ).length === collection.length
    }

    // Here, we can just unique the array and verify the length
    return _.uniq( collection ).length === collection.length
}

/**
 * Remove items from object, mutating the original object by removing specified element(s),
 * and returning a new object of said element(s)
 * This is basically the same as lodashes _.remove method, except this works for Objects,
 * not arrays.
 *
 * @name        module:_.removeObj
 * @function    module:_.removeObj
 * @memberof    module:_
 * @param       {object}            obj     Object (to mutate)
 * @param       {(array|string)}    del     Element(s) to remove from obj
 * @returns     {object}            Object of items removed from obj param
 * @note    This will mutate the original object, removing the `del` element(s)
 * @todo    Need to add some sanity checking, some more logic, etc etc
 * @todo    This should be able to take a function for the del
 * @example
 *  var testObj = { first: 'John', last: 'Doe', middle: 'w', age: 26, height: 75 }
 *  testObj = _.removeObj( testObj, 'height')
 *  // => { first: 'John', last: 'Doe', middle: 'w', age: 26 }
 *  testObj = _.removeObj( testObj, [ 'age','middle' ])
 *  // => { first: 'John', last: 'Doe' }
 */
function removeObj ( obj, del )  {
    const picked = _.pick( obj, del )

    if(_.isArray(del)){
        _.forEach(del, d => {
            _.unset(obj, d)
        })
    }
    else {
        _.unset(obj, del)
    }

    return picked
}

/**
 * Escape a string, making it safe to use in a MySQL query. Based off of PHPs
 * mysql_real_escape_string
 *
 * @name        module:_.mysqlEscape
 * @function    module:_.mysqlEscape
 * @memberof    module:_
 * @param       {string}                content     String to use in the MySQL query
 * @returns     {string}                            Safe version of the content string parameter
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.mysqlEscape( "Justin\\\\'s Boots" )
 *  // => "Justin\\'s Boots"
 */
function mysqlEscape ( content ) {
    const replacements = [
        [ "\\", "\\\\" ],
        [ "\'", "\\\'" ],
        [ "\"", "\\\"" ],
        [ "\n", "\\\n" ],
        [ "\r", "\\\r" ],
        [ "\x00", "\\\x00" ],
        [ "\x1a", "\\\x1a" ]
    ]

    const map = {
        "\\": "\\\\",
        "\'": "\\\'",
        "\"": "\\\"",
        "\n": "\\\n",
        "\r": "\\\r",
        "\x00": "\\\x00",
        "\x1a": "\\\x1a"
    }

    return replace( content, map )

    /*return content
     .replace("\\", "\\\\")
     .replace("\'", "\\\'")
     .replace("\"", "\\\"")
     .replace("\n", "\\\n")
     .replace("\r", "\\\r")
     .replace("\x00", "\\\x00")
     .replace("\x1a", "\\\x1a")
     */
}

/**
 * Check if a specified string is in snake_case format
 *
 * @name        module:_.isSnake
 * @function    module:_.isSnake
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {boolean}   Returns True if the string is in case snake, False otherwise.
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.isSnake( _.snakeCase('Foo Bar') )
 *  // => true
 *  _.isSnake( _.camelCase('Foo Bar') )
 *  // => false
 */
function isSnake ( str ) {
    return str === _.snakeCase( str )
}

/**
 * Check if a specified string is in camelCase format
 *
 * @name        module:_.isCamel
 * @function    module:_.isCamel
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {boolean}
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.isSnake( _.snakeCase('Foo Bar') )
 *  // => true
 *  _.isSnake( _.camelCase('Foo Bar') )
 *  // => false
 */
function isCamel ( str ) {
    return str === _.camelCase( str )
}

/**
 * Check if a specified string is in kebab-case format
 *
 * @name        module:_.isKebab
 * @function    module:_.isKebab
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {boolean}
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.isKebab( _.kebabCase('Foo Bar') )
 *  // => true
 *  _.isKebab( _.camelCase('Foo Bar') )
 *  // => false
 */
function isKebab ( str ) {
    return str === _.kebabCase( str )
}

/**
 * Check if a specified string is in Start Case format
 *
 * @name        module:_.isStart
 * @function    module:_.isStart
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {boolean}
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.isSnake( _.snakeCase('Foo Bar') )
 *  // => true
 *  _.isSnake( _.camelCase('Foo Bar') )
 *  // => false
 */
function isStart ( str ) {
    return str === _.startCase( str )
}

/**
 * Check if a specified string is in lower case format
 *
 * @name        module:_.isLower
 * @function    module:_.isLower
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {boolean}
 * @example
 *  _.isLower( _.lowerCase('Foo Bar') )
 *  // => true
 *  _.isLower( _.upperCase('Foo Bar') )
 *  // => false
 */
function isLower ( str ) {
    return str === _.lowerCase( str )
}

/**
 * Check if a specified string is in UPPER CASE format
 *
 * @name        module:_.isUpper
 * @function    module:_.isUpper
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {boolean}
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.isUpper( _.upperCase('Foo Bar') )
 *  // => true
 *  _.isUpper( _.lowerCase('Foo Bar') )
 *  // => false
 */
function isUpper ( str ) {
    return str === _.upperCase( str )
}

/**
 * Retrieve the case type of a specified string
 *
 * @name        module:_.getCase
 * @function    module:_.getCase
 * @memberof    module:_
 * @param       {string}    str     String to inspect
 * @returns     {(string|undefined)}  Will return one of: snake, camel, kebab, start, lower, upper or undefined if none
 * @note        ALPHA PHASE - Under Construction, needs a serious re-write
 * @example
 * var str = 'Hello World..'
 *  _.each()
 */
function getCase ( str ) {
    
    if( isUpper( str ) ){
        return 'upper'
    }

    if( isSnake( str ) ){
        return 'snake'
    }

    if( isCamel( str ) ){
        return 'camel'
    }
    
    if( isKebab( str ) ){
        return 'kebab'
    }

    if( isStart( str ) ){
        return 'start'
    }

    if( isLower( str ) ){
        return 'lower'
    }

    return undefined
}

/**
 * Verify a string is in a specified format.
 *
 * @name        module:_.isCase
 * @function    module:_.isCase
 * @memberof    module:_
 * @param       {string}    theCase The case to validate
 * @param       {string}    str     String to inspect
 * @returns     {boolean}
 * @note        ALPHA PHASE - Under Construction
 * @example
 *  _.isCase( 'snake', _.snakeCase( 'Hello World' ) )
 *  // => true
 *  _.isCase( 'kebab', _.snakeCase( 'Hello World' ) )
 *  // => false
 */
function isCase ( theCase, str ) {
    switch( theCase ){
        case 'snake':
            return _.snakeCase( str ) === str
            break

        case 'camel':
            return _.camelCase( str ) === str
            break

        case 'kebab':
            return _.kebabCase( str ) === str
            break

        case 'start':
            return _.startCase( str ) === str
            break

        case 'lower':
            return _.lowerCase( str ) === str
            break

        case 'upper':
            return _.upperCase( str ) === str
            break

        default:
            return false
            break
    }
}

/**
 * Verify that a collection (string, array or object) has all listed values, basically
 * just an array-friendly version of _.includes
 *
 * @name        module:_.includesAll
 * @function    module:_.includesAll
 * @memberof    module:_
 * @param       {(array|object|string)} collection  The collection to search
 * @param       {mixed}                 values      The value or values to search for
 * @param       {number}                fromIndex   The index to search from.
 * @returns     {boolean}   Returns `true` based on the result of _.includes
 * @example 
 *  _.includesAll( [1,2,3], [1,3] )
 *  // => true
 *  _.includesAll( [1,2,3], [1,2], 2 )
 *  // => false
 *  _.includesAll( {user: 'fred', age: 40 }, ['fred', 40] )
 *  // => true
 *  _.includesAll( 'abcdef', ['a','d] )
 *  // => true
 */
function includesAll ( collection, values, fromIndex ) {
    // Make sure we were given an array as the collection
    if( ! _.isArray( collection ) && ! _.isObject( collection ) && ! _.isString( collection ) ){
        throw new Error( '_.includesAll: Expecting an array, string or object as the collection' )
    }

    if( _.isUndefined( values ) || _.isNull( values ) ){
        throw new Error( '_.includesAll: Need a value to check for' )
    }

    // Default this to 0
    fromIndex = _.isNumber( fromIndex ) ? Number( fromIndex ) : 0

    // If were given an array, then iterate through the collection
    if( _.isArray( values ) ){
        return _.every( values, v => _.includes( collection, v, fromIndex ) )
    }

    // If we are NOT given an array for the values, then just hand everything down to the
    // _.includes, according to the documentation, it can accept "anything" as the value
    // (But it doesn't work as expected when given an array), hence this function
    return _.includes( collection, values, fromIndex )
}

/**
 * Return the maximum value of all arguments passed. This is the same thing as _.max,
 * only instead of an array, it takes all the arguments
 *
 * @name        module:_.maxOf
 * @function    module:_.maxOf
 * @memberof    module:_
 * @var         {array} arguments   Pulls the arguments provided
 * @todo    Create unit tests
 * @returns     {number}    Maximum value, retrieved by _.max()
 * @example
 *  _.maxOf( 1, 20, 'a', ['test'], 1000 )
 *  // => 1000
 */
function maxOf() {
    return _.max( _.chain( arguments ).map( n => Number( n ) ).value() )
}

/**
 * Return the minimum value of all arguments passed. This is the same thing as _.min,
 * only instead of an array, it takes all the arguments
 *
 * @name        module:_.minOf
 * @function    module:_.minOf
 * @memberof    module:_
 * @var         {array} arguments   Pulls the arguments provided
 * @todo        Create unit tests
 * @returns     {number}    Minimum value, retrieved by _.min()
 * @example
 *  _.minOf( 1, 20, 'a', ['test'], 1000 )
 *  // => 1
 */
function minOf() {
    return _.min( _.chain( arguments ).map(n => Number( n ) ).value() )
}

/**
 * Use the Levenshtein formula to calculate the distance in the similarities
 * of two separate strings, which can be anywhere from 0 (strings are identical)
 * to the length of the longer string provided (100% different). The higher the
 * distance, the more different the strings are, but the distance can only be
 * as high as high as the number of characters in the longer string
 *
 * @name        module:_.levenshtein
 * @function    module:_.levenshtein
 * @memberof    module:_
 * @param       {(string|number)}    strA    String A
 * @param       {(string|number)}    strB    String .... Yep, B
 * @returns     {number}            Levenshtein distance value
 * @note        ALPHA PHASE - Under Construction
 * @todo    Create unit tests
 * @example 
 *  levenshtein( 'foo','foo' )
 *  // => 0
 *  levenshtein( 'foo','bar' ) 
 *  // => 3
 */
function levenshtein ( strA, strB ) {
    // Make sure we were given Strings or Numbers, and nothing else
    if( (_.isString( strA ) && ! _.isNumber( strA ) ) || (_.isString( strB ) && ! _.isNumber( strB ) ) ){
        throw new Error( 'Need to provide two strings or numbers to differentiate')
    }

    const cost = []
    const n = strA.length
    const m = strB.length
    let i
    let j

    if ( n === 0 || m === 0 ){
        return
    }

    for ( i = 0; i <= n; i++ ) {
        _.set( cost, `[${i}][0]`, i )
    }

    for ( j = 0; j <= m; j++ ) {
        cost[0][j] = j
    }
    //console.log('cost',cost)

    for ( i = 1; i <= n; i++ ) {
        let x = strA.charAt(i - 1)

        for ( j = 1; j <= m; j++ ) {
            let y = strB.charAt(j - 1)

            if ( x == y ) {
                cost[i][j] = cost[i - 1][j - 1]
            }
            else {
                cost[i][j] = 1 + minOf( cost[i - 1][j - 1], cost[i][j - 1], cost[i - 1][j] )
            }
        }

    }

    return cost[n][m]
}

/**
 * String Difference Distance (In percentages). This basically returns
 * the Levenshtein value as a percentage
 *
 * @name        module:_.strDist
 * @function    module:_.strDist
 * @memberof    module:_
 * @param       {(string|number)}    strA    String A
 * @param       {(string|number)}    strB    String .... Yep, B
 * @returns     {number}            Levenshtein distance percentage (WITHOUT the % on the end)
 * @todo    Create unit tests
 * @example 
 *  strDist( 'foo','foo' )
 *  // => 0
 *  strDist( 'foo','bar' ) 
 *  // => 100
 *  strDist( 'something', 'somewhere' )
 *  // => 44.44
 */
function strDist( strA, strB ) {
    const distance = levenshtein( strA, strB )

    if( distance === false ){
        return false
    }

    return Number( (distance * 100) / maxOf( strA.length, strB.length ))
}

function isCountable( noun ){
    return ! _.includes( _internals.uncountable, noun )
}

/**
 * Return the plural version of a string
 *
 * @name        module:_.plural
 * @function    module:_.plural
 * @memberof    module:_
 * @param       {string}    str     Singular format of a noun
 * @returns     {string}            Plural version of same noun
 * @todo    Create unit tests
 * @example 
 *  _.plural( 'apple' )
 *  // => apples
 *  _.plural( 'toy' )
 *  // => toys
 *  _.plural( 'fly' )
 *  // => flies
 */
function plural( str ){
    if (str.lastChar() === 'y') {
        if ( (str.charAt(str.length - 2)).isVowel() ) {
            // If the y has a vowel before it (i.e. toys), then you just add the s.
            return str + 's';
        }
        
        // If a this ends in y with a consonant before it (fly), you drop the y and add -ies to make it plural.
        return str.slice(0, -1) + 'ies';
    }
    
    if ( str.substring( str.length - 2) === 'us') {
        // ends in us -> i, needs to preceede the generic 's' rule
        return str.slice(0, -2) + 'i';
    }
    
    if (['ch', 'sh'].indexOf( str.substring( str.length - 2)) !== -1 || ['x','s'].indexOf(str.lastChar()) !== -1) {
        // If a this ends in ch, sh, x, s, you add -es to make it plural.
        return str + 'es';
    }

    // anything else, just add s
    return str + 's';
}

/**
 * Merge multiple objects together without mutating the original object
 * This basically just hands everything off to _.merge, just adds an empty object to the beginning, so
 *      _.merge( {}, ObjsA, ObjsB )
 * would be the same as
 *      _.mergeObjs( ObjsA, ObjsB )
 * 
 * @name        module:_.mergeObjs
 * @function    module:_.mergeObjs
 * @memberof    module:_
 * @param   {...object} [sources] The source objects
 * @returns {object}    Newly merged object
 * @example 
 *  _.mergeObjs( { a: 1 }, { b: 2 }, { c: 3 } )
 *  // => { a: 1, b: 2, c: 3 }
 */
function mergeObjs( sources ){
    return _.merge.apply( this, _.flatten( [ {}, arguments || [] ]))
}

/* Not sure what this is for.. forgot.
function matches( source ) {
    return function(obj) {
        return _.some(_.toPairs(source), function(keyValue) {
            return obj[keyValue[0]] === keyValue[1];
        });
    };
}
*/

/**
 * Ensures the item is an instance of the exception specified by type
 *
 * @name        module:_.setException
 * @function    module:_.setException
 * @memberof    module:_
 * @param       {Mixed}     item            Item/Error/Whatever
 * @param       {Mixed}     [type=Error]    Exception type (Default: Error)
 * @returns     {Mixed}     Returns an instance of Error, or whatevers specified by item
 * @example 
 *  let err = 'Error Str'
 *  // => Error Str
 *  err = _.setException( err )
 *  // => [Error: Error Str]
 *  err = _.setException( err )
 *  // => [Error: Error Str]
 *  // Notice no matter how many times its used, Error is not nested, as opposed to setting new Error( err )
 */
function setException( item, type ){
    if( _.isUndefined( type ) ){
        type = Error
    }

    return item instanceof type
        ? item
        : new type( item )
}

/**
 * Pulls a sample from an array - Useful for when iterating over an array (manually), and having to remove the previous
 * iterations
 *
 * @name        module:_.pullSample
 * @function    module:_.pullSample
 * @memberof    module:_
 * @note    This method mutates the array, just as _.pull does
 * @param       {array}   arr   Array to sample
 * @returns     {Mixed}         Whatever element was sampled from the array
 * @example 
 *  var data = [ 100, 200 ]
 *  _.pullSample( data )  
 *  // => 200                   
 *  _.pullSample( data )  
 *  // => 100           
 *  _.pullSample( data )
 *  // => []
 */
function pullSample( arr ){
    if( _.isUndefined( arr ) ){
        return undefined
    }

    if( ! _.isArray( arr ) ){
        throw new Error( `Expected to sample an array - received a ${getTypeof( arr )}` )
    }

    if( _.isEmpty( arr ) ){
        return undefined
    }

    const sample = _.sample( arr )

    _.pull( arr, sample )

    return sample
}

/**
 * Pulls an array of samples from an array - Basically the same thing as _.pullSample, except this samples multiple
 * elements, with the amount specified by the size parameter
 *
 * @name        module:_.pullSampleSize
 * @function    module:_.pullSampleSize
 * @memberof    module:_
 * @note    This method mutates the array, just as _.pull does
 * @param   {array}   arr   Array to sample
 * @param   {number}  size  Amount of elements to sample/remove from arr
 * @returns {array}         Array of one or more elements from arr
 * @example 
 *  var data = [ 100, 200, 300, 400 ]
 *  _.pullSampleSize( data, 2 )  // [ 100, 200 ]
 *  _.pullSampleSize( data, 2 )  // [ 300, 400 ]
 *  _.pullSampleSize( data, 2 )  // [ ]
 *  data                           // []
 */
function pullSampleSize( arr, size ){
    if( size === 0 ){
        return []
    }

    if( _.isUndefined( size ) ){
        size = 1
    }

    if( ! _.isNumber( size ) ){
        throw new Error( `Expected size to be undefined or a number - received a ${getTypeof( size )}` )
    }

    if( _.isUndefined( arr ) ){
        return undefined
    }

    if( ! _.isArray( arr ) ){
        throw new Error( `Expected to sample an array - received a ${getTypeof( arr )}` )
    }

    if( _.isEmpty( arr ) ){
        return []
    }

    if( size > _.size( arr ) ){
        size = _.size( arr )
    }

    const result = []

    _.times( size, () => {
        let sample = _.sample( arr )

        _.pull( arr, sample )

        result.push( sample )
    } )

    return _.flatten( result )
}

/**
 * Validation for legitimate regular expression pattern validation
 *
 * @name        module:_.validPattern
 * @function    module:_.validPattern
 * @memberof    module:_
 * @param   {Mixed}             pattern     Pattern to validate (String, number, regexp, etc)
 * @param   {string}            flags       Regular expression flags (Not required)
 * @param   {boolean}           reason      If pattern is invalid, instead of returning false, return the error (string),
 *                                          which would change the return to `true` = valid, and any string = invalid
 * @returns {boolean|string}   If the pattern will work in a regexp check, then true
 * @note    This is best used when validating strings, as invalid regexp elements will throw an error before this
 *          function even gets a chance to validate. Meaning something like `_.validPattern(/a/asdf)` will throw an
 *          exception on the line the invalid pattern was passed
 * @todo    Somehow parse a string for a regex pattern and flags; EG: /foo/g -> ['foo','g']; %bar%i -> ['bar','i']
 */
function validPattern( pattern, flags, reason ) {
    const permitted = [
        // Valid value types that can actually be valid regex patterns
        'regexp', 'string', 'number',
        // Empty/null can accidentally be sent, so don't reject them, as all it should do
        // is save an empty regex value to the config
        'undefined', 'null'
    ]

    const ptrnType = getTypeof( pattern )

    if( ! _.includes( permitted, ptrnType ) ){
        if( reason === true ){
            return `Illegal pattern value type, expecting a 'string', 'number' or RegExp object - received a '${ptrnType}'`
        }
        
        return false
    }

    // If flags are provided, they must be in string format
    if( ! _.isUndefined( flags ) && ! _.isNull( flags ) && ! _.isString( flags ) ){
        if( reason === true ){
            return `Illegal flag value type, expecting type 'string' or nothing - received a '${getTypeof( flags )}'`
        }
        
        return false
    }

    // null/undefined
    if( _.isEmpty( pattern ) ){
        return true
    }

    // Use this instead of just `arguments`, because we dont want the `reason` to be passed down
    const regexpParams = [ pattern ]

    if( _.isString( flags ) ){
        regexpParams.push( flags )
    }

    let isValid = true
    let err

    try {
        RegExp.apply( RegExp, regexpParams )
    } catch( e ) {
        err = e
        isValid = false
    }

    // If its valid, then return true and go no further!
    if( isValid === true ){
        return true
    }

    // If there needs to be a reason, then return one if there is one
    if( reason === true ){
        return err
            ? err.toString()
            : 'Invalid RegExp pattern - Unknown reason'
    }

    return false
}

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
 * @name        module:_.typeof
 * @function    module:_.typeof
 * @memberof    module:_
 * @param       {*}         value           Value to process
 * @param       {boolean}   inspect         Determine if the true value type should be determined through logical 
 *                                          processing
 * @param       {object}    returnTypes     Object of return type strings to overwrite
 * @param       {object}    flaggedVals     Values used to determine the real value types of flagged values (Only used 
 *                                          if scrutinize is enabled)
 * @returns     {string}    The variable type; The default type names are:
 *                          undefined, null, string, boolean, array, element, date, regexp, object, number, function, unknown
 *                       However, these can be overridden by providing an object as the 3rd parameter
 * @example _.typeof( [1,2] )       // array
 *          _.typeof( 'foo' )       // string
 *          _.typeof( true )        // boolean
 *          _.typeof( 'true' )      // string
 *          _.typeof( 'true',true ) // boolean
 *          _.typeof( null )        // null
 *          _.typeof( 'null' )      // string
 *          _.typeof( 'null',true ) // null
 */
function getTypeof ( value, inspect, returnTypes, flaggedVals ) {
    // String representations of the value types (Overridden by returnTypes if defined)
    const types = _.extend( {
        undefined:  'undefined',
        null:       'null',
        string:     'string',
        boolean:    'boolean',
        array:      'array',
        element:    'element',
        date:       'date',
        regexp:     'regexp',
        object:     'object',
        number:     'number',
        funct:   'function',
        unknown:    'unknown'
    }, returnTypes || {} )

    // Flagged values for string variables; EG: if string is 'true', then the it's Boolean (Overridden by
    // flaggedVals if defined)
    const flagged = _.extend( {
        boolean:    [ 'true', 'false' ],
        null:       [ 'null', 'NULL' ],
        undefined:  [ 'undefined' ]
    }, flaggedVals || {} )


    // Retrieve the actual object type from the prototype
    //const objType = Object.prototype.toString.call( value )

    // Attempt to regex match the type (value should be [object TYPE]
    //const objTypeRegex = objType.match( /^\[object\s(.*)\]$/ )

    /* $lab:coverage:off$ */
    // Match the type, or use the types.undefined (This shouldn't ever not match)
    //const objTypeString = objTypeRegex[1] ? objTypeRegex[1].toLowerCase() : types.unknown
    /* $lab:coverage:on$ */

    if( _.isUndefined( value ) ){
        return types.undefined
    }

    if( _.isNull( value ) ){
        return types.null
    }

    // String values are what get opened to scrutiny, if enabled
    if( _.isString( value ) ){
        // If inspect isnt enabled, then just return string
        if( !! inspect === false ){
            return types.string
        }

        // Numbers should be the same value if leniently compared against it's float-parsed self
        if( Number( value ) == value ){
            return types.number
        }

        // Check if this string is inside the boolean flags
        if( _.indexOf( flagged.boolean, value ) !== -1 ){
            return types.boolean
        }

        // Check if its inside any null flags
        if(  _.indexOf( flagged.null, value ) !== -1 ){
            return types.null
        }

        // Check if its inside any undefined flags
        if( _.indexOf( flagged.undefined, value ) !== -1 ){
            return types.undefined
        }

        // If no parser caught it, then it must be a string
        return types.string
    }

    // Certain check types can't be misconstrued as other types, unlike other types (such as objects), get those out
    // of the way
    if( _.isBoolean( value ) ){
        return types.boolean
    }

    if( _.isNumber( value ) ){
        return types.number
    }

    if( _.isDate( value ) ){
        return types.date
    }

    if( _.isRegExp( value ) ){
        return types.regexp
    }

    /* $lab:coverage:off$ */
    // Disabling coverage for this, since unit testing is done via node
    if( _.isElement( value ) ){
        return types.element
    }
    /* $lab:coverage:on$ */

    // Since isObject returns true for functions, check this before that
    if( _.isFunction( value ) ){
        return types.funct
    }

    // Since isObject also returns true for arrays, check that before as well
    if( _.isArray( value ) ){
        return types.array
    }

    // isObject should be last for any possible object 'types'
    if( _.isObject( value ) ){
        return types.object
    }

    /* $lab:coverage:off$ */
    // If nothing else was caught, then return the type found via the prototypes toString() call
    // Note: Disabling coverage, since I can't find a value to reach this, and it's just in case I missed something.
    // It helps me sleep at night
    return getType( value )
    /* $lab:coverage:on$ */
}

const defaultMixins = {
    md5: md5,
    swap: swap,
    bool: bool,
    sha1: sha1,
    hash: makeHash,
    type: getType,
    nl2br: nl2br,
    br2nl: br2nl,
    maxOf: maxOf,
    minOf: minOf,
    isCase: isCase,
    typeof: getTypeof,
    censor: censor,
    plural: plural,
    isUniq: isUniq,
    sortObj: sortObj,
    isSnake: isSnake,
    randStr: randStr,
    isCamel: isCamel,
    isKebab: isKebab,
    isStart: isStart,
    isLower: isLower,
    isUpper: isUpper,
    getCase: getCase,
    strDist: strDist,
    isEmail: isEmail,
    endWith: endWith,
    sumPaths: sumPaths,
    uniqObjs: uniqObjs,
    valTypes: valTypes,
    replaceAt: replaceAt,
    mergeObjs: mergeObjs,
    isNumeric: isNumeric,
    startWith: startWith,
    sortMatch: sortMatch,
    removeObj: removeObj,
    utf8Encode: utf8Encode,
    utf8Decode: utf8Decode,
    valueTypes: valTypes,
    pullSample: pullSample,
    mysqlEscape: mysqlEscape,
    isCountable: isCountable,
    dontEndWith: dontEndWith,
    levenshtein: levenshtein,
    includesAll: includesAll,
    validPattern: validPattern,
    passwordHash: passwordHash,
    setException: setException,
    multiReplace: multiReplace,
    dontStartWith: dontStartWith,
    passwordVerify: passwordVerify,
    pullSampleSize: pullSampleSize,
    summarizePaths: sumPaths,
    stripCommonRoot: stripCommonRoot
}

// Mixin the above functions into the fresh version of Lodash....
__.mixin( defaultMixins )

// module.exports = exports
module.exports = __