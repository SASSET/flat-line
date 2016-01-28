'use strict';

/**
 *
 * Some of the mixins were originally from phpjs.org methods, and were modified to use some of the lodash methods,
 * and to work as a mixin with the other methods. Also, they may have been optimized a bit, as they may have originally
 * been created some time ago. The methods that were originally from phpjs.org are: utf8Encode, utf8Decode and sha1
 */

/**
 * Mixins to add
 * - Inflection (Plural/Singluar): Convert string to plural or singular, based on a count
 *      http://www.kavoir.com/2011/04/php-class-converting-plural-to-singular-or-vice-versa-in-english.html
 *      https://laravel.com/docs/5.2/helpers#method-str-plural
 * - Plural detection (isPlural)
 *      EG: https://codeigniter.com/user_guide/helpers/inflector_helper.html
 *          http://stackoverflow.com/questions/1534127/pluralize-in-php
 * - Sanatization? (SQL Injection, XSS prevention, etc)
 * - Alternator: https://codeigniter.com/user_guide/helpers/string_helper.html#alternator
 * - Debugging/Checkpoint methods: Something to enable debugging, which would enable a bunch of debugging
 *      related functions; Maybe a verbosity level as well?
 */

var _arguments = arguments;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var _ = require('lodash');

// Get a fresh copy of lodash, since implementing mixins in the instance
// being used to add the mixins, doesn't work very well
var __ = _.runInContext();
var crypto = require('crypto');

var _internals = {
    alternator: 0,
    censored: require('./data').censored,
    htmlEntities: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }
};

var mixins = {};

/**
 * Encodes an ISO-8859-1 string to UTF-8, this is meant to provide the same functionality
 * as the PHP utf8_encode function.
 *
 * @param   {string}    str     Standard ISO-8859-1 encoded string
 * @return  UTF-8 encoded version of the str param value
 * @example _.utf8Encode('Hello World')
 *              // => Hello World
 */
mixins.utf8Encode = function (str) {
    if (_.isNull(str) || _.isUndefined(str) || str === '') return str;

    if (!_.isString(str) && !_.isNumber(str)) throw new Error('Illegal value type given to utf8Encode, expected a ISO-8859-1 encoded string, but received a ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)));

    var string = str + ''; // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        stringl = 0,
        start = undefined,
        end = undefined;

    start = end = 0;
    stringl = _.size(string);
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
        } else {
            // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) throw new RangeError('Unmatched trail surrogate at ' + n);

            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) throw new RangeError('Unmatched lead surrogate at ' + (n - 1));

            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(c1 >> 18 | 240, c1 >> 12 & 63 | 128, c1 >> 6 & 63 | 128, c1 & 63 | 128);
        }
        if (!_.isNull(enc)) {
            if (end > start) utftext += string.slice(start, end);

            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) utftext += string.slice(start, stringl);

    return utftext;
};

/**
 * Decodes a UTF-8 encoded string to the standard ISO-8859-1, this is meant to provide the same functionality
 * as the PHP utf8_decode function.
 *
 * @param   {string}    str     UTF-8 encoded string
 * @return  ISO-8859-1 decoded string
 * @example _.utf8Decode('Hello World')
 *              // => Hello World
 */
mixins.utf8Decode = function (str) {
    if (_.isNull(str) || _.isUndefined(str) || str === '') return str;

    if (!_.isString(str) && !_.isNumber(str)) throw new Error('Illegal value type given to utf8Decode, expected a UTF-8 encoded string, but received a ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)));

    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0,
        c4 = 0;

    str += '';

    while (i < _.size(str)) {
        c1 = str.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
            i += 2;
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str.charCodeAt(i + 1);
            c3 = str.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            i += 3;
        } else {
            c2 = str.charCodeAt(i + 1);
            c3 = str.charCodeAt(i + 2);
            c4 = str.charCodeAt(i + 3);
            c1 = (c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63;
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | c1 >> 10 & 0x3FF);
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | c1 & 0x3FF);
            i += 4;
        }
    }

    return tmp_arr.join('');
};

