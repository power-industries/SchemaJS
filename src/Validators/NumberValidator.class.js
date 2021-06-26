const Assert = require('../../lib/Assert.class');
const Rule = require('../../lib/Rule.class');

const Validator = require('./Validator.class');

const ParseError = require('../Errors/ParseError.class');
const SchemaError = require('../Errors/SchemaError.class');

const Schema = require('../Schema.class');

class NumberValidator extends Validator {
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
		if(!Assert.isNumerical(value))
			throw new SchemaError('Expected value to be a Number');

		this.#defaults.value = value;
		this.#defaults.flag = true;

		return this;
	}
	integer(value = true) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#integer.flag = value;

		return this;
	}
	min(value) {
		if(!Assert.isNumerical(value))
			throw new SchemaError('Expected value to be a Number');

		this.#min.value = value;
		this.#min.flag = true;

		return this;
	}
	max(value) {
		if(!Assert.isNumerical(value))
			throw new SchemaError('Expected value to be a Number');

		this.#max.value = value;
		this.#max.flag = true;

		return this;
	}
	equals(value) {
		if(!Assert.isNumerical(value))
			throw new SchemaError('Expected value to be a Number');

		this.#equals.value = value;
		this.#equals.flag = true;

		return this;
	}

	#fromJSON(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type) || schema.type !== 'number')
			throw new SchemaError('Expected schema.type to be "number"');

		const schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			this.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			this.default(schemaMap.get('default'));

		if(schemaMap.has('integer'))
			this.integer(schemaMap.get('integer'));

		if(schemaMap.has('min'))
			this.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			this.max(schemaMap.get('max'));

		if(schemaMap.has('equals'))
			this.equals(schemaMap.get('equals'));
	}

	toJSON() {
		const result = {
			type: 'number'
		};

		if(this.#required.flag)
			result['required'] = this.#required.flag;

		if(this.#defaults.flag)
			result['default'] = this.#defaults.value;

		if(this.#integer.flag)
			result['integer'] = this.#integer.flag;

		if(this.#min.flag)
			result['min'] = this.#min.value;

		if(this.#max.flag)
			result['max'] = this.#max.value;

		if(this.#equals.flag)
			result['equals'] = this.#defaults.value;

		return result;
	}

	parseSync(data) {
		try {
			if(Assert.isNumerical(data)) {
				if(this.#integer.flag && !Assert.isInteger(data))
					throw new ParseError('Expected data to be an Integer');

				if(this.#min.flag && data < this.#min.value)
					throw new ParseError(`Expected data to be larger than or equal to ${this.#min.value}`);

				if(this.#max.flag && data > this.#max.value)
					throw new ParseError(`Expected data to be smaller than or equal to ${this.#max.value}`);

				if(this.#equals.flag && data !== this.#equals.value)
					throw new ParseError(`Expected data to equal ${this.#equals.value}`);

				return data;
			}
			else if(Assert.isNull(data)) {
				if(this.#required.flag)
					throw new ParseError('Expected data to be a Number');
				else
					return data;
			}
			else {
				if(this.#required.flag)
					throw new ParseError('Expected data to be a Number')
				else
					throw new ParseError('Expected data to be a Number or Null');
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
	#integer = new Rule();
	#min = new Rule();
	#max = new Rule();
	#equals = new Rule();
}

module.exports = NumberValidator;