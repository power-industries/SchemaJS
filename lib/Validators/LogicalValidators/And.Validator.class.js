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

class AndValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._validatorArray = new Rule(true, []);
	}

	/**
	 * @param value {Boolean}
	 * @returns {AndValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {*}
	 * @returns {AndValidator}
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
	 * @param value {Array<Validator>}
	 * @returns {AndValidator}
	 */
	validators(value) {
		if(!(value instanceof Type.Array))
			throw new SchemaError('Expected value to be an Array');

		value.forEach(validator => {
			if(!(validator instanceof Validator))
				throw new SchemaError('Expected schema to be an Array of Validators');
		});

		this._validatorArray.flag = true;
		this._validatorArray.value = value;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJSON() {
		let result = {type: 'and'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._validatorArray.flag)
			result['validators'] = this._validatorArray.value.map(validator => validator.toJSON());

		return result;
	}

	/**
	 * @param schema {Object}
	 * @returns {AndValidator}
	 */
	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'and') {
			let schemaMap = new Map(Object.entries(schema));

			if(schemaMap.has('required'))
				this.required(schemaMap.get('required'));

			if(schemaMap.has('default'))
				this.default(schemaMap.get('default'));

			if(schemaMap.has('validators')) {
				if(!(schemaMap.get('validators') instanceof Type.Array))
					throw new SchemaError('Expected schema.validators to be an Array');

				this.validators(schemaMap.get('validators').map(validator => {
					let schemaType = getSchemaType(validator);

					if (!this._validatorMap.has(schemaType))
						throw new SchemaError('Validator ' + schemaType + ' not found');

					return (new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(validator);
				}));
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
			let result = this._validatorArray.value.reduce((accumulator, validator) => {
				accumulator &= validator.validateSync(data);
				return accumulator;
			}, true)

			if(result)
				return data;
			else
				throw new ParseError('Expected data to be parsable by every Validator');
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

module.exports = AndValidator;