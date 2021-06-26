const Assert = require('../../lib/Assert.class');
const Rule = require('../../lib/Rule.class');

const Validator = require('./Validator.class');

const ParseError = require('../Errors/ParseError.class');
const SchemaError = require('../Errors/SchemaError.class');

const Schema = require('../Schema.class');

class AnyValidator extends Validator {
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
		this.#defaults.value = value;
		this.#defaults.flag = true;

		return this;
	}

	#fromJSON(schema) {
		if(!Assert.isObject(schema))
			throw new SchemaError('Expected schema to be an Object');

		if(!Assert.isString(schema.type) || schema.type !== 'any')
			throw new SchemaError('Expected schema.type to be "any"');

		const schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			this.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			this.default(schemaMap.get('default'));
	}
	toJSON() {
		const result = {
			type: 'any'
		};

		if(this.#required.flag)
			result['required'] = this.#required.flag;

		if(this.#defaults.flag)
			result['default'] = this.#defaults.value;

		return result;
	}

	parseSync(data) {
		try {
			if(Assert.isNull(data)) {
				if(this.#required.flag)
					throw new ParseError('Expected data to not be Null');
				else
					return data;
			}
			else
				return data;
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
}

module.exports = AnyValidator;