/**
 * Calculate the sha1 hash of a specific string. This is the equivalent of PHP's sha1()
 * function.
 *
 * @param   {string}    str     String to calculate hash for
 * @return  {string}    SHA1 hash
 * @example _.sha1('test')
 *              // => a94a8fe5ccb19ba61c4c0873d391e987982fbbd3
 */
mixins.sha1 = function (str) {
    var rotate_left = function rotate_left(n, s) {
        return n << s | n >>> 32 - s;
    };

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

    var cvt_hex = function cvt_hex(val) {
        var str = '';
        var i = undefined;
        var v = undefined;

        for (i = 7; i >= 0; i--) {
            str += (val >>> i * 4 & 0x0f).toString(16);
        }
        return str;
    };

    var blockstart = undefined;
    var i = undefined,
        j = undefined;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A = undefined,
        B = undefined,
        C = undefined,
        D = undefined,
        E = undefined;
    var temp = undefined;

    str = mixins.utf8Encode(str);
    var str_len = _.size(str);

    var word_array = [];

    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (str_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while (_.size(word_array) % 16 != 14) {
        word_array.push(0);
    }

    word_array.push(str_len >>> 29);
    word_array.push(str_len << 3 & 0x0ffffffff);

    for (blockstart = 0; blockstart < _.size(word_array); blockstart += 16) {
        for (i = 0; i < 16; i++) {
            W[i] = word_array[blockstart + i];
        }
        for (i = 16; i <= 79; i++) {
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = rotate_left(A, 5) + (B & C | ~B & D) + E + W[i] + 0x5A827999 & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1 & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = rotate_left(A, 5) + (B & C | B & D | C & D) + E + W[i] + 0x8F1BBCDC & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6 & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = H0 + A & 0x0ffffffff;
        H1 = H1 + B & 0x0ffffffff;
        H2 = H2 + C & 0x0ffffffff;
        H3 = H3 + D & 0x0ffffffff;
        H4 = H4 + E & 0x0ffffffff;
    }

    return (cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4)).toLowerCase();
};

/**
 * Generate a hash of a given string, using the provided salt
 *
 * @param   {string}    str     String to hash
 * @param   {string}    salt    Salt to use for hash
 * @return  {string}    base64 encoded hash
 * @example _.hash('superSecretPassword','secret-salt')
 *              // => ebA3UZET3LDQWzl <cut> TUnV5oRxAvOLsA==
 */
mixins.hash = function (str, salt) {
    if (!_.isString(str) || !_.isString(salt)) throw new Error('_.hash() requires two string parameters, a string to hash and a salt');

    var h = crypto.createHash('sha512');

    h.update(str);
    h.update(salt);

    return h.digest('base64');
};

/**
 * Return a randomly generated string - at a specific length
 *
 * @param   {number}    length  Length of the desored string (Default: 20)
 * @return  {string}
 * @todo    Add the ability to specify the 'possible' string characters
 * @example _.randStr( 15 )
 *              // => gyC8Q9MABoEjGK6
 */
mixins.randStr = function (length) {
    length = length || 20;

    if (!mixins.isNumeric(length)) throw new Error('_.randStr needs a numeric value');

    var result = '';

    var possible = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789', '$./'
    //'`~!@#$%^&*()-_=+[{]}\\|\'";:/?.>,<'
    ].join('');

    for (var i = 0; i < parseInt(length); i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }return result;
};

/**
 * Substitute specific characters within a string with a specified replacement.
 * Replacement positions are specified by either a single (numeric) value, or an
 * array of numeric values
 *
 * @param   {string}        str         String to process
 * @param   {number|array}  index       Location(s) to be substituted
 * @param   {string}        character   Character to substitute replacements with
 * @todo    Allow the character parameter to be an array, and use the alternator method to iterate through them while substituting the replacements
 * @todo    Allow the index to be a range
 * @example _.replaceAt( 'baz', 2, 'r')
 *              // => bar
 *          _.replaceAt( 'bad-word', [1,2,5,6], '*')
 *              // => b**-w**d
 *          _.replaceAt( 'Hello World', [6,7,8,9,10] )
 *              // => Hello ?????
 */
