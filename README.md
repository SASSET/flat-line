# Lodash Mixins
Just some extra functionality I find myself needing in some projects

* *[_.uniqObjs](https://github.com/jhyland87/lodash-mixins#_uniqobjs)*
* *[_.sortObj](https://github.com/jhyland87/lodash-mixins#_sortobj)*
* *[_.isNumeric](https://github.com/jhyland87/lodash-mixins#_isumeric)*
* *[_.sortMatch](https://github.com/jhyland87/lodash-mixins#_sortmatch)*
* *[_.bool](https://github.com/jhyland87/lodash-mixins#_bool)*
* *[_.typeof](https://github.com/jhyland87/lodash-mixins#_typeof)*
* *[_.utf8Encode](https://github.com/jhyland87/lodash-mixins#_utf8encode)*
* *[_.utf8Decode](https://github.com/jhyland87/lodash-mixins#_utf8decode)*
* *[_.censor](https://github.com/jhyland87/lodash-mixins#_censor)*
* *[_.sha1](https://github.com/jhyland87/lodash-mixins#_sha1)*
* *[_.endWith](https://github.com/jhyland87/lodash-mixins#_endwith)*
* *[_.startWith](https://github.com/jhyland87/lodash-mixins#_startwith)*
* *[_.replace](https://github.com/jhyland87/lodash-mixins#_replace)*
* *[_.replaceAt](https://github.com/jhyland87/lodash-mixins#_replaceat)*
* *[_.type](https://github.com/jhyland87/lodash-mixins#_type)*
* *[_.swap](https://github.com/jhyland87/lodash-mixins#_swap)*
* *[_.nl2br](https://github.com/jhyland87/lodash-mixins#_nl2br)*
* *[_.br2nl](https://github.com/jhyland87/lodash-mixins#_br2nl)*

### _.uniqObjs

Return a new array containing only the unique objects inside the provided array. Unlike _.uniq, this will check _every_ key/value in the array

```javascript
const objs = [ { x: 1, y: 2 }, { a: 1, b: 2 }, { x: 1, y: 2 }]

_( objs ).uniqObjs().value()
_.uniqObjs( objs )

// => [ { x: 1, y: 2 }, { a: 1, b: 2 } ]
```

### _.sortObj

Return a copy of the object with the content sorted by the keys

```javascript
const obj = {b: 3, c: 2, a: 1}

_.sortObj( obj )
_( obj ).sortObj().value()

// => {a: 1, b: 3, c: 2}

_.sortObj(obj, (value, key) => {
	return value
})

// => {a: 1, c: 2, b: 3}
```

### _.isNumeric

Check if the provided number is a float or integer value. This just tacks a 2nd check onto lodashes isNumber, which uses a lenient comparative operator to check if the value of parseFloat is the same as the provided number

```javascript
_.isNumeric( 123   )
_.isNumeric( '123' )
_.isNumeric( 1.2   )
_.isNumeric( '1.2' )

// => true
```

### _.sortMatch

Check if two values match each other. Basically sorts the object and source, then passes it off to _.isMatch, (Since objects/arrays with same values in different orders would be considered discrepancies

```javascript
_.sortMatch([1,2,3], [3,2,1])

// => true
```

### _.bool

Just a boolean comparison tool, Allows you to specify other true-type variables, as well as convert the value to lower case (Since the string representations of the boolean values are lower). Also compares integer values

```javascript
bool( true ) === true
bool( 'true' ) === true
bool( 'false' ) === false
bool( false ) === false
bool( 1 ) === true
bool( '1' ) === true
bool( 0 ) === false
bool( '0' ) === false
bool( 'foo', [ 'foo', 'bar' ] ) === true
bool( 'foo', [ 'bar', 'baz' ] ) === false

// => true
```

### _.typeof

Return the type of a specific variable, much like the standard 'typeof', only with a little more functionality. This is primarily used for input from libraries/packages/modules that may convert the variable to a different type when interacting with it. For example, pretty much anything passed through the URI parameters will be a string, as well as anything passed through GetOpts, but you may want integers, for example, to actually be identified as numbers, or true/false/null/undefined strings to be identified as boolean/null/undefined. That's what the scrutinize parameter does here, it will process the variable to attempt to identify the type it originally was.

```javascript
_.typeof( [1,2] )       // array
_.typeof( 'foo' )       // string
_.typeof( true )        // boolean
_.typeof( 'true' )      // string
_.typeof( 'true',true ) // boolean
_.typeof( null )        // null
_.typeof( 'null' )      // string
_.typeof( 'null',true ) // null
```

### _.utf8Encode

Encodes an ISO-8859-1 string to UTF-8, this is meant to provide the same functionality as the PHP [utf8_encode](http://php.net/manual/en/function.utf8-encode.php) function.

```javascript
_.utf8Encode( 0xD800 ) === '55296'
```

### _.utf8Decode

Decodes a UTF-8 encoded string to the standard ISO-8859-1, this is meant to provide the same functionality as the PHP [utf8_decode](http://php.net/manual/en/function.utf8-decode.php) function.

```javascript
_.utf8Decode('TÃ©lÃ©com') === 'Télécom'
```

### _.censor

Censor any common profanity words by replacing it with a specified word, or masking all or some of the characters with a single specified character. The words are kept in the separate data.js file, and base64 encrypted, as to not store a huge list of profanity on any users computer. The list of words is actually a list that was downloaded from a TeamSpeak related website of words to ban ([here](http://addons.teamspeak.com/directory/addon/miscellaneous-tools/TXT-English-badwords-bans-and-list.html))
 **Note**: This only supports the English language, the dirty version
 **Note**: The content for this method (censored words) are all base64 encoded, meaning you wont have a file with hundreds of naughty words in your dependencies (In case that was bothering you)

 ```javascript
_.censor( 'damn' ) === 'd**n' // Partial censor (default)
_.censor( 'damn', '!' ) === 'd!!n' // Partial with altered mask
_.censor( 'damn', '#', 'full' ) === '####' // Full censor
_.censor( 'damn', '#', 'firstlast' ) === '#am#' // Censor first and last letters
_.censor( 'damn', null, 'middle' ) === 'd**n' // Censor middle characters
_.censor( 'damn', '-censored-' ) === '-censored-' // Censor entire word (If mask is more than a single character)
_.censor( 'damn', '_', 'single' ) === 'd_mn' // Censor single character
```

### _.sha1

Calculate the sha1 hash of a specific string. This is the equivalent of PHP's [sha1](http://php.net/manual/en/function.sha1.php) function.

```javascript
_.sha1( 'Hello World' ) === '0a4d55a8d778e5022fab701977c5d840bbc486d0'
_.sha1('TÃ©lÃ©com') === '1472543473c082833b239fee0f615b284b970519'
```

### _.endWith

Ensure a specific string ends with a certain character

```javascript
_.endWith('/User/john.doe/Documents', '/') === '/User/john.doe/Documents/'
_.endWith('Something else.', '.') === 'Something else.'
```

### _.startWith

Ensure a specific string starts with a certain character

```javascript
_.startWith('Documents/', '~/') === '~/Documents/'
_.startWith('Something else.', '.') === 'Something else.'
_( 'Using startsWith and endsWith together' ).startWith('(').endWith(')').value() === '(Using startsWith and endsWith together)'
```

### _.replace

This performs a series of replacements in a string, using the items within an object/array. Just a quicker/easier way than chaining .replace() over and over again. The replacements can be an array of arrays, an array of objects, or an object

```javascript
_.replace( 'test', { t: 'T'} ) === 'TesT'
_.replace( 'foo', { FOO: 'bar'}, 'i' ) === 'bar'
_.replace( 'Windows XP', [{ windows: 'Linux'}, {xp: 'RHEL'}], 'i' ) === 'Linux RHEL'
```

### _.replaceAt

Substitute specific characters within a string with a specified replacement. Replacement positions are specified by either a single (numeric) value, or an array of numeric values

```javascript
_.replaceAt( 'baz', 2, 'r') === 'bar'
_.replaceAt( 'bad-word', [1,2,5,6], '*') === 'b**-w**d'
_.replaceAt( 'Hello World', [6,7,8,9,10] )=== 'Hello ?????'
```

### _.type

Return items true type by grabbing the 2nd string content from Object.prototype.toString.call, as opposed to the less-specific 'typeof'

```javascript
_.type([]) === 'array'
_.type({}) === 'object'
_.type(() => {}) === 'function'
```

### _.swap

Swap the keys and values of a simple plain object

```javascript
_.swap( { a: 'b', c: 'd'} ) === { b: 'a', d: 'c' }
```

### _.nl2br

Convert any new-line characters to HTML Line breaks, which can optionally be specified, but defaults to just &lt;/br&gt;. The replaced characters consists of \r\n, \n\r, \n and \r.

```javascript
_.nl2br("One\r\nTwo\n\rThree\nFour\rFive") === 'One</br>Two</br>Three</br>Four</br>Five'
 ```

### _.br2nl

Complete opposite of the _.nl2br - This replaces any HTML Line breaks with the line return character, which can optionally be specified, but defaults to just \r\n. The HTML break replaced is &lt;/br&gt;, &lt;br&gt;, &lt;/BR&gt; or &lt;BR&gt;

```javascript
_.nl2br("One<br>Two</br>Three</BR>Four<BR>Five") === 'One\r\nTwo\r\nThree\r\nFour\r\nFive'
 ```


**Note:** If somehow I ended up re-inventing the wheel with one of these, and they already exist.. oops.