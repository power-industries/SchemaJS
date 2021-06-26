const Assert = require('../../lib/Assert.class');
const Rule = require('../../lib/Rule.class');

const Validator = require('./Validator.class');

const ParseError = require('../Errors/ParseError.class');
const SchemaError = require('../Errors/SchemaError.class');

const Schema = require('../Schema.class');

class ObjectValidator extends Validator {
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
		if(!Assert.isObject(value))
			throw new SchemaError('Expected value to be an Object');

		this.#defaults.value = value;
		this.#defaults.flag = true;

		return this;
	}
	preserve(value = true) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#preserve.flag = value;
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
	schema(value) {
		if(!Assert.isObject(value))
			throw new SchemaError('Expected value to be an Object');

		this.#schema.value = Object
			.entries(value)
			.map(([key, value]) => {
				if(value instanceof Validator)
					return [key, value];
				else
					return [key, this.#schemaInstance.parseSchema(value)];
			})
			.reduce((obj, [key, value]) => {
				obj[key] = value;
				return obj;
			}, {});
		this.#schema.flag = true;

		return this;
	}

	#fromJSON(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type) || schema.type !== 'object')
			throw new SchemaError('Expected schema.type to be "object"');

		const schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			this.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			this.default(schemaMap.get('default'));

		if(schemaMap.has('preserve'))
			this.preserve(schemaMap.get('preserve'));

		if(schemaMap.has('min'))
			this.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			this.max(schemaMap.get('max'));

		if(schemaMap.has('schema'))
			this.schema(schemaMap.get('schema'));
	}

	toJSON() {
		const result = {
			type: 'object'
		};

		if(this.#required.flag)
			result['required'] = this.#required.flag;

		if(this.#defaults.flag)
			result['default'] = this.#defaults.value;

		if(this.#preserve.flag)
			result['preserve'] = this.#defaults.flag;

		if(this.#min.flag)
			result['min'] = this.#min.value;

		if(this.#max.flag)
			result['max'] = this.#max.value;

		if(this.#schema.flag)
			result['schema'] = Object
				.entries(this.#schema.value)
				.map(([key, validator]) => {
					return [key, validator.toJSON()];
				})
				.reduce((obj, [key, value]) => {
					obj[key] = value;
					return obj;
				}, {});

		return result;
	}

	parseSync(data) {
		try {
			if(Assert.isObject(data)) {
				if(this.#min.flag && Object.keys(data).length < this.#min.value)
					throw new ParseError(`Expected data.length to be larger than or equal to ${this.#min.value}`);

				if(this.#max.flag && Object.keys(data).length > this.#max.value)
					throw new ParseError(`Expected data.length to be smaller than or equal to ${this.#max.value}`);

				if(this.#schema.flag) {
					Object.keys(this.#schema.value).forEach(key => {
						data[key] = this.#schema.value[key].parseSync(data[key]);
					});
				}

				if(!this.#preserve.flag && this.#schema.flag)
					Object.keys(data)
						.filter(key => !Object.keys(this.#schema.value).includes(key))
						.forEach(key => delete data[key]);

				return data;
			}
			else if(Assert.isNull(data)) {
				if(this.#required.flag)
					throw new ParseError('Expected data to be an Object');
				else
					return data;
			}
			else {
				if(this.#required.flag)
					throw new ParseError('Expected data to be an Object')
				else
					throw new ParseError('Expected data to be an Object or Null');
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
	#preserve = new Rule();
	#min = new Rule();
	#max = new Rule();
	#schema = new Rule();
}

module.exports = ObjectValidator;