mixins.replaceAt = function (str, index, character) {
    character = character || '?';
    if (_.isArray(index)) {
        return __(str).map(function (s, i) {
            if (_.indexOf(index, i) === -1) return s;else return character;
        }).value().join('');
    } else {
        return str.substr(0, index) + character + str.substr(index + character.length);
    }
};

/**
 * Return items true type by grabbing the 2nd string content from
 * Object.prototype.toString.call, as opposed to the less-specific
 * 'typeof'
 *
 * @param   {*}     item    Item to retrieve type for
 * @example _.type([])
 *              // => array
 *          _.type({})
 *              // => object
 *          _.type(() => {})
 *              // => function
 */
mixins.type = function (item) {
    var objType = Object.prototype.toString.call(item);

    var match = objType.match(/^\[object\s(.*)\]$/);

    return match[1].toLowerCase();
};

/**
 * This performs a series of replacements in a string, using the items within
 * an object/array. Just a quicker/easier way than chaining .replace() over
 * and over again. The replacements can be an array of arrays, an array of objects,
 * or an object
 *
 * @param   {string}        str             String to be parsed/returned
 * @param   {object|array}  replacements    Replacements, with original string as
 *                                          the key, and replacement as the value
 * @param   {string}        modifiers       Regex modifiers to use for search
 *                                          (EG: i for case-insensitivity) 'g'
 *                                          (global) is included by default
 * @example _.replace( 'test', { t: 'T'} )
 *              // => TesT
 *          _.replace( 'foo', { FOO: 'bar'}, 'i' )
 *              // => bar
 *          _.replace( 'Windows XP', [{ windows: 'Linux'}, {xp: 'RHEL'}], 'i' )
 *              // => Linux RHEL
 */
mixins.replace = function (str, replacements, modifiers) {
    if (!str || !_.isString(str)) return str;

    if (!replacements) return str;

    if (!_.isPlainObject(replacements) && !_.isArray(replacements)) throw new Error('Replacements need to be an array or plain object, you gave us a ' + mixins.type(str));

    // If the replacements is an array, convert it to an object (validate the structure in the process)
    if (_.isArray(replacements)) {
        (function () {
            var replacementsObj = {};

            _.forEach(replacements, function (r) {
                if (_.isArray(r)) {
                    if (_.isUndefined(r[0]) || _.isUndefined(r[1])) {
                        throw new Error('Replacement structure illegal - Array of unfulfilled array');
                    } else {
                        replacementsObj[r[0]] = r[1];
                    }
                } else if (_.isPlainObject(r)) {
                    replacementsObj[Object.keys(r)[0]] = r[Object.keys(r)[0]];
                } else {
                    throw new Error('Replacement structure illegal - Array of non-array and non-object');
                }
            });

            replacements = replacementsObj;
        })();
    }

    // Execute the replacements!
    _.forEach(replacements, function (r, f) {
        str = str.replace(new RegExp(f, 'g' + (modifiers || '')), r);
    });

    return str;
};

/**
 * Swap the keys and values of a simple plain object
 *
 * @param   {object}    obj Object to swap values for
 * @example _.swap({a:'b', c:'d'})
 *              // => {b:'a', d:'c'}
 */
