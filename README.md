# SchemaJS

Modern Schema Validation and Parsing using Method Chaining in JavaScript.

For an explanation on what Method Chaining is, please consider reading this article:

[Understanding Method Chaining in JavaScript](https://medium.com/backticks-tildes/understanding-method-chaining-in-javascript-647a9004bd4f)

## Installation

To install this Module as a dependency, run the following command:

```
npm install --save @power-industries/schemajs
```

To use it in specific Modules, you can include it like this:

```javascript
const Schema = require('@power-industries/schemajs');
```

## Table of Content

[Installation](#Installation)

[Table of Content](#Table of Content)

[Usage](#Usage)
- [Rules](#Rules)
    - [Boolean](#Boolean)
    - [Number](#Number)
    - [String](#String)
    - [Array](#Object)
    - [Object](#Object)

## Usage

SchemaJS allows for Validating and Parsing of JSON data with Validators. SchemaJS currently supports Validators for Booleans, Numbers, Strings, Arrays and Objects.

Validators can be modified in behaviour by Validator rules. These Rules are chainable without exception.

A Validator can both Validate and Parse JSON data, where each of those methods are available as a synchronous and an asynchronous method. All methods can either fail or succeed.

The table below shows the possible outcomes of *Validation*:

|            | `validate(data)`                  | `validateSync(data)` |
| ---------- | --------------------------------- | -------------------- |
| on Success | Promise resolves with `undefined` | returns `true`       |
| on Failure | Promise rejects with `undefined`  | returns `false`      |

The table below shows the possible outcomes of Parsing:

|            | `parse(data)`                                 | `parseSync(data)`                 |
| ---------- | :-------------------------------------------- | --------------------------------- |
| on Success | Promise resolves to `data` or default `value` | Returns `data` or default `value` |
| on Failure | Promise rejects with Error                    | Throws Error                      |

The `validate()` and `validateSync()` methods are very suitable for decision making (for example in an IF-Statement). In contrast, the `parse()` and `parseSync()` methods are more suitable for scrutinizing data, inserting a default value if something is missing and finding Errors.

### Rules

Every Validator has multiple Rules who can change the behaviour of the Validator. Every Rule is chainable without exception. Specific Rules take a Parameter who is called `value` opposed to the Parameter `data` of the Validation and Parsing methods.

The `required()` and `default()` Rules are unique because they are available on every Validator. A Validator usually accepts any `data` and changes the ones not equaling to its Datatype to `null`. To bypass this behaviour the `required()` *Rule* can be set. It changes the default behaviour so that the Validator only accepts its own Datatype.

```javascript
// In this example there is a String given to a Validator with Boolean as its Datatype.
Schema.Boolean()
	.parseSync("Hello World");

// [Success] Returns null (data is not a Boolean)
```

With the `required()` Rule the example above would fail.

```javascript
Schema.Boolean()
	.required()
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data to be a Boolean
```

To further modify this behaviour, the `default()` Rule can be used. If `required()` is set, this Rule can overwrite the Error and return a `value` that has to be of the `Validators` Datatype.

```javascript
Schema.Boolean()
	.required()
	.default(true)
	.parseSync("Hello World");

// [Success] Returns true (the default value)
```

The `default()` Rule has no effect without the `required()` Rule being set.



For the sake of simplicity, the following examples use the `parseSync()` method to illustrate the behaviour.

#### Boolean

This Validator supports only Booleans. If the Datatype of `data` is not a Boolean, it defaults to returning `null`. This behaviour is changeable by the `required()` and `default()` rules.

```javascript
Schema.Boolean()
    .parseSync(false);

// [Success] Returns false (the given data)
```

```javascript
Schema.Boolean()
    .parseSync("Hello World");

// [Success] Returns null (data is not a Boolean)
```

##### equals

This Rule defines a `value` which `data` has to equal. It takes a parameter `value` which has to be a Boolean.

```javascript
Schema.Boolean()
    .equals(false)
    .parseSync(false);

// [Success] Returns false (the given data)
```

```javascript
Schema.Boolean()
    .equals(false)
    .parseSync(true);

// [Failure] Throws Error: Expected data to equal true
```

#### Number

This Validator supports only Numbers. If the Datatype of `data` is not a Number, it defaults to returning `null`. This behaviour is changeable by the `required()` and `default()` rules.

```javascript
Schema.Number()
    .parseSync(123);

// [Success] Returns 123 (the given data)
```

```javascript
Schema.Number()
    .parseSync("Hello World");

// [Success] Returns null (data is not a Number)
```

##### min

This Rule modifies the behaviour of the Validator setting a minimum `value` of what `data` may be. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Number()
	.min(18)
	.parseSync(50);

// [Success] Returns 50 (the given data)
```

```javascript
Schema.Number()
	.min(18)
	.parseSync(5);

// [Failure] Throws Error: Expected data to be at least 18
```

##### max

This Rule modifies the behaviour of the Validator setting a maximum `value` of what `data` may be. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Number()
	.max(18)
	.parseSync(5);

// [Success] Returns 5 (the given data)
```

```javascript
Schema.Number()
	.max(18)
	.parseSync(50);	

// [Failure] Throws Error: Expected data to be at most 18
```

##### integer

This Rule modifies the behaviour of the Validator so that only Integers are allowed as `data`.

```javascript
Schema.Number()
	.integer()
	.parseSync(20);	

// [Success] Returns 20 (the given data)
```

```javascript
Schema.Number()
	.integer()
	.parseSync(20.5);

// [Failure] Throws Error: Expected data to be an Integer
```

##### equals

This Rule defines a `value` which `data` has to equal. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Number()
  .equals(20)
  .parseSync(20);

// [Success] Returns false (the given data)
```

```javascript
Schema.Number()
  .equals(20)
  .parseSync(50);

// [Failure] Throws Error: Expected data to equal 20
```

#### String

This Validator supports only Strings. If the Datatype of `data` is not a String, it defaults to returning `null`. This behaviour is changeable by the `required()` and `default()` rules.

```javascript
Schema.String()
  .parseSync("Hello World");

// [Success] Returns "Hello World" (the given data)
```

```javascript
Schema.String()
  .parseSync(123);

// [Success] Returns null (data is not a String)
```

##### min

This Rule modifies the behaviour of the Validator setting a minimum `value` of what `data` may be. It takes a parameter `value` which has to be a Number.

```javascript
Schema.String()
	.min(5)
	.parseSync("Hello World");

// [Success] Returns "Hello World" (the given data)
```

```javascript
Schema.String()
	.min(20)
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data.length to be at least 20
```

##### max

This Rule modifies the behaviour of the Validator setting a maximum `value` of what `data` may be. It takes a parameter `value` which has to be a Number.

```javascript
Schema.String()
	.max(20)
	.parseSync("Hello World");

// [Success] Returns "Hello World" (the given data)
```

```javascript
Schema.String()
	.max(5)
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data.length to be at most 5
```

##### uppercase

This Rule modifies the behaviour of the Validator so that only uppercase Strings are allowed as `data`. Internally it uses the comparison of `data.toUpperCase() === data` which has to return `true`.

```javascript
Schema.String()
	.uppercase()
	.parseSync("HELLO WORLD");

// [Success] Returns "HELLO WORLD" (the given data)
```

```javascript
Schema.String()
	.uppercase()
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data to be Uppercase
```

##### lowercase

This Rule modifies the behaviour of the Validator so that only lowercase Strings are allowed as `data`. Internally it uses the comparison of `data.toLowerCase() === data` which has to return `true`.

```javascript
Schema.String()
	.lowercase()
	.parseSync("hello world");

// [Success] Returns "hello world" (the given data)
```

```javascript
Schema.String()
	.lowercase()
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data to be Lowercase
```

##### contains

This Rule modifies the behaviour of the Validator so that the given `value` of this Rule has to be a substring of `data`. It takes a parameter `value` which has to be a String.

```javascript
Schema.String()
	.contains("Hello")
	.parseSync("Hello World");

// [Success] Returns "Hello World" (the given data)
```

```javascript
Schema.String()
	.contains("Morning")
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data to contain Morning
```

##### equals

This Rule defines a `value` which `data` has to equal. It takes a parameter `value` which has to be a String.

```javascript
Schema.String()
  .equals("Hello World")
  .parseSync("Hello World");

// [Success] Returns "Hello World" (the given data)
```

```javascript
Schema.String()
  .equals("Hello")
  .parseSync("Hello World");

// [Failure] Throws Error: Expected data to equal "Hello"
```

##### matches

This Rule defines a RegExp which `data` has to match against. It takes a parameter `value` which has to be a RegExp.

```javascript
Schema.String()
	.matches(/^[a-zA-Z]+$/)
	.parseSync("HelloWorld");

// [Success] Returns "HelloWorld" (the given data)
```

```javascript
Schema.String()
	.matches(/^[a-zA-Z]+$/)
	.parseSync("Hello World");

// [Failure] Throws Error: Expected data to match /^[a-zA-Z]+$/
```

#### Array

This Validator supports only Arrays. If the Datatype of `data` is not an Array, it defaults to returning `null`. This behaviour is changeable by the `required()` and `default()` rules.

##### min

This Rule modifies the behaviour of the Validator setting a minimum `value` of elements `data` may have. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Array()
	.min(3)
	.parseSync([1, 2, 3]);

// [Success] Returns [1, 2, 3] (the given data)
```

```javascript
Schema.Array()
	.min(20)
	.parseSync([1, 2, 3]);

// [Failure] Throws Error: Expected data.length to be at least 20
```

##### max

This Rule modifies the behaviour of the Validator setting a maximum `value` of elements `data` may have. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Array()
	.max(20)
	.parseSync([1, 2, 3]);

// [Success] Returns [1, 2, 3] (the given data)
```

```javascript
Schema.Array()
	.max(3)
	.parseSync([1, 2, 3, 4]);

// [Failure] Throws Error: Expected data.length to be at most 3
```

##### item

This Rule defines the allowed type of item an Array may contain. It takes a parameter `value` which has to be a Validator.

```javascript
Schema.Array()
	.item(Schema.Number()
        .required()
        .integer()
        .min(0)
        .max(100)
  )
  .parseSync([1, 2, 3]);

// [Success] Returns [1, 2, 3] (the given data)
```

```javascript
Schema.Array()
	.item(Schema.Number()
        .required()
        .integer()
        .min(0)
        .max(100)
  )
  .parseSync([true, 2, 3]);

// [Failure] Expected data to be a Number
```

#### Object

This Validator supports only Objects. If the Datatype of `data` is not an Object, it defaults to returning `null`. This behaviour is changeable by the `required()` and `default()` rules.

##### min

This Rule modifies the behaviour of the Validator setting a minimum `value` of elements `data` may have. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Object()
	.min(3)
	.parseSync({a: 1, b: 2, c: 3});

// [Success] Returns {a: 1, b: 2, c: 3} (the given data)
```

```javascript
Schema.Object()
	.min(20)
	.parseSync({a: 1, b: 2, c: 3});

// [Failure] Throws Error: Expected data.length to be at least 20
```

##### max

This Rule modifies the behaviour of the Validator setting a maximum `value` of elements `data` may have. It takes a parameter `value` which has to be a Number.

```javascript
Schema.Object()
	.max(20)
	.parseSync({a: 1, b: 2, c: 3});

// [Success] Returns {a: 1, b: 2, c: 3} (the given data)
```

```javascript
Schema.Object()
	.max(3)
	.parseSync({a: 1, b: 2, c: 3});

// [Failure] Throws Error: Expected data.length to be at most 3
```

##### schema

This Rule defines a Schema the Object has to follow. Any key/value pair not in this schema gets removed unless the `preserve()` Rule is set. This Rule takes a parameter `value` which has to be an Object of Validators.

```javascript
Schema.Object()
	.schema({
  	name: Schema.String().required(),
	    age: Schema.Number().required().integer().min(0)
	})
	.parseSync({name: "Max", age: 20, a: 1});

// [Success] Returns {name: "Max", age: 20} (the given data)
```

```javascript
Schema.Object()
	.schema({
  	name: Schema.String().required(),
		age: Schema.Number().required().integer().min(0)
	})
	.parseSync({name: "Max"});

// [Failure] Throws Error: Expected data to be a Number
```

##### preserve

This Rule preserves unspecified keys from the `schema` Rule.

```javascript
Schema.Object()
	.schema({
  	name: Schema.String().required(),
		age: Schema.Number().required().integer().min(0)
	})
	.preserve()
	.parseSync({name: "Max", age: 20, a: 1});

// [Success] Returns {name: "Max", age: 20, a: 1} (the given data)
```

##### instanceof

This Rule checks if the Object is of a specific instance. It takes a parameter `value` which is the Function (Constructor) of the Object.

```javascript
class Test{}

Schema.Object()
	.instanceof(Test)
	.parseSync(new Test());

// [Success] Returns {} (the given data)
```

```javascript
class Test{}

Schema.Object()
	.instanceof(Test)
	.parseSync(new String());

// [Failure] Throws Error: Expected data to be instanceof Test
```