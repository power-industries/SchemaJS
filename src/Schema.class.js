const Assert = require('../lib/Assert.class');

const ParseError = require('./Errors/ParseError.class');
const SchemaError = require('./Errors/SchemaError.class');

const Validator = require('./Validators/Validator.class');

const AnyValidator = require('./Validators/AnyValidator.class');
const BooleanValidator = require('./Validators/BooleanValidator.class');
const NumberValidator = require('./Validators/NumberValidator.class');
const StringValidator = require('./Validators/StringValidator.class');
const ArrayValidator = require('./Validators/ArrayValidator.class');
const ObjectValidator = require('./Validators/ObjectValidator.class');

/**
 * The Main Class of this Library
 */
class Schema {
	/**
	 * Create a new Instance of Schema
	 */
	constructor() {}

	/**
	 * Static Getter for the Validator base class. Can be extended to create custom Validators.
	 * @returns {Validator} - Returns the Validator base class.
	 * @constructor
	 */
	static get Validator() {
		return Validator;
	}

	/**
	 * Static Getter for the SchemaError class.
	 * Can be used in custom Validators for Errors concerning the validity of a Schema.
	 * @returns {SchemaError} - The SchemaError base class. Extended from Error.
	 * @constructor
	 */
	static get SchemaError() {
		return SchemaError;
	}

	/**
	 * Static Getter for the ParseError class.
	 * Can be used in custom Validators for Errors concerning the parsing of Data.
	 * @returns {ParseError} - The ParseError base class. Extended from Error.
	 * @constructor
	 */
	static get ParseError() {
		return ParseError;
	}

	/**
	 * Parse a Schema given in the JSON-compatible-Format to it's corresponding Validators.
	 * @param schema {Object} - The Schema given in a JSON-compatible-Format.
	 * @returns {Validator} - Returns a Type-specific Validator.
	 * @throws {SchemaError} - Throws a SchemaError if schema is not an Object.
	 * @throws {SchemaError} - Throws a SchemaError if schema.type is not a String.
	 * @throws {SchemaError} - Throws a SchemaError if schema.type is not a registered Validator (see setValidator).
	 */
	parseSchema(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type))
			throw new SchemaError('Expected schema.type to be a String');

		if(!this.hasValidator(schema.type))
			throw new SchemaError(`Validator ${schema.type} not found`);

		return new this.getValidator(schema.type)(this, schema);
	}

	/**
	 * Constructor for the default Any-Validator
	 * @returns {AnyValidator}
	 * @constructor
	 */
	Any() {
		return new AnyValidator(this, null);
	}

	/**
	 * Constructor for the default Boolean-Validator
	 * @returns {BooleanValidator}
	 * @constructor
	 */
	Boolean() {
		return new BooleanValidator(this, null);
	}

	/**
	 * Constructor for the default Number-Validator
	 * @returns {NumberValidator}
	 * @constructor
	 */
	Number() {
		return new NumberValidator(this, null);
	}

	/**
	 * Constructor for the default String-Validator
	 * @returns {StringValidator}
	 * @constructor
	 */
	String() {
		return new StringValidator(this, null);
	}

	/**
	 * Constructor for the default Array-Validator
	 * @returns {ArrayValidator}
	 * @constructor
	 */
	Array() {
		return new ArrayValidator(this, null);
	}

	/**
	 * Constructor for the default Object-Validator
	 * @returns {ObjectValidator}
	 * @constructor
	 */
	Object() {
		return new ObjectValidator(this, null);
	}

	/**
	 * Check if this Schema Instance has a Validator with that specific name. Name is case-insensitive
	 * @param name {String}
	 * @returns {Boolean}
	 */
	hasValidator(name) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		return this.#validatorMap.has(name.toLowerCase());
	}

	/**
	 * Get a Validator with a specific name from this Schema Instance
	 * @param name {String}
	 * @returns {Validator}
	 */
	getValidator(name) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		return this.#validatorMap.get(name.toLowerCase());
	}

	/**
	 * Register a Validator to be used with this Instance of Schema
	 * @param name {String}
	 * @param validator {Validator}
	 * @returns {Map<String, Validator>}
	 */
	setValidator(name, validator) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		if(!(validator instanceof Validator.constructor))
			throw new TypeError('Expected validator to be a extended Validator');

		return this.#validatorMap.set(name.toLowerCase(), validator);
	}

	/**
	 * Delete a Validator from this Instance of Schema
	 * @param name {String}
	 * @returns {Boolean}
	 */
	deleteValidator(name) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		return this.#validatorMap.delete(name.toLowerCase());
	}

	#validatorMap = new Map([
		['boolean', BooleanValidator],
		['number', NumberValidator],
		['string', StringValidator],
		['array', ArrayValidator],
		['object', ObjectValidator],
	]);
}

module.exports = Schema;