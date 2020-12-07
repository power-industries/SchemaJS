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

class NotValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._validator = new Rule();
	}

	/**
	 * @param value {Boolean}
	 * @returns {NotValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {*}
	 * @returns {NotValidator}
	 */
	default(value) {
		if(!(value instanceof Type.Null ||
			value instanceof Type.Boolean ||
			value instanceof Type.Number ||
			value instanceof Type.String ||
			value instanceof Type.Array ||
			value instanceof Type.Object))
			throw new SchemaError('Expected value to be a JSON Type');
		this._default.value = value;
		this._default.flag = true;

		return this;
	}

	/**
	 * @param value {Validator}
	 * @returns {NotValidator}
	 */
	validator(value) {
		if(!(value instanceof Validator))
			throw new SchemaError('Expected value to be a Validator');

		this._validator.flag = true;
		this._validator.value = value;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJSON() {
		let result = {type: 'not'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._validator.flag)
			result['validator'] = this._validator.value.toJSON();

		return result;
	}

	/**
	 * @param schema {Object}
	 * @returns {NotValidator}
	 */
	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'not') {
			let schemaMap = new Map(Object.entries(schema));

			if(schemaMap.has('required'))
				this.required(schemaMap.get('required'));

			if(schemaMap.has('default'))
				this.default(schemaMap.get('default'));

			if(schemaMap.has('validator')) {
				let schemaType = getSchemaType(schemaMap.get('validator'));

				if(this._validatorMap.has(schemaType))
					this.validator((new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(schemaMap.get('validator')));
				else
					throw new SchemaError('Validator ' + schemaType + ' not found');
			}

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
			if(this._validator.flag) {
				let result = this._validator.value.validateSync(data);

				if(!result)
					return data;
				else
					throw new ParseError('Expected data to not be parsable by Validator');
			}
			else
				throw new ParseError('No Validator given');
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

module.exports = NotValidator;