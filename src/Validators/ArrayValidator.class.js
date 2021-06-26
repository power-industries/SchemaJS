const Assert = require('../../lib/Assert.class');
const Rule = require('../../lib/Rule.class');

const Validator = require('./Validator.class');

const ParseError = require('../Errors/ParseError.class');
const SchemaError = require('../Errors/SchemaError.class');

const Schema = require('../Schema.class');

class ArrayValidator extends Validator {
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
		if(!Assert.isArray(value))
			throw new SchemaError('Expected value to be an Array');

		this.#defaults.value = value;
		this.#defaults.flag = true;

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
	item(value) {
		if(value instanceof Validator) {
			this.#item.value = value;
			this.#item.flag = true;
		}
		else if(Assert.isObject(value)) {
			this.#item.value = this.#schemaInstance.parseSchema(value);
			this.#item.flag = true;
		}
		else
			throw new SchemaError('Expected value to be an Object or an Instance of Validator');

		return this;
	}

	#fromJSON(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type) || schema.type !== 'array')
			throw new SchemaError('Expected schema.type to be "array"');

		const schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			this.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			this.default(schemaMap.get('default'));

		if(schemaMap.has('min'))
			this.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			this.max(schemaMap.get('max'));

		if(schemaMap.has('item'))
			this.item(schemaMap.get('item'));
	}

	toJSON() {
		const result = {
			type: 'array'
		};

		if(this.#required.flag)
			result['required'] = this.#required.flag;

		if(this.#defaults.flag)
			result['default'] = this.#defaults.value;

		if(this.#min.flag)
			result['min'] = this.#min.value;

		if(this.#max.flag)
			result['max'] = this.#max.value;

		if(this.#item.flag)
			result['item'] = this.#item.value.toJSON();

		return result;
	}

	parseSync(data) {
		try {
			if(Assert.isArray(data)) {
				if(this.#min.flag && data.length < this.#min.value)
					throw new ParseError(`Expected data.length to be larger than or equal to ${this.#min.value}`);

				if(this.#max.flag && data.length > this.#max.value)
					throw new ParseError(`Expected data.length to be smaller than or equal to ${this.#max.value}`);

				return  this.#item.flag ? data.map(item => this.#item.value.parseSync(item)) : data;
			}
			else if(Assert.isNull(data)) {
				if(this.#required.flag)
					throw new ParseError('Expected data to be an Array');
				else
					return data;
			}
			else {
				if(this.#required.flag)
					throw new ParseError('Expected data to be an Array')
				else
					throw new ParseError('Expected data to be an Array or Null');
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
	#min = new Rule();
	#max = new Rule();
	#item = new Rule();
}

module.exports = ArrayValidator;