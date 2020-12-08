// Global Libraries
const Type = require('@power-industries/typejs');

// Util Libraries
const getSchemaType = require('../../Util/getSchemaType.function');
const checkValidatorMap = require('../../Util/checkValidatorMap.function');
const Rule = require('../../Util/Rule.function');

// Error Libraries
const SchemaError = require('../../Util/Errors/SchemaError.class');
const ParseError = require('../../Util/Errors/ParseError.class');

// Validator Base Class
const Validator = require('../Validator.class');

class NumberValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._integer = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._equals = new Rule();
	}

	/**
	 * @param value {Boolean}
	 * @returns {NumberValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {Number | Null}
	 * @returns {NumberValidator}
	 */
	default(value) {
		if(!(value instanceof Type.Number || value instanceof Type.Null))
			throw new SchemaError('Expected value to be a Number or Null');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}

	/**
	 * @param value {Boolean}
	 * @returns {NumberValidator}
	 */
	integer(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._integer.flag = true;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {NumberValidator}
	 */
	min(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {NumberValidator}
	 */
	max(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {NumberValidator}
	 */
	equals(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJS() {
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

	/**
	 * @param schema {Object}
	 * @returns {NumberValidator}
	 */
	fromJS(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'number') {
			let schemaMap = new Map(Object.entries(schema));

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

			return this;
		}
		else if (this._validatorMap.has(schemaType))
			return (new this._validatorMap.get(schemaType)(this._validatorMap)).fromJS(schema);
		else
			throw new TypeError('Validator ' + schemaType + ' not found');
	}

	/**
	 * @param data {*}
	 * @returns {*}
	 */
	parseSync(data) {
		try {
			if(!(data instanceof Type.Number))
				if(this._required.flag)
					throw new ParseError('Expected data to be a Number');
				else
					throw new ParseError('Expected data to be a Number or Null');

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
		catch(error) {
			if(data instanceof Type.Null) {
				if(this._required.flag) {
					if (this._default.flag && !(this._default.value instanceof Type.Null))
						return this._default.value;
					else
						throw new ParseError('Expected data not to be Null');
				}
				else
					return data;
			}
			else {
				if(this._default.flag) {
					if(this._required.flag && this._default.value instanceof Type.Null)
						throw error;
					else
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