mixins.swap = function (obj) {
    if (!_.isPlainObject(obj)) throw new Error('Only plain objects can be swapped, you gave us a ' + mixins.type(obj));

    var result = {};

    _.forEach(obj, function (v, k) {
        result[v] = k;
    });

    return result;
};

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
mixins.uniqObjs = function (arr) {
    // Make sure that the arr parameter is a defined & populated array of objects
    if (!_.isArray(arr) || !arr.length || !_.isObject(arr[0])) return false;

    var uniqs = [];

    // Filter out the duplicate objects within the array by checking if
    // the stringified object value already exist in the temporary uniqs
    // array (while adding them to the variable)
    return _.filter(arr, function (obj) {
        // Use _.sortObj to sort the contents of the object by the keys, since stringify
        // will use the current order (which means identical objects in different orders
        // will be seen as discrepancies)
        if (_.indexOf(uniqs, JSON.stringify(mixins.sortObj(obj))) === -1) {
            uniqs.push(JSON.stringify(mixins.sortObj(obj)));
            return true;
        }

        return false;
    });
};

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
mixins.sortObj = function (obj, comparator) {
    // Make sure we were given an object...
    if (!_.isObject(obj)) throw new Error('_.sortObj expects an object obj is: ' + mixins.type(obj));

    // If comparator is provided, then it needs to be a function, if it isn't
    // a function, then throw an error
    if (!_.isUndefined(comparator) && !_.isFunction(comparator)) throw new Error('_.sortObj expects the comparator to be a function (if defined), but received a: ' + mixins.type(comparator));

    // Create an array of the object keys, sorted either alpha/numeric
    // by default, or using the comparator if defined
    var keys = _.sortBy(_.keys(obj), function (key) {
        return _.isFunction(comparator) ? comparator(obj[key], key) : key;
    });

    // Return a newly created object which uses the keys in the array
    // created above, and grabs the associated data from the object
    // provided
    return _.object(keys, _.map(keys, function (key) {
        return obj[key];
    }));
};

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
mixins.isNumeric = function (num) {
    return _.isNumber(num) || parseFloat(num) == num;
};

/**
 * Validate a string against an RFC822 compliant pattern
 *
 * @param   {string}    email   Email address to validate against pattern
 * @return  {boolean}
 */
