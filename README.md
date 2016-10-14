## Modules

<dl>
<dt><a href="#module__">_</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#Util">Util</a></dt>
<dd><p>Extra useful Lodash mixins</p>
</dd>
</dl>

<a name="module__"></a>

## _

* [_](#module__)
    * [.parameters](#module__.parameters) ⇒ <code>Mixed</code>
    * [.arguments](#module__.arguments) ⇒ <code>number</code>
    * [.arguments](#module__.arguments) ⇒ <code>number</code>
    * [.utf8Encode(str)](#module__.utf8Encode) ⇒ <code>string</code>
    * [.utf8Decode(str)](#module__.utf8Decode) ⇒ <code>string</code>
    * [.md5(str)](#module__.md5) ⇒ <code>string</code>
    * [.stripCommonRoot(pathArray)](#module__.stripCommonRoot) ⇒ <code>array</code>
    * [.sumPaths(pathArray)](#module__.sumPaths) ⇒ <code>Object</code> &#124; <code>string</code> &#124; <code>array</code>
    * [.valTypes(collection, [filter])](#module__.valTypes) ⇒ <code>array</code>
    * [.sha1(str)](#module__.sha1) ⇒ <code>string</code>
    * [.makeHash(str, salt)](#module__.makeHash) ⇒ <code>string</code>
    * [.randStr(length)](#module__.randStr) ⇒ <code>string</code>
    * [.replaceAt(str, indexndex, character)](#module__.replaceAt) ⇒ <code>string</code>
    * [.getType(item)](#module__.getType) ⇒ <code>string</code>
    * [.multiReplace(str, replacements, modifiers)](#module__.multiReplace) ⇒ <code>string</code>
    * [.swap(obj)](#module__.swap) ⇒ <code>object</code>
    * [.uniqObjs(arr, arr[])](#module__.uniqObjs) ⇒ <code>array</code>
    * [.isNumeric(num)](#module__.isNumeric) ⇒ <code>boolean</code>
    * [.isEmail(email)](#module__.isEmail) ⇒ <code>boolean</code>
    * [.sortMatch(object, source, [customizer])](#module__.sortMatch) ⇒ <code>boolean</code>
    * [.bool(value, trues, [lower])](#module__.bool) ⇒
    * [.endWith(str, endChar)](#module__.endWith) ⇒ <code>string</code>
    * [.dontEndWith(str, endChar)](#module__.dontEndWith) ⇒ <code>string</code>
    * [.startWith(str, startChar)](#module__.startWith) ⇒ <code>string</code>
    * [.dontStartWith(str, startChar)](#module__.dontStartWith) ⇒ <code>string</code>
    * [.nl2br(str, [br])](#module__.nl2br) ⇒ <code>string</code>
    * [.br2nl(str, [nl])](#module__.br2nl) ⇒ <code>string</code>
    * [.censor(word, [masker], [maskType])](#module__.censor) ⇒ <code>string</code>
    * [.passwordHash(password)](#module__.passwordHash) ⇒ <code>string</code>
    * [.passwordVerify(password, passwdHash)](#module__.passwordVerify) ⇒ <code>boolean</code>
    * [.sortObj(obj, comparator)](#module__.sortObj) ⇒ <code>object</code>
    * [.isUniq(collection, [element])](#module__.isUniq) ⇒ <code>boolean</code>
    * [.removeObj(obj, del)](#module__.removeObj) ⇒ <code>object</code>
    * [.mysqlEscape(content)](#module__.mysqlEscape) ⇒ <code>string</code>
    * [.isSnake(str)](#module__.isSnake) ⇒ <code>boolean</code>
    * [.isCamel(str)](#module__.isCamel) ⇒ <code>boolean</code>
    * [.isKebab(str)](#module__.isKebab) ⇒ <code>boolean</code>
    * [.isStart(str)](#module__.isStart) ⇒ <code>boolean</code>
    * [.isLower(str)](#module__.isLower) ⇒ <code>boolean</code>
    * [.isUpper(str)](#module__.isUpper) ⇒ <code>boolean</code>
    * [.getCase(str)](#module__.getCase) ⇒ <code>string</code> &#124; <code>undefined</code>
    * [.isCase(theCase, str)](#module__.isCase) ⇒ <code>boolean</code>
    * [.includesAll(collection, values, fromIndex)](#module__.includesAll) ⇒ <code>boolean</code>
    * [.levenshtein(strA, strB)](#module__.levenshtein) ⇒ <code>number</code>
    * [.strDist(strA, strB)](#module__.strDist) ⇒ <code>number</code>
    * [.plural(str)](#module__.plural) ⇒ <code>string</code>
    * [.mergeObjs([...sources])](#module__.mergeObjs) ⇒ <code>object</code>
    * [.setException(item, [type])](#module__.setException) ⇒ <code>Mixed</code>
    * [.pullSample(arr)](#module__.pullSample) ⇒ <code>Mixed</code>
    * [.pullSampleSize(arr, size)](#module__.pullSampleSize) ⇒ <code>array</code>
    * [.validPattern(pattern, flags, reason)](#module__.validPattern) ⇒ <code>boolean</code> &#124; <code>string</code>
    * [.typeof(value, inspect, returnTypes, flaggedVals)](#module__.typeof) ⇒ <code>string</code>


-

<a name="module__.parameters"></a>

### _.parameters ⇒ <code>Mixed</code>
Alternate through the parameters provided, returning the next one in line every time.

Instructions:
     - Calling alternator() with the SAME parameters will return the next param each time
     - Calling alternator() with NEW parameters will re-initialize the rotation, and return
         the first new parameter listed
     - Calling alternator() with NO parameters will reset the rotation to null, and return nothing

**Kind**: static property of <code>[_](#module__)</code>  
**Returns**: <code>Mixed</code> - Whatever array element is next in line, or nothing when resetting  
**Todo**

- [ ] Create unit tests

**Example**  
```js
for(i = 0; i< 6; i++)
     _.alternator('a','b','c')
     // returns (incrementally) : a, b, c, a, b, c
```

-

<a name="module__.arguments"></a>

### _.arguments ⇒ <code>number</code>
Return the maximum value of all arguments passed. This is the same thing as _.max,
only instead of an array, it takes all the arguments

**Kind**: static property of <code>[_](#module__)</code>  
**Returns**: <code>number</code> - Maximum value, retrieved by _.max()  
**Todo**

- [ ] Create unit tests

**Example**  
```js
_.maxOf( 1, 20, 'a', ['test'], 1000 )
 // => 1000
```

-

<a name="module__.arguments"></a>

### _.arguments ⇒ <code>number</code>
Return the minimum value of all arguments passed. This is the same thing as _.min,
only instead of an array, it takes all the arguments

**Kind**: static property of <code>[_](#module__)</code>  
**Returns**: <code>number</code> - Minimum value, retrieved by _.min()  
**Todo**

- [ ] Create unit tests

**Example**  
```js
_.minOf( 1, 20, 'a', ['test'], 1000 )
 // => 1
```

-

<a name="module__.utf8Encode"></a>

### _.utf8Encode(str) ⇒ <code>string</code>
Encodes an ISO-8859-1 string to UTF-8, this is meant to provide the same functionality
as the PHP utf8_encode function.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - UTF-8 encoded version of the str param value  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | Standard ISO-8859-1 encoded string |

**Example**  
```js
_.utf8Encode('Hello World')
             // => Hello World
```

-

<a name="module__.utf8Decode"></a>

### _.utf8Decode(str) ⇒ <code>string</code>
Decodes a UTF-8 encoded string to the standard ISO-8859-1, this is meant to provide the same functionality
as the PHP utf8_decode function.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - ISO-8859-1 decoded string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | UTF-8 encoded string |

**Example**  
```js
_.utf8Decode('Hello World')
             // => Hello World
```

-

<a name="module__.md5"></a>

### _.md5(str) ⇒ <code>string</code>
Retrieve the md5sum value for a specific string.

This source was taken from the PHP.js project, I take no credit for this code

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - 32 character MD5 sum  
**See**: http://phpjs.org/functions/md5/  
**Author:** Not me (Justin Hyland)  
**Todo**

- [ ] Create unit tests


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to hash |

**Example**  
```js
md5('Hello World') === 'b10a8db164e0754105b7a99be72e3fe5'
```

-

<a name="module__.stripCommonRoot"></a>

### _.stripCommonRoot(pathArray) ⇒ <code>array</code>
Iterate through an array of absolute file paths, removing the common paths from each element. This is useful
for when you don't need to have the entire absolute path in the name.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>array</code> - Modified version of the provided array  

| Param | Type | Description |
| --- | --- | --- |
| pathArray | <code>array</code> | Array of paths.. |

**Example**  
```js
Gizmo.stripCommonRoot([ 
     '/home/jdoe/app/lib/helpers/mongoose-helper.js',
     '/home/jdoe/app/dev/file-foo.js',
     '/home/jdoe/app/dev/some-file.js' 
]).join(', ')
// => /lib/helpers/mongoose-helper.js, /dev/file-foo.js, /dev/some-file.js
```

-

<a name="module__.sumPaths"></a>

### _.sumPaths(pathArray) ⇒ <code>Object</code> &#124; <code>string</code> &#124; <code>array</code>
Iterate through an array of absolute file paths, removing the common paths from each absolute path. The shortened 
filenames are returned in an array, while the common path

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>Object</code> - pathObj         Object containing the common absolute path, and an array of files (with 
                                         paths relative to the common absolute path)<code>string</code> - pathObj.path    The absolute path up to the last common folder that all files share<code>array</code> - pathObj.files   Array of filenames, paths starting where {pathObj.path} left off  

| Param | Type | Description |
| --- | --- | --- |
| pathArray | <code>array</code> | Array of paths.. |

**Example**  
```js
_.sumPaths.summarizePaths([ 
     '/home/jdoe/app/lib/helpers/mongoose-helper.js',
     '/home/jdoe/app/dev/file-foo.js',
     '/home/jdoe/app/dev/some-file.js' 
])
// => { path: '/home/jdoe/app',
         files: [ 
             '/lib/helpers/mongoose-helper.js', '/dev/file-foo.js', '/dev/some-file.js' 
         ] 
     }
```

-

<a name="module__.valTypes"></a>

### _.valTypes(collection, [filter]) ⇒ <code>array</code>
Retrieve the types of values in an array or an object.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>array</code> - Array of types of values in the collection  

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>Object</code> &#124; <code>array</code> | Array or object (collection of data). |
| [filter] | <code>function</code> | Filter the collection using a simple function |

**Example**  
```js
// Example showing how duplicate value types only display the value type once
 _.valTypes([ 
     1, 'Str', false, [], null, new Array(), undefined, {}, 
     new Date(), function(){}, (s => `This is a ${s}`)('str')
 ]).join(', ').join(', ')
 // => number, string, boolean, array, null, undefined, object, date, function
```
**Example**  
```js
// Using Gizmo.valueTypes to verify all parameters are string types
 function onlyAcceptsStringParams( foo, bar, baz, bang ){
     var invalidParamTypes = Gizmo.valTypes( arguments, f => ! _.isString(f) )
     if( invalidParamTypes.length > 0 ) 
         throw new Error( 'Expected ll parameters to be strings - received invalid type(s): ' + invalidParamTypes.join(', ') ) 
 }
```

-

<a name="module__.sha1"></a>

### _.sha1(str) ⇒ <code>string</code>
Calculate the sha1 hash of a specific string. This is the equivalent of PHP's sha1()
function.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - SHA1 hash  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to calculate hash for |

**Example**  
```js
_.sha1('test')
 // => a94a8fe5ccb19ba61c4c0873d391e987982fbbd3
```

-

<a name="module__.makeHash"></a>

### _.makeHash(str, salt) ⇒ <code>string</code>
Generate a hash of a given string, using the provided salt

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - base64 encoded hash  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to hash |
| salt | <code>string</code> | Salt to use for hash |

**Example**  
```js
_.makeHash('superSecretPassword','secret-salt')
 // => ebA3UZET3LDQWzl <cut> TUnV5oRxAvOLsA==
```

-

<a name="module__.randStr"></a>

### _.randStr(length) ⇒ <code>string</code>
Return a randomly generated string - at a specific length

**Kind**: static method of <code>[_](#module__)</code>  
**Todo**

- [ ] Add the ability to specify the 'possible' string characters


| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | Length of the desored string (Default: 20) |

**Example**  
```js
_.randStr( 15 )
 // => gyC8Q9MABoEjGK6
```

-

<a name="module__.replaceAt"></a>

### _.replaceAt(str, indexndex, character) ⇒ <code>string</code>
Substitute specific characters within a string with a specified replacement.
Replacement positions are specified by either a single (numeric) value, or an
array of numeric values

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Parsed/modified version of the provided string  
**Todo**

- [ ] Allow the character parameter to be an array, and use the alternator method to iterate through them while substituting the replacements
- [ ] Allow the index to be a range


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to process |
| indexndex | <code>number</code> &#124; <code>array</code> | Location(s) to be substituted |
| character | <code>string</code> | Character to substitute replacements with |

**Example**  
```js
_.replaceAt( 'baz', 2, 'r')
 // => bar
 _.replaceAt( 'bad-word', [1,2,5,6], '*')
 // => b**-w**d
 _.replaceAt( 'Hello World', [6,7,8,9,10] )
 // => Hello ?????
```

-

<a name="module__.getType"></a>

### _.getType(item) ⇒ <code>string</code>
Return items true type by grabbing the 2nd string content from Object.prototype.toString.call, as opposed to the 
less-specific 'typeof'

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Type of variable  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>\*</code> | Item to retrieve type for |

**Example**  
```js
_.type([])
 // => array
 _.type({})
 // => object
 _.type(() => {})
 // => function
```

-

<a name="module__.multiReplace"></a>

### _.multiReplace(str, replacements, modifiers) ⇒ <code>string</code>
This performs a series of replacements in a string, using the items within
an object/array. Just a quicker/easier way than chaining .replace() over
and over again. The replacements can be an array of arrays, an array of objects,
or an object

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Parsed and modified version of the provided string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to be parsed/returned |
| replacements | <code>object</code> &#124; <code>array</code> | Replacements, with original string as the key, and replacement as                                                   the value |
| modifiers | <code>string</code> | Regex modifiers to use for search (EG: i for case-insensitivity)                                                   'g' (global) is included by default |

**Example**  
```js
_.multiReplace( 'test', { t: 'T'} )
 // => TesT
 _.multiReplace( 'foo', { FOO: 'bar'}, 'i' )
 // => bar
 _.multiReplace( 'Windows XP', [{ windows: 'Linux'}, {xp: 'RHEL'}], 'i' )
 // => Linux RHEL
```

-

<a name="module__.swap"></a>

### _.swap(obj) ⇒ <code>object</code>
Swap the keys and values of a simple plain object

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>object</code> - Returns a version of the original object with the keys and values switched (wherever possible)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | Object to swap values for |

**Example**  
```js
_.swap({a:'b', c:'d'})
 // => {b:'a', d:'c'}
```

-

<a name="module__.uniqObjs"></a>

### _.uniqObjs(arr, arr[]) ⇒ <code>array</code>
Return a new array containing only the unique objects inside the provided
array. Unlike _.uniq, this will check _every_ key/value in the array

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array of structurally identical objects |
| arr[ | <code>object</code> | All values in the provided array need to be objects |

**Example**  
```js
// Remove any duplicate objects
 const objs = [ { x: 1, y: 2 }, { a: 1, b: 2 }, { x: 1, y: 2 }]
 console.log( _( objs ).uniqObjs().value() )
 console.log( _.uniqObjs( objs ) )
 // => [ { x: 1, y: 2 }, { a: 1, b: 2 } ]
```

-

<a name="module__.isNumeric"></a>

### _.isNumeric(num) ⇒ <code>boolean</code>
Check if the provided number is a float or integer value. This just tacks
a 2nd check onto lodashes isNumber, which uses a lenient comparative operator
to check if the value of Number is the same as the provided number

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>string</code> &#124; <code>integer</code> &#124; <code>number</code> | Number to check |

**Example**  
```js
_.isNumber( 123 )  
 _.isNumber( '123' )
 _.isNumber( 1.2 )  
 _.isNumber( '1.2' )
 // => true

 _.isNumber( 'foo' )
 _.isNumber( [] )   
 _.isNumber( {} ) 
 // => false
```

-

<a name="module__.isEmail"></a>

### _.isEmail(email) ⇒ <code>boolean</code>
Validate a string against an RFC822 compliant pattern

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Email address to validate against pattern |

**Example**  
```js
_.isEmail( 'j@linux.com' ) 
 // => true

 _.isEmail( 'j@linux.c' ) 
 _.isEmail( 'jinux.com' ) 
 _.isEmail( null )  
 // => false
```

-

<a name="module__.sortMatch"></a>

### _.sortMatch(object, source, [customizer]) ⇒ <code>boolean</code>
Check if two values match each other. Basically sorts the object and
source, then passes it off to _.isMatch, (Since objects/arrays with
same values in different orders would be considered discrepancies

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>\*</code> | Item A to match to B |
| source | <code>\*</code> | Item B to match to A |
| [customizer] | <code>function</code> | Function to cuztomize the object and src (Just handed of to _.isMatch) |

**Example**  
```js
_.sortMatch( [1,2,3], [3,2,1] )
 // => true
 _.sortMatch( [1,2,'3'], [3,2,1] )
 // => false
```

-

<a name="module__.bool"></a>

### _.bool(value, trues, [lower]) ⇒
Just a boolean comparison tool, Allows you to specify other true-type
variables, as well as convert the value to lower case (Since the string
representations of the boolean values are lower). Also compares integer
values

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: Boolean casted version of the provided value  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>string</code> &#124; <code>boolean</code> &#124; <code>integer</code> |  | Value to compare |
| trues | <code>array</code> &#124; <code>string</code> |  | Any other custom 'true' type variables, an attempt is made                                                           to convert any  value to an array |
| [lower] | <code>boolean</code> | <code>false</code> | Process the values after toLowerCase() is called |

**Example**  
```js
_.bool( true ) === true
 _.bool( 'true' ) === true
 _.bool( 1 ) === true
 _.bool( 'foo', [ 'foo', 'bar' ] ) === true
 _.bool( '1' ) === true
 _.bool( 'false' ) === false
 _.bool( false ) === false
 _.bool( 0 ) === false
 _.bool( '0' ) === false
 _.bool( 'foo', [ 'bar', 'baz' ] ) === false
```

-

<a name="module__.endWith"></a>

### _.endWith(str, endChar) ⇒ <code>string</code>
Ensure a specific string ends with a certain character

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - The string returned will be either the exact same string provided, or ${str + endChar} if 
                         the original string doesn't end with the endChar character  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to parse and modify (if needed) |
| endChar | <code>string</code> | String to check for on the ending, and possibly append |

**Example**  
```js
_.endWith('/User/john.doe/Documents', '/')
 // => /User/john.doe/Documents/
 _.endWith('Something else.', '.')
 // => Something else.
```

-

<a name="module__.dontEndWith"></a>

### _.dontEndWith(str, endChar) ⇒ <code>string</code>
Ensure a specific string DOESN'T end with a certain character

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - The string returned will be either the exact same string provided, or a version of the
                         original string with the value of endChar removed from the end  
**Todo**

- [ ] Should be able to replace an ending str like // with /


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to parse and modify (if needed) |
| endChar | <code>string</code> | String to check for on the ending, and possibly remove |

**Example**  
```js
_.dontEndWith('/v1/resource/name/', '/')
 // => /v1/resource/name
```

-

<a name="module__.startWith"></a>

### _.startWith(str, startChar) ⇒ <code>string</code>
Ensure a specific string starts with a certain character

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - The string returned will be either the exact same string provided, or ${startChar + str} if 
                         the original string doesn't begin with the startChar character  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to parse and modify (if needed) |
| startChar | <code>string</code> | String to check for on the beginning, and possibly append |

**Example**  
```js
_.startWith('Documents/', '~/')
 // => ~/Documents/
 _.startWith('Something else.', '.')
 // => Something else.
 _( 'Using startsWith and endsWith together' )
 .startWith('(')
 .endWith(')')
 .value()
 // => (Using startsWith and endsWith together)
```

-

<a name="module__.dontStartWith"></a>

### _.dontStartWith(str, startChar) ⇒ <code>string</code>
Ensure a specific string DOESN'T start with a certain character

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - The string returned will be either the exact same string provided, or a version of the 
                         original string with the value of startChar removed from the beginning  
**Todo**

- [ ] Should be able to replace an starting str like // with /


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to parse and modify (if needed) |
| startChar | <code>string</code> | String to check for on the beginning, and possibly remove |

**Example**  
```js
_.dontStartWith('.unhide-me', '.')
 // => unhide-me
```

-

<a name="module__.nl2br"></a>

### _.nl2br(str, [br]) ⇒ <code>string</code>
Convert any new-line characters to HTML Line breaks, which can optionally be specified,
but defaults to just </br>. The replaced characters consists of \r\n, \n\r, \n and \r.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Modified version of ${str}, with all new-line characters replaced with an HTML line break  
**Todo**

- [ ] Another parameter to optionally trim the string before line breaks to get rid of first/last
- [ ] Another parameter to keep the \n on the end of the newly added </br> tag


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | String to process and replace any new lines for |
| [br] | <code>string</code> | <code>&quot;&#x27;&lt;/br&gt;&#x27;&quot;</code> | HTML Break (</br> by default) |

**Example**  
```js
_.nl2br("One\r\nTwo\n\rThree\nFour\rFive")
 // => One</br>Two</br>Three</br>Four</br>Five
```

-

<a name="module__.br2nl"></a>

### _.br2nl(str, [nl]) ⇒ <code>string</code>
Complete opposite of the _.nl2br - This replaces any HTML Line breaks with the line return character,
which can optionally be specified, but defaults to just \r\n. The HTML break replaced is </br>, <br>,
</BR> or <BR>

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Modified version of ${str}, with all HTML line breaks replaced with new-line characters  
**Todo**

- [ ] Another parameter to optionally trim the string before line breaks to get rid of first/last
- [ ] Another parameter to keep the \</br> tag on the end of the newly added \n


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | String to process and replace any HTML line breaks for |
| [nl] | <code>string</code> | <code>&quot;&#x27;\\r\\n&#x27;&quot;</code> | New line character (\r\n by default) |

**Example**  
```js
_.nl2br("One<br>Two</br>Three</BR>Four<BR>Five")
 // => One\r\nTwo\r\nThree\r\nFour\r\nFive
```

-

<a name="module__.censor"></a>

### _.censor(word, [masker], [maskType]) ⇒ <code>string</code>
Censor any common profanity words by replacing it with a specified word, or masking all or
some of the characters with a single specified character. The words are kept in the separate
data.js file, and base64 encrypted, as to not store a huge list of profanity on any users
computer. The list of words is actually a list that was downloaded from a TeamSpeak related
website of words to ban:
http://addons.teamspeak.com/directory/addon/miscellaneous-tools/TXT-English-badwords-bans-and-list.html
Note: This only supports the English language, the dirty version

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Parsed and censored version of the provided word  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| word | <code>string</code> |  | Word to censor and parse |
| [masker] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | Single character or full single word |
| [maskType] | <code>string</code> | <code>&quot;&#x27;partial&#x27;&quot;</code> | The masking 'type', can be:                                      full        Entire word                                      single      Single character                                      firstlast   First and last letters                                      middle      All BUT first and last                                      partial     Majority of letters (55% after first letter) |

**Example**  
```js
_.censor('damn')
 // => d**n
```

-

<a name="module__.passwordHash"></a>

### _.passwordHash(password) ⇒ <code>string</code>
Generate a salted hash of a specified password string - Similar to PHPs
password_hash function, which returns a string with the hash AND the salt,
making it easier to store in a database, and easier to verify

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - 109 character password hash (salt is first 20 characters)  
**Note**: Every password hash is generated by using a salt value that is randomly generated every time, this means 
             that the resulting hash will be different every time it executes, even if the passwords are the same  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password to hash |

**Example**  
```js
const pwd1 = _.passwordHash('SomePass')
 // => LIE9OKy0g$eNB <cut> XFMcfx78L5SuZZivA==
 const pwd2 = _.passwordHash('SomePass')
 pwd1 === pwd2
 // => false
```

-

<a name="module__.passwordVerify"></a>

### _.passwordVerify(password, passwdHash) ⇒ <code>boolean</code>
Verify a password against a password hash generated by _.passwordHash

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>boolean</code> - TRUE if the result of a hash generated with the
                         same password and the salt found in passwordHash,
                         matches the hash inside passwordHash  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | Password to verify |
| passwdHash | <code>string</code> | String generated by _.passwordHash |

**Example**  
```js
const hashA = _.passwordHash( 'secret' )
 _.passwordVerify( 'secret', hashA )
 // => true
```

-

<a name="module__.sortObj"></a>

### _.sortObj(obj, comparator) ⇒ <code>object</code>
Return a copy of the object with the content sorted by the keys

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | Object to sort by keys |
| comparator | <code>function</code> | Function to compare/sort the elements |

**Example**  
```js
const obj = {b: 3, c: 2, a: 1}
 console.log( _.sortObj( obj ) )
 console.log( _( obj ).sortObj().value() )

 // => {a: 1, b: 3, c: 2}

 _.sortObj( obj, ( value, key ) => value )
 // => {a: 1, c: 2, b: 3}
```

-

<a name="module__.isUniq"></a>

### _.isUniq(collection, [element]) ⇒ <code>boolean</code>
Validate that an array, or objects in an array, or elements within the
objects in an array are all unique

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>array</code> | Single level array or array of objects |
| [element] | <code>string</code> | If `collection` is an array of objects, and we are to check that a specific                                       element in those objects is unique, then this should be the name of the element                                      in the object |

**Example**  
```js
_.isUniq( [ 1, 2, 3, 2 ] )
 // => false
 _.isUniq( [ {a: 1}, {a: 2}, {a: 1} ] ) 
 // => false
 _.isUniq( [ {a: 1, b: 2}, {a: 2, b: 5}, {a: 1, b: 2} ], 'b')
 // => false
```

-

<a name="module__.removeObj"></a>

### _.removeObj(obj, del) ⇒ <code>object</code>
Remove items from object, mutating the original object by removing specified element(s),
and returning a new object of said element(s)
This is basically the same as lodashes _.remove method, except this works for Objects,
not arrays.

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>object</code> - Object of items removed from obj param  
**Note**: This will mutate the original object, removing the `del` element(s)  
**Todo**

- [ ] Need to add some sanity checking, some more logic, etc etc
- [ ] This should be able to take a function for the del


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | Object (to mutate) |
| del | <code>array</code> &#124; <code>string</code> | Element(s) to remove from obj |

**Example**  
```js
var testObj = { first: 'John', last: 'Doe', middle: 'w', age: 26, height: 75 }
 testObj = _.removeObj( testObj, 'height')
 // => { first: 'John', last: 'Doe', middle: 'w', age: 26 }
 testObj = _.removeObj( testObj, [ 'age','middle' ])
 // => { first: 'John', last: 'Doe' }
```

-

<a name="module__.mysqlEscape"></a>

### _.mysqlEscape(content) ⇒ <code>string</code>
Escape a string, making it safe to use in a MySQL query. Based off of PHPs
mysql_real_escape_string

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Safe version of the content string parameter  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | String to use in the MySQL query |

**Example**  
```js
_.mysqlEscape( "Justin\\\\'s Boots" )
 // => "Justin\\'s Boots"
```

-

<a name="module__.isSnake"></a>

### _.isSnake(str) ⇒ <code>boolean</code>
Check if a specified string is in snake_case format

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>boolean</code> - Returns True if the string is in case snake, False otherwise.  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isSnake( _.snakeCase('Foo Bar') )
 // => true
 _.isSnake( _.camelCase('Foo Bar') )
 // => false
```

-

<a name="module__.isCamel"></a>

### _.isCamel(str) ⇒ <code>boolean</code>
Check if a specified string is in camelCase format

**Kind**: static method of <code>[_](#module__)</code>  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isSnake( _.snakeCase('Foo Bar') )
 // => true
 _.isSnake( _.camelCase('Foo Bar') )
 // => false
```

-

<a name="module__.isKebab"></a>

### _.isKebab(str) ⇒ <code>boolean</code>
Check if a specified string is in kebab-case format

**Kind**: static method of <code>[_](#module__)</code>  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isKebab( _.kebabCase('Foo Bar') )
 // => true
 _.isKebab( _.camelCase('Foo Bar') )
 // => false
```

-

<a name="module__.isStart"></a>

### _.isStart(str) ⇒ <code>boolean</code>
Check if a specified string is in Start Case format

**Kind**: static method of <code>[_](#module__)</code>  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isSnake( _.snakeCase('Foo Bar') )
 // => true
 _.isSnake( _.camelCase('Foo Bar') )
 // => false
```

-

<a name="module__.isLower"></a>

### _.isLower(str) ⇒ <code>boolean</code>
Check if a specified string is in lower case format

**Kind**: static method of <code>[_](#module__)</code>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isLower( _.lowerCase('Foo Bar') )
 // => true
 _.isLower( _.upperCase('Foo Bar') )
 // => false
```

-

<a name="module__.isUpper"></a>

### _.isUpper(str) ⇒ <code>boolean</code>
Check if a specified string is in UPPER CASE format

**Kind**: static method of <code>[_](#module__)</code>  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isUpper( _.upperCase('Foo Bar') )
 // => true
 _.isUpper( _.lowerCase('Foo Bar') )
 // => false
```

-

<a name="module__.getCase"></a>

### _.getCase(str) ⇒ <code>string</code> &#124; <code>undefined</code>
Retrieve the case type of a specified string

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> &#124; <code>undefined</code> - Will return one of: snake, camel, kebab, start, lower, upper or undefined if none  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to inspect |

**Example**  
```js
var str = 'Hello World..'
 _.each()
```

-

<a name="module__.isCase"></a>

### _.isCase(theCase, str) ⇒ <code>boolean</code>
Verify a string is in a specified format.

**Kind**: static method of <code>[_](#module__)</code>  
**Note**: ALPHA PHASE - Under Construction  

| Param | Type | Description |
| --- | --- | --- |
| theCase | <code>string</code> | The case to validate |
| str | <code>string</code> | String to inspect |

**Example**  
```js
_.isCase( 'snake', _.snakeCase( 'Hello World' ) )
 // => true
 _.isCase( 'kebab', _.snakeCase( 'Hello World' ) )
 // => false
```

-

<a name="module__.includesAll"></a>

### _.includesAll(collection, values, fromIndex) ⇒ <code>boolean</code>
Verify that a collection (string, array or object) has all listed values, basically
just an array-friendly version of _.includes

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>boolean</code> - Returns `true` based on the result of _.includes  

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>array</code> &#124; <code>object</code> &#124; <code>string</code> | The collection to search |
| values | <code>mixed</code> | The value or values to search for |
| fromIndex | <code>number</code> | The index to search from. |

**Example**  
```js
_.includesAll( [1,2,3], [1,3] )
 // => true
 _.includesAll( [1,2,3], [1,2], 2 )
 // => false
 _.includesAll( {user: 'fred', age: 40 }, ['fred', 40] )
 // => true
 _.includesAll( 'abcdef', ['a','d] )
 // => true
```

-

<a name="module__.levenshtein"></a>

### _.levenshtein(strA, strB) ⇒ <code>number</code>
Use the Levenshtein formula to calculate the distance in the similarities
of two separate strings, which can be anywhere from 0 (strings are identical)
to the length of the longer string provided (100% different). The higher the
distance, the more different the strings are, but the distance can only be
as high as high as the number of characters in the longer string

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>number</code> - Levenshtein distance value  
**Note**: ALPHA PHASE - Under Construction  
**Todo**

- [ ] Create unit tests


| Param | Type | Description |
| --- | --- | --- |
| strA | <code>string</code> &#124; <code>number</code> | String A |
| strB | <code>string</code> &#124; <code>number</code> | String .... Yep, B |

**Example**  
```js
levenshtein( 'foo','foo' )
 // => 0
 levenshtein( 'foo','bar' ) 
 // => 3
```

-

<a name="module__.strDist"></a>

### _.strDist(strA, strB) ⇒ <code>number</code>
String Difference Distance (In percentages). This basically returns
the Levenshtein value as a percentage

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>number</code> - Levenshtein distance percentage (WITHOUT the % on the end)  
**Todo**

- [ ] Create unit tests


| Param | Type | Description |
| --- | --- | --- |
| strA | <code>string</code> &#124; <code>number</code> | String A |
| strB | <code>string</code> &#124; <code>number</code> | String .... Yep, B |

**Example**  
```js
strDist( 'foo','foo' )
 // => 0
 strDist( 'foo','bar' ) 
 // => 100
 strDist( 'something', 'somewhere' )
 // => 44.44
```

-

<a name="module__.plural"></a>

### _.plural(str) ⇒ <code>string</code>
Return the plural version of a string

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - Plural version of same noun  
**Todo**

- [ ] Create unit tests


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | Singular format of a noun |

**Example**  
```js
_.plural( 'apple' )
 // => apples
 _.plural( 'toy' )
 // => toys
 _.plural( 'fly' )
 // => flies
```

-

<a name="module__.mergeObjs"></a>

### _.mergeObjs([...sources]) ⇒ <code>object</code>
Merge multiple objects together without mutating the original object
This basically just hands everything off to _.merge, just adds an empty object to the beginning, so
     _.merge( {}, ObjsA, ObjsB )
would be the same as
     _.mergeObjs( ObjsA, ObjsB )

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>object</code> - Newly merged object  

| Param | Type | Description |
| --- | --- | --- |
| [...sources] | <code>object</code> | The source objects |

**Example**  
```js
_.mergeObjs( { a: 1 }, { b: 2 }, { c: 3 } )
 // => { a: 1, b: 2, c: 3 }
```

-

<a name="module__.setException"></a>

### _.setException(item, [type]) ⇒ <code>Mixed</code>
Ensures the item is an instance of the exception specified by type

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>Mixed</code> - Returns an instance of Error, or whatevers specified by item  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>Mixed</code> |  | Item/Error/Whatever |
| [type] | <code>Mixed</code> | <code>Error</code> | Exception type (Default: Error) |

**Example**  
```js
let err = 'Error Str'
 // => Error Str
 err = _.setException( err )
 // => [Error: Error Str]
 err = _.setException( err )
 // => [Error: Error Str]
 // Notice no matter how many times its used, Error is not nested, as opposed to setting new Error( err )
```

-

<a name="module__.pullSample"></a>

### _.pullSample(arr) ⇒ <code>Mixed</code>
Pulls a sample from an array - Useful for when iterating over an array (manually), and having to remove the previous
iterations

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>Mixed</code> - Whatever element was sampled from the array  
**Note**: This method mutates the array, just as _.pull does  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array to sample |

**Example**  
```js
var data = [ 100, 200 ]
 _.pullSample( data )  
 // => 200                   
 _.pullSample( data )  
 // => 100           
 _.pullSample( data )
 // => []
```

-

<a name="module__.pullSampleSize"></a>

### _.pullSampleSize(arr, size) ⇒ <code>array</code>
Pulls an array of samples from an array - Basically the same thing as _.pullSample, except this samples multiple
elements, with the amount specified by the size parameter

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>array</code> - Array of one or more elements from arr  
**Note**: This method mutates the array, just as _.pull does  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array to sample |
| size | <code>number</code> | Amount of elements to sample/remove from arr |

**Example**  
```js
var data = [ 100, 200, 300, 400 ]
 _.pullSampleSize( data, 2 )  // [ 100, 200 ]
 _.pullSampleSize( data, 2 )  // [ 300, 400 ]
 _.pullSampleSize( data, 2 )  // [ ]
 data                           // []
```

-

<a name="module__.validPattern"></a>

### _.validPattern(pattern, flags, reason) ⇒ <code>boolean</code> &#124; <code>string</code>
Validation for legitimate regular expression pattern validation

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>boolean</code> &#124; <code>string</code> - If the pattern will work in a regexp check, then true  
**Note**: This is best used when validating strings, as invalid regexp elements will throw an error before this
         function even gets a chance to validate. Meaning something like `_.validPattern(/a/asdf)` will throw an
         exception on the line the invalid pattern was passed  
**Todo**

- [ ] Somehow parse a string for a regex pattern and flags; EG: /foo/g -> ['foo','g']; %bar%i -> ['bar','i']


| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>Mixed</code> | Pattern to validate (String, number, regexp, etc) |
| flags | <code>string</code> | Regular expression flags (Not required) |
| reason | <code>boolean</code> | If pattern is invalid, instead of returning false, return the error (string),                                          which would change the return to `true` = valid, and any string = invalid |


-

<a name="module__.typeof"></a>

### _.typeof(value, inspect, returnTypes, flaggedVals) ⇒ <code>string</code>
Return the type of a specific variable, much like the standard 'typeof', only
with a little more functionality. This is primarily used for input from
libraries/packages/modules that may convert the variable to a different type
when interacting with it. For example, pretty much anything passed through the
URI parameters will be a string, as well as anything passed through GetOpts,
but you may want integers, for example, to actually be identified as numbers, or
true/false/null/undefined strings to be identified as boolean/null/undefined.
That's what the scrutinize parameter does here, it will process the variable
to attempt to identify the type it originally was.

NOTE: If no type is matched, then the toString() value will be returned

**Kind**: static method of <code>[_](#module__)</code>  
**Returns**: <code>string</code> - The variable type; The default type names are:
                         undefined, null, string, boolean, array, element, date, regexp, object, number, function, unknown
                      However, these can be overridden by providing an object as the 3rd parameter  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to process |
| inspect | <code>boolean</code> | Determine if the true value type should be determined through logical                                           processing |
| returnTypes | <code>object</code> | Object of return type strings to overwrite |
| flaggedVals | <code>object</code> | Values used to determine the real value types of flagged values (Only used                                           if scrutinize is enabled) |

**Example**  
```js
_.typeof( [1,2] )       // array
         _.typeof( 'foo' )       // string
         _.typeof( true )        // boolean
         _.typeof( 'true' )      // string
         _.typeof( 'true',true ) // boolean
         _.typeof( null )        // null
         _.typeof( 'null' )      // string
         _.typeof( 'null',true ) // null
```

-

<a name="Util"></a>

## Util
Extra useful Lodash mixins

**Kind**: global constant  
**Requires**: <code>module:lodash,</code>  
**Title**: Lodash Mixins aka moar-lodash  
**Url**: https://www.npmjs.com/package/moar-lodash  
**See**: https://github.com/jhyland87/lodash-mixins  
**Version**: 2.6.1  
**Author:** Justin Hyland (Mostly)  
**Todo**

- [ ] Split all functions into separate .js files; which can all be loaded by loading the index


-

