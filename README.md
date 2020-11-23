# SchemaJS

Modern Schema Validation and Parsing using Method Chaining in JavaScript.

For an explanation on what Method Chaining is, please consider reading this article:

[Understanding Method Chaining in JavaScript](https://medium.com/backticks-tildes/understanding-method-chaining-in-javascript-647a9004bd4f)

## Installation

Use the package manager [NPM](https://www.npmjs.com/) to install SchemaJS into your NodeJS Project.

```bash
npm install --save @power-industries/schemajs
```

You can then import the module into your JavaScript File.

```javascript
const Type = require('@power-industries/schemajs');
```

## Usage

### Definition

#### Validator

A Validator is the most basic Building Block of SchemaJS. It is usually based on a specific Datatype. The purpose of a Validator is to combine all Rules and Validation/Parsing Methods into one Namespace.

There are currently 5 Type-Specific Validators (Boolean, Number, String, Array and Object) and 1 General Validator (AnyValidator) available. All Validators are derived from the AnyValidator Validator.

#### Rule

Rules are specific Methods which are changing the behaviour of a Validator. Rules are chainable without exception, which makes them easy to use.

#### Validation/Parsing

Validation/Parsing describes the process of Validating or Parsing data according to the previously defined Validators and Rules.

### Creating a Validator

To create a Validator, SchemaJS provides you with the original Validator Constructors as well as Pseudo-Constructors.

```javascript
// Create a Number Validator with a Pseudo-Constructor (recommended)
Schema.Number();

// Create a Number Validator with the original Constructor (not recommended)
new Schema.Validator.Number();
```

Please note that the `new` keyword is required if using the direct Constructor.

The original Constructors can be used for Instance-checking:

```javascript
const N = Schema.Number();
const O = Schema.Object();

// Check if N is a Number Validator
N instanceof Schema.Validator.Number			// Returns true

// Check if A is a Validator
O instanceof Schema.Validator.AnyValidator   			// Returns true
```

The second example works because ALL Validators are derived from `AnyValidator`.

### Applying Rules

These Rules are grouped by their Validator Type. Please be aware that the Validator `AnyValidator` has special behaviour.

All Rules can be chained, as they return their own Class Instance.

For the sake of simplicity, and because `validate()`, `validateSync()` and `parse()` use the `parseSync()` method internally, all following examples will use the `parseSync()` method for illustration. (See Validation/Parsing)

#### AnyValidator

AnyValidator is a special Validator in that it not only accepts every Datatype, but also is the base Validators, from whom all other Validators are derived.

Usually a Validator only accepts its own Datatype and defaults to `null` if data of another Type is given. `AnyValidator` is different in that it always returns the data, no matter what Datatype it has or what Rules are set.

Please note that although no Rule has influence on the behaviour of `AnyValidator`, the `required` and `default` Rules are defined on this Validator.

```javascript
Schema.AnyValidator()
    .parseSync([1, true, "Hello World"]);

// [Success] Returns [1, true, "Hello World"] (the given data)
```

##### required()

This Rule requires the data to be of the Validators Datatype. If not, the Validation/Parsing Operation will fail.

```javascript
Schema.Number()
    .parseSync("Hello World");

// [Success] Returns null (data is not a Number)

Schema.Number()
    .required()
    .parseSync("Hello World");

// [Failure] Throws Error: Expected data to be a Number
```

##### default()

This Rule allows you to set a Default in case the data is required but not of the Validators Type. It only comes into play if `required()` is set.

```javascript
Schema.Number()
    .default(1)
    .parseSync("Hello World");

// [Success] Returns null (data is not a Number)

Schema.Number()
    .required()
    .default(1)
    .parseSync("Hello World");

// [Success] Returns 1 (the default value)
```

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

This Rule defines a Schema the Object has to follow. AnyValidator key/value pair not in this schema gets removed unless the `preserve()` Rule is set. This Rule takes a parameter `value` which has to be an Object of Validators.

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

### Validation/Parsing

There are 4 Methods available who can be split into 2 Groups: *Validation* and *Parsing*. 

Each of those Groups features 2 Methods - one Synchronous and one Asynchronous. 

Each method can have two outcomes again: Success or Failure.

The table below shows the possible outcomes of *Validation*:

| Validation | `validate(data)`                  | `validateSync(data)` |
| ---------- | --------------------------------- | -------------------- |
| on Success | Promise resolves with `undefined` | returns `true`       |
| on Failure | Promise rejects with `undefined`  | returns `false`      |

The table below shows the possible outcomes of *Parsing*:

| Parsing    | `parse(data)`                                 | `parseSync(data)`                 |
| ---------- | :-------------------------------------------- | --------------------------------- |
| on Success | Promise resolves to `data` or default `value` | Returns `data` or default `value` |
| on Failure | Promise rejects with Error                    | Throws Error                      |

The `validate()` and `validateSync()` Methods are very suitable for decision-making (for example in an IF-Statement). In contrast, the `parse()` and `parseSync()` Methods are more suitable for scrutinizing data, inserting a default value if something is missing and finding Errors in data.

Please note that both Validation Methods (`validate()` and `validateSync()`) as well as the `parse()` method internally use the `parseSync()` method. This makes it easier to implement new Validators if needed, as only a `parseSync()` method has to be defined.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License

Copyright (c) 2020 Power Industries Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.