mixins.isEmail = function (email) {
    // Must be a string!
    if (!_.isString(email)) return false;

    // Verify the length (using min/max standards)
    if (email.length < 4 || email.length > 255) return false;

    // Only RFC822 compliant pattern that would work with JS
    return (/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email)
    );
};

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
mixins.sortMatch = function (object, source, customizer) {
    if (_.isUndefined(object) || _.isUndefined(source)) throw new Error('Must define two same-type values to sort and match');

    if (mixins.type(object) !== mixins.type(source)) return false;

    if (_.isPlainObject(object)) {
        object = mixins.sortObj(object);
        source = mixins.sortObj(source);
    } else if (_.isArray(object)) {
        object = object.sort();
        source = source.sort();
    } else {
        throw new Error('test');
    }

    return _.isMatch(object, source, customizer);
};

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
mixins.bool = function (value, trues, lower) {
    if (_.isUndefined(trues)) trues = [];else if (_.isString(trues)) trues = [trues];else if (!_.isArray(trues)) throw new Error('Illegal additional true types, must be string or array, received: ' + mixins.type(trues));

    trues = _.union([1, '1', true, 'true'], trues);

    return _.indexOf(trues, !!lower === true ? value.toLowerCase() : value) !== -1;
};

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
mixins.typeof = function (value, scrutinize, returnTypes, flaggedVals) {
    // String representations of the value types (Overridden by
    // returnTypes if defined)
    var types = _.extend({
        undefined: 'undefined',
        null: 'null',
        string: 'string',
        boolean: 'boolean',
        array: 'array',
        element: 'element',
        date: 'date',
        regexp: 'regexp',
        object: 'object',
        number: 'number',
        function: 'function',
        unknown: 'unknown'
    }, returnTypes || {});

    // Flagged values for string variables; EG: if string is 'true',
    // then the it's Boolean (Overridden by flaggedVals if defined)
    var flagged = _.extend({
        boolean: ['true', 'false'],
        null: ['null', 'NULL'],
        undefined: ['undefined']
    }, flaggedVals || {});

    // Retrieve the actual object type from the prototype
    //const objType = Object.prototype.toString.call( value )

    // Attempt to regex match the type (value should be [object TYPE]
    //const objTypeRegex = objType.match( /^\[object\s(.*)\]$/ )

    /* $lab:coverage:off$ */
    // Match the type, or use the types.undefined (This shouldn't ever not
    // match)
    //const objTypeString = objTypeRegex[1] ? objTypeRegex[1].toLowerCase() : types.unknown
    /* $lab:coverage:on$ */

    if (_.isUndefined(value)) return types.undefined;

    if (_.isNull(value)) return types.null;

    // String values are what get opened to scrutiny, if enabled
    if (_.isString(value)) {
        // If scrutinize isnt enabled, then just return string
        if (!!scrutinize === false) return types.string;

        // Numbers should be the same value if leniently compared against it's float-parsed self
        if (parseFloat(value) == value) return types.number;

        // Check if this string is inside the boolean flags
        if (_.indexOf(flagged.boolean, value) !== -1) return types.boolean;

        // Check if its inside any null flags
        if (_.indexOf(flagged.null, value) !== -1) return types.null;

        // Check if its inside any undefined flags
        if (_.indexOf(flagged.undefined, value) !== -1) return types.undefined;

        // If no parser caught it, then it must be a string
        return types.string;
    }

    // Certain check types can't be misconstrued as other types, unlike other
    // types (such as objects), get those out of the way
    if (_.isBoolean(value)) return types.boolean;

    if (_.isNumber(value)) return types.number;

    if (_.isDate(value)) return types.date;

    if (_.isRegExp(value)) return types.regexp;

    /* $lab:coverage:off$ */
    // Disabling coverage for this, since unit testing is done via node
    if (_.isElement(value)) return types.element;
    /* $lab:coverage:on$ */

    // Since isObject returns true for functions, check this before that
    if (_.isFunction(value)) return types.function;

    // Since isObject also returns true for arrays, check that before as well
    if (_.isArray(value)) return types.array;

    // isObject should be last for any possible object 'types'
    if (_.isObject(value)) return types.object;

    /* $lab:coverage:off$ */
    // If nothing else was caught, then return the type found via the
    // prototypes toString() call
    // Note: Disabling coverage, since I can't find a value to reach this, and
    // it's just in case I missed something. It helps me sleep at night
    return mixins.type(value).toLowerCase();
    /* $lab:coverage:on$ */
};

/**
 * Ensure a specific string ends with a certain character
 *
 * @param   {string}    str     String to parse and modify (if needed)
 * @param   {string}    end     String to check for on the ending, and possibly append
 * @example _.endWith('/User/john.doe/Documents', '/')
 *              // => /User/john.doe/Documents/
 *          _.endWith('Something else.', '.')
 *              // => Something else.
 */
mixins.endWith = function (str, end) {
    return _.endsWith(str, end) ? str : str + end;
};

/**
 * Ensure a specific string starts with a certain character
 *
 * @param   {string}    str     String to parse and modify (if needed)
 * @param   {string}    start   String to check for on the beginning, and possibly append
 * @example _.startWith('Documents/', '~/')
 *              // => ~/Documents/
 *          _.startWith('Something else.', '.')
 *              // => Something else.
 *          _( 'Using startsWith and endsWith together' )
 *            .startWith('(')
 *            .endWith(')')
 *            .value()
 *            // => (Using startsWith and endsWith together)
 */
mixins.startWith = function (str, start) {
    return _.startsWith(str, start) ? str : start + str;
};

/**
 * Convert any new-line characters to HTML Line breaks, which can optionally be specified,
 * but defaults to just </br>. The replaced characters consists of \r\n, \n\r, \n and \r.
 *
 * @param   {string}    str     String to process and replace any new lines for
 * @param   {string}    br      HTML Break (</br> by default)
 * @todo    Another parameter to optionally trim the string before line breaks to get rid of first/last
 * @todo    Another parameter to keep the \n on the end of the newly added </br> tag
 * @example _.nl2br("One\r\nTwo\n\rThree\nFour\rFive")
 *              // => One</br>Two</br>Three</br>Four</br>Five
 */
