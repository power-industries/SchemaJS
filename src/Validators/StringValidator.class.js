const Assert = require('../../lib/Assert.class');
const Rule = require('../../lib/Rule.class');

const Validator = require('./Validator.class');

const ParseError = require('../Errors/ParseError.class');
const SchemaError = require('../Errors/SchemaError.class');

const Schema = require('../Schema.class');

class StringValidator extends Validator {
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
		if(!Assert.isString(value))
			throw new SchemaError('Expected value to be a String');

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
	lowercase(value = true) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#lowercase.flag = value;

		return this;
	}
	uppercase(value = true) {
		if(!Assert.isBoolean(value))
			throw new SchemaError('Expected value to be a Boolean');

		this.#uppercase.flag = value;

		return this;
	}
	contains(value) {
		if(!Assert.isString(value))
			throw new SchemaError('Expected value to be a String');

		this.#contains.value = value;
		this.#contains.flag = true;

		return this;
	}
	matches(value) {
		if(!Assert.isString(value))
			throw new SchemaError('Expected value to be a String');

		try {
			const {pattern, flags} = /^\/?(?<pattern>.*)\/(?<flags>[gimy]*)$/.exec(value).groups;
			this.#matches.value = new RegExp(pattern, flags);
			this.#matches.flag = true;
		}
		catch(regExpError) {
			throw new SchemaError(regExpError.message);
		}

		return this;
	}
	equals(value) {
		if(!Assert.isString(value))
			throw new SchemaError('Expected value to be a String');

		this.#equals.value = value;
		this.#equals.flag = true;

		return this;
	}

	#fromJSON(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type) || schema.type !== 'string')
			throw new SchemaError('Expected schema.type to be "string"');

		const schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			this.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			this.default(schemaMap.get('default'));

		if(schemaMap.has('min'))
			this.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			this.max(schemaMap.get('max'));

		if(schemaMap.has('lowercase'))
			this.lowercase(schemaMap.get('lowercase'));

		if(schemaMap.has('uppercase'))
			this.uppercase(schemaMap.get('uppercase'));

		if(schemaMap.has('contains'))
			this.contains(schemaMap.get('contains'));

		if(schemaMap.has('matches'))
			this.matches(schemaMap.get('matches'));

		if(schemaMap.has('equals'))
			this.equals(schemaMap.get('equals'));
	}
	toJSON() {
		const result = {
			type: 'string'
		};

		if(this.#required.flag)
			result['required'] = this.#required.flag;

		if(this.#defaults.flag)
			result['default'] = this.#defaults.value;

		if(this.#min.flag)
			result['min'] = this.#min.value;

		if(this.#max.flag)
			result['max'] = this.#max.value;

		if(this.#lowercase.flag)
			result['lowercase'] = this.#lowercase.value;

		if(this.#uppercase.flag)
			result['uppercase'] = this.#uppercase.value;

		if(this.#contains.flag)
			result['contains'] = this.#contains.value;

		if(this.#matches.flag)
			result['matches'] = this.#matches.value.toString();

		if(this.#equals.flag)
			result['equals'] = this.#equals.value;

		return result;
	}

	parseSync(data) {
		try {
			if(Assert.isString(data)) {
				if(this.#min.flag && data.length < this.#min.value)
					throw new ParseError(`Expected data.length to be larger than or equal to ${this.#min.value}`);

				if(this.#max.flag && data.length > this.#max.value)
					throw new ParseError(`Expected data.length to be smaller than or equal to ${this.#max.value}`);

				if(this.#lowercase.flag && data.toLowerCase() !== data)
					throw new ParseError('Expected data to be in LowerCase');

				if(this.#uppercase.flag && data.toUpperCase() !== data)
					throw new ParseError('Expected data to be in UpperCase');

				if(this.#contains.flag && data.indexOf(this.#contains.value) === -1)
					throw new ParseError(`Expected data to contain ${this.#contains.value}`);

				if(this.#matches.flag && !this.#matches.value.test(data))
					throw new ParseError(`Expected data to match the RegExp ${this.#matches.value.toString()}`);

				if(this.#equals.flag && data !== this.#equals.value)
					throw new ParseError(`Expected data to equal ${this.#equals.value}`);

				return data;
			}
			else if(Assert.isNull(data)) {
				if(this.#required.flag)
					throw new ParseError('Expected data to be a String');
				else
					return data;
			}
			else {
				if(this.#required.flag)
					throw new ParseError('Expected data to be a String')
				else
					throw new ParseError('Expected data to be a String or Null');
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
	#lowercase = new Rule();
	#uppercase = new Rule();
	#contains = new Rule();
	#matches = new Rule();
	#equals = new Rule();
}

module.exports = StringValidator;