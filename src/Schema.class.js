const Assert = require('../lib/Assert.class');

const Validator = require('./Validator.class');

const BooleanValidator = require('./Validators/BooleanValidator.class');
const NumberValidator = require('./Validators/NumberValidator.class');
const StringValidator = require('./Validators/StringValidator.class');
const ArrayValidator = require('./Validators/ArrayValidator.class');
const ObjectValidator = require('./Validators/ObjectValidator.class');

const SchemaError = require('./Errors/SchemaError.class');

class Schema {
	constructor() {
		this.setValidator('boolean', BooleanValidator);
		this.setValidator('number', NumberValidator);
		this.setValidator('string', StringValidator);
		this.setValidator('array', ArrayValidator);
		this.setValidator('object', ObjectValidator);
	}

	static get Validator() {
		return Validator;
	}

	parseSchema(schema) {
		let type = this.getSchemaType(schema);

		if(!this.hasValidator(type))
			throw new ReferenceError(`Validator ${type} not found`);

		return new this.getValidator(type)(this, schema);
	}

	Boolean() {
		if(this.hasValidator('boolean'))
			return new this.getValidator('boolean')(this, null);
		else
			throw new ReferenceError('Validator "boolean" not found');
	}
	Number() {
		if(this.hasValidator('number'))
			return new this.getValidator('number')(this, null);
		else
			throw new ReferenceError('Validator "number" not found');
	}
	String() {
		if(this.hasValidator('string'))
			return new this.getValidator('string')(this, null);
		else
			throw new ReferenceError('Validator "string" not found');
	}
	Array() {
		if(this.hasValidator('array'))
			return new this.getValidator('array')(this, null);
		else
			throw new ReferenceError('Validator "array" not found');
	}
	Object() {
		if(this.hasValidator('object'))
			return new this.getValidator('object')(this, null);
		else
			throw new ReferenceError('Validator "object" not found');
	}

	hasValidator(name) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		return this.#validatorMap.has(name);
	}
	getValidator(name) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		return this.#validatorMap.get(name);
	}
	setValidator(name, validator) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		if(!(validator instanceof Validator.constructor) || validator === Validator)
			throw new TypeError('Expected validator to be an extended class of Validator');

		return this.#validatorMap.set(name, validator);
	}
	deleteValidator(name) {
		if(!Assert.isString(name))
			throw new TypeError('Expected name to be a String');

		return this.#validatorMap.delete(name);
	}

	getSchemaType(schema) {
		if (!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type))
			throw new SchemaError('Expected schema.type to be a String');

		return schema.type.toLowerCase();
	}

	#validatorMap = new Map();
}

module.exports = Schema;