mixins.nl2br = function (str, br) {
    return str.split(/\r\n|\n\r|\n|\r/).join(br || '</br>');
};

/**
 * Complete opposite of the _.nl2br - This replaces any HTML Line breaks with the line return character,
 * which can optionally be specified, but defaults to just \r\n. The HTML break replaced is </br>, <br>,
 * </BR> or <BR>
 *
 * @param   {string}    str     String to process and replace any HTML line breaks for
 * @param   {string}    nl      New line character (\r\n by default)
 * @todo    Another parameter to optionally trim the string before line breaks to get rid of first/last
 * @todo    Another parameter to keep the \</br> tag on the end of the newly added \n
 * @example _.nl2br("One<br>Two</br>Three</BR>Four<BR>Five")
 *              // => One\r\nTwo\r\nThree\r\nFour\r\nFive
 */
mixins.br2nl = function (str, nl) {
    return str.split(/<\/?br>/i).join(nl || "\r\n");
};

/**
 * Censor any common profanity words by replacing it with a specified word, or masking all or
 * some of the characters with a single specified character. The words are kept in the separate
 * data.js file, and base64 encrypted, as to not store a huge list of profanity on any users
 * computer. The list of words is actually a list that was downloaded from a TeamSpeak related
 * website of words to ban:
 * http://addons.teamspeak.com/directory/addon/miscellaneous-tools/TXT-English-badwords-bans-and-list.html
 * Note: This only supports the English language, the dirty version
 *
 * @param   {string}    word        Word to censor
 * @param   {string}    masker      Single character or full single word
 * @param   {string}    maskType    The masking 'type', can be:
 *                                      full        Entire word
 *                                      single      Single character
 *                                      firstlast   First and last letters
 *                                      middle      All BUT first and last
 *                                      partial     Majority of letters (55% after first letter)
 * @example _.censor('damn')
 *              // => d**n
 */
mixins.censor = function (word, masker, maskType) {
    if (!word) return word;

    masker = masker || '*';
    maskType = maskType || 'partial';

    var censored = _internals.censored;
    var encWord = new Buffer(word).toString('base64');

    // Lets hope this is a God fearing christian without a potty mouth
    if (_.indexOf(censored, encWord) === -1) return word;

    // Return the masker to default if it's not a string
    if (!masker || !_.isString(masker)) masker = '*';

    // If just a single character was given for the masker, then we can use the maskType
    if (masker.length <= 1) switch (maskType) {
        case 'full':
            return _.repeat(masker, word.length);
            break;

        case 'single':
            return mixins.replaceAt(word, 2, masker);
            break;

        case 'firstlast':
            return mixins.replaceAt(word, [0, word.length - 1], masker);
            break;

        case 'middle':
            var middles = _(word).map(function (s, i) {
                return i;
            }).drop().dropRight().value();
            return mixins.replaceAt(word, middles, masker);
            break;

        default:
            // Partial
            var replaceNum = Math.floor(55 / 100 * word.length);
            var range = _.range(1, replaceNum + 1);
            return mixins.replaceAt(word, range, masker);
            break;
    }

    // If we were given a phrase as the mask, then just replace the entire word with that
    else return masker;
};

/**
 * Generate a salted hash of a specified password string - Similar to PHPs
 * password_hash function, which returns a string with the hash AND the salt,
 * making it easier to store in a database, and easier to verify
 *
 * @param   {string}    password        Password to hash
 * @return  {string}    109 character password hash (salt is first 20 characters)
 * @example _.passwordHash('secret')
 *              // => LIE9OKy0g$eNB <cut> XFMcfx78L5SuZZivA==
 */
