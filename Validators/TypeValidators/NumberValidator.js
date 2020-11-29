const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');
const getSchemaType = require('../../Util/getSchemaType');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class NumberValidator extends Validator {
	constructor() {
		super();

		this._required = new Rule();
		this._default = new Rule();
		this._integer = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._equals = new Rule();
	}

	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}
	integer(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._integer.flag = true;

		return this;
	}
	min(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}
	max(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	toJSON() {
		let result = {type: 'number'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._integer.flag)
			result['integer'] = true;

		if(this._min.flag)
			result['min'] = this._min.value;

		if(this._max.flag)
			result['max'] = this._max.value;

		if(this._equals.flag)
			result['equals'] = this._equals.value;

		return result;
	}
	static fromJSON(schema) {
		let result = new NumberValidator();

		if (getSchemaType(schema) !== 'number')
			throw new SchemaError('Expected schema.type to be "number"');

		let schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		if(schemaMap.has('integer'))
			result.integer(schemaMap.get('integer'));

		if(schemaMap.has('min'))
			result.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			result.max(schemaMap.get('max'));

		if(schemaMap.has('equals'))
			result.equals(schemaMap.get('equals'));

		return result;
	}

	parseSync(data) {
		try {
			if(!(data instanceof Type.Number))
				throw new ParseError('Expected data to be a Number');

			if(this._integer.flag && !Number.isSafeInteger(data))
				throw new ParseError('Expected data to be an Integer');

			if(this._min.flag && data < this._min.value)
				throw new ParseError('Expected data to be at least ' + this._min.value);

			if(this._max.flag && data > this._max.value)
				throw new ParseError('Expected data to be at most ' + this._max.value);

			if(this._equals.flag && data !== this._equals.value)
				throw new ParseError('Expected data to equal ' + this._equals.value);

			return data;
		}
		catch (error) {
			if(data instanceof Type.Null) {
				if(this._required.flag) {
					if (this._default.flag)
						return this._default.value;
					else
						throw ParseError('Expected data not to be Null');
				}
				else
					return data;
			}
			else {
				if(this._default.flag) {
					return this._default.value;
				}
				else {
					throw error;
				}
			}
		}
	}
}

module.exports = NumberValidator;