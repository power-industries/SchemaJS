const Assert = require('../../lib/Assert.class');
const Rule = require('../../lib/Rule.class');

const Validator = require('./Validator.class');

const ParseError = require('../Errors/ParseError.class');
const SchemaError = require('../Errors/SchemaError.class');

const Schema = require('../Schema.class');

class BooleanValidator extends Validator {
	constructor(schemaInstance, schema = null) {
		super();

		if(!(schemaInstance instanceof Schema))
			throw new TypeError('Expected schemaInstance to be an Instance of Schema');
		else
			this.#schemaInstance = schemaInstance;

		if(!Assert.isNull(schema))
			this.#fromJSON(schema);
	}

	required(value = true) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#required.flag = value;

		return this;
	}
	default(value) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#defaults.value = value;
		this.#defaults.flag = true;

		return this;
	}
	equals(value) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#equals.value = value;
		this.#equals.flag = true;

		return this;
	}

	#fromJSON(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type) || schema.type !== 'boolean')
			throw new SchemaError('Expected schema.type to be "boolean"');

		const schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			this.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			this.default(schemaMap.get('default'));

		if(schemaMap.has('equals'))
			this.equals(schemaMap.get('equals'));
	}

	toJSON() {
		const result = {
			type: 'boolean'
		};

		if(this.#required.flag)
			result['required'] = this.#required.flag;

		if(this.#defaults.flag)
			result['default'] = this.#defaults.value;

		if(this.#equals.flag)
			result['equals'] = this.#defaults.value;

		return result;
	}

	parseSync(data) {
		try {
			if(Assert.isBoolean(data)) {
				if(this.#equals.flag && data !== this.#equals.value)
					throw new ParseError(`Expected data to equal ${this.#equals.value}`);

				return data;
			}
			else if(Assert.isNull(data)) {
				if(this.#required.flag)
					throw new ParseError('Expected data to be a Boolean');
				else
					return data;
			}
			else {
				if(this.#required.flag)
					throw new ParseError('Expected data to be a Boolean')
				else
					throw new ParseError('Expected data to be a Boolean or Null');
			}
		}
		catch(parseError) {
			if(this.#defaults.flag)
				return this.#defaults.value;
			else
				throw parseError;
		}
	}

	#schemaInstance = null;
	#required = new Rule();
	#defaults = new Rule();
	#equals = new Rule();
}

module.exports = BooleanValidator;