mixins.passwordHash = function (password) {
    if (!password) throw new Error('No password was given to hash');

    if (!_.isString(password)) throw new Error('Must provide a STRING as a password');

    // Generate the salt
    // THIS MUST NOT CHANGE! If this value is not the same as what
    // passwordVerify expects, no hash will be validated
    var salt = mixins.randStr(20);

    // Return the salted hash with the salt prepended to it
    return salt + mixins.hash(password, salt);
};

/**
 * Verify a password against a password hash generated by _.passwordHash
 *
 * @param   {string}    password    Password to verify
 * @param   {string}    passwdHash  String generated by _.passwordHash
 * @return  {boolean}   TRUE if the result of a hash generated with the
 *                      same password and the salt found in passwordHash,
 *                      matches the hash inside passwordHash
 * @example const hash = _.passwordHash('secret')
 *          _.passwordVerify('secret', hash)
 *              // => true
 */
mixins.passwordVerify = function (password, passwdHash) {
    if (!password || !passwdHash) throw new Error('Need to provide both a password and a hash to verify');

    if (!_.isString(password) || !_.isString(passwdHash)) throw new Error('Password and hash both need to be strings');

    // If the hash isn't even the proper length, don't bother checking
    if (passwdHash.length !== 108) return false;

    // Get the salt from the password hash - first 20 chars
    var salt = passwdHash.substr(0, 20);
    // Get the password hash, everything after the first 20 chars
    var hash = passwdHash.substr(20);

    // Check the hash against a hash generated with the same data
    return mixins.hash(password, salt) === hash;
};

/**
 * Remove items from object, mutating the original object by removing specified element(s),
 * and returning a new object of said element(s)
 * This is basically the same as lodashes _.remove method, except this works for Objects,
 * not arrays.
 *
 * @param   {object}        obj     Object (to mutate)
 * @param   {array|string}  del     Element(s) to remove from obj
 * @return  {object}        Object of items removed from obj param
 * @note    This will mutate the original object, removing the `del` element(s)
 * @todo    Need to add some sanity checking, some more logic, etc etc
 */
mixins.removeObj = function (obj, del) {
    var picked = _.pick(obj, del);

    if (_.isArray(del)) {
        _.forEach(del, function (d) {
            _.unset(obj, d);
        });
    } else {
        _.unset(obj, del);
    }

    return picked;
};

/**
 * UNDER CONSTRUCTION
 * Alternate through elements in an array (in order), returning the next element
 * every time _.alternator() is ran with the same array. Based off of CodeIgniters
 * alternator function in the string helper
 */
mixins.alternator = function () {
    console.log('Params', [].concat(Array.prototype.slice.call(_arguments)));
    return ++_internals.alternator;
};

/**
 * UNDER CONSTRUCTION
 * Escape a string, making it safe to use in a MySQL query. Based off of PHPs
 * mysql_real_escape_string
 *
 * @param   {string}    content     String to use in the MySQL query
 * @return  {string}    Safe version of the content string parameter
 */
mixins.mysqlEscape = function (content) {
    var replacements = [["\\", "\\\\"], ["\'", "\\\'"], ["\"", "\\\""], ["\n", "\\\n"], ["\r", "\\\r"], ["\x00", "\\\x00"], ["\x1a", "\\\x1a"]];

    var map = {
        "\\": "\\\\",
        "\'": "\\\'",
        "\"": "\\\"",
        "\n": "\\\n",
        "\r": "\\\r",
        "\x00": "\\\x00",
        "\x1a": "\\\x1a"
    };

    return mixins.replace(content, map);

    /*return content
     .replace("\\", "\\\\")
     .replace("\'", "\\\'")
     .replace("\"", "\\\"")
     .replace("\n", "\\\n")
     .replace("\r", "\\\r")
     .replace("\x00", "\\\x00")
     .replace("\x1a", "\\\x1a")
     */
};

__.mixin(mixins);

module.exports = __;