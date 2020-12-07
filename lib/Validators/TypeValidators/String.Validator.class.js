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

class StringValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._uppercase = new Rule();
		this._lowercase = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._contains = new Rule();
		this._matches = new Rule();
		this._equals = new Rule();
	}

	/**
	 * @param value {Boolean}
	 * @returns {StringValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {String}
	 * @returns {StringValidator}
	 */
	default(value) {
		if(!(value instanceof Type.String))
			throw new SchemaError('Expected value to be a String');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}

	/**
	 * @param value {Boolean}
	 * @returns {StringValidator}
	 */
	uppercase(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._uppercase.flag = value;

		return this;
	}

	/**
	 * @param value {Boolean}
	 * @returns {StringValidator}
	 */
	lowercase(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._lowercase.flag = value;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {StringValidator}
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
	 * @returns {StringValidator}
	 */
	max(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}

	/**
	 * @param value {String}
	 * @returns {StringValidator}
	 */
	contains(value) {
		if(!(value instanceof Type.String))
			throw new SchemaError('Expected value to be a String');

		this._contains.value = value;
		this._contains.flag = true;

		return this;
	}

	/**
	 * @param value {RegExp}
	 * @returns {StringValidator}
	 */
	matches(value) {
		if(!(value instanceof RegExp))
			throw new SchemaError('Expected value to be a RegExp');

		this._matches.value = value;
		this._matches.flag = true;

		return this;
	}

	/**
	 * @param value {String}
	 * @returns {StringValidator}
	 */
	equals(value) {
		if(!(value instanceof Type.String))
			throw new SchemaError('Expected value to be a String');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJSON() {
		let result = {type: 'string'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._uppercase.flag)
			result['uppercase'] = true;

		if(this._lowercase.flag)
			result['lowercase'] = true;

		if(this._min.flag)
			result['min'] = this._min.value;

		if(this._max.flag)
			result['max'] = this._max.value;

		if(this._contains.flag)
			result['contains'] = this._contains.value;

		if(this._matches.flag)
			result['matches'] = this._matches.value.toString();

		if(this._equals.flag)
			result['equals'] = this._equals.value;

		return result;
	}

	/**
	 * @param schema {Object}
	 * @returns {StringValidator}
	 */
	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'string') {
			let schemaMap = new Map(Object.entries(schema));

			if(schemaMap.has('required'))
				this.required(schemaMap.get('required'));

			if(schemaMap.has('default'))
				this.default(schemaMap.get('default'));

			if(schemaMap.has('uppercase'))
				this.uppercase(schemaMap.get('uppercase'));

			if(schemaMap.has('lowercase'))
				this.lowercase(schemaMap.get('lowercase'));

			if(schemaMap.has('min'))
				this.min(schemaMap.get('min'));

			if(schemaMap.has('max'))
				this.max(schemaMap.get('max'));

			if(schemaMap.has('contains'))
				this.contains(schemaMap.get('contains'));

			if(schemaMap.has('matches')) {
				if(!(schemaMap.get('matches') instanceof Type.String))
					throw new SchemaError('Expected schema.matches to be a String');

				let result = new RegExp(/\/(.*)\/(.*)/).exec(schemaMap.get('matches'));

				this.matches(new RegExp(result[1], result[2]));
			}

			if(schemaMap.has('equals'))
				this.equals(schemaMap.get('equals'));

			return this;
		}
		else if (this._validatorMap.has(schemaType))
			return (new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(schema);
		else
			throw new TypeError('Validator ' + schemaType + ' not found');
	}

	/**
	 * @param data {*}
	 * @returns {*}
	 */
	parseSync(data) {
		try {
			if(!(data instanceof Type.String))
				throw new ParseError('Expected data to be a String');

			if(this._uppercase.flag && data.toUpperCase() !== data)
				throw new ParseError('Expected data to be an Uppercase String');

			if(this._lowercase.flag && data.toLowerCase() !== data)
				throw new ParseError('Expected data to be an Lowercase String');

			if(this._min.flag && data.length < this._min.value)
				throw new ParseError('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && data.length > this._max.value)
				throw new ParseError('Expected data.length to be at most ' + this._max.value);

			if(this._contains.flag && !data.includes(this._contains.value))
				throw new ParseError('Expected data to contain ' + this._contains.value);

			if(this._matches.flag && !this._matches.value.test(data))
				throw new ParseError('Expected data to match the regex ' + this._matches.value.toString());

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

module.exports = StringValidator;