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

class BooleanValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._equals = new Rule();
	}

	/**
	 * @param value {Boolean}
	 * @returns {BooleanValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {Boolean}
	 * @returns {BooleanValidator}
	 */
	default(value) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}

	/**
	 * @param value {Boolean}
	 * @returns {BooleanValidator}
	 */
	equals(value) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJSON() {
		let result = {type: 'boolean'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._equals.flag)
			result['equals'] = this._equals.value;

		return result;
	}

	/**
	 * @param schema {Object}
	 * @returns {BooleanValidator}
	 */
	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'boolean') {
			let schemaMap = new Map(Object.entries(schema));

			if(schemaMap.has('required'))
				this.required(schemaMap.get('required'));

			if(schemaMap.has('default'))
				this.default(schemaMap.get('default'));

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
			if(!(data instanceof Type.Boolean))
				throw new ParseError('Expected data to be a Boolean');

			if(this._equals.flag && data !== this._equals.value)
				throw new ParseError('Expected data to equal ' + this._equals.value);

			return data;
		}
		catch(error) {
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

module.exports = BooleanValidator;