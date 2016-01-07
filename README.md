### Lodash Mixins
Just some extra functionality I find myself needing in some projects

# _.uniqObjs

Return a new array containing only the unique objects inside the provided array. Unlike _.uniq, this will check _every_ key/value in the array

```javascript
const objs = [ { x: 1, y: 2 }, { a: 1, b: 2 }, { x: 1, y: 2 }]

_( objs ).uniqObjs().value()
_.uniqObjs( objs )

// => [ { x: 1, y: 2 }, { a: 1, b: 2 } ]
```

# _.sortObj

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

# _.isNumber

Check if the provided number is a float or integer value. This just tacks a 2nd check onto lodashes isNumber, which uses a lenient comparative operator to check if the value of parseFloat is the same as the provided number

```javascript
_.isNumber( 123   )
_.isNumber( '123' )
_.isNumber( 1.2   )
_.isNumber( '1.2' )

// => true
```

# _.sortMatch

Check if two values match each other. Basically sorts the object and source, then passes it off to _.isMatch, (Since objects/arrays with same values in different orders would be considered discrepancies

```javascript
_.sortMatch([1,2,3], [3,2,1])

// => true
```

# _.bool

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

# _.typeof

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

If somehow I ended up re-inventing the wheel with one of these, and they already exist.. oops.