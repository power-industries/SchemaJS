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

class ArrayValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._item = new Rule();
	}

	/**
	 * @param value {Boolean}
	 * @returns {ArrayValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {Array | Null}
	 * @returns {ArrayValidator}
	 */
	default(value) {
		if (!(value instanceof Type.Array || value instanceof Type.Null))
			throw new SchemaError('Expected value to be an Array or Null');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {ArrayValidator}
	 */
	min(value) {
		if (!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {ArrayValidator}
	 */
	max(value) {
		if (!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}

	/**
	 * @param value {Validator}
	 * @returns {ArrayValidator}
	 */
	item(value) {
		if(!(value instanceof Validator))
			throw new SchemaError('Expected value to be a Validator');

		this._item.value = value;
		this._item.flag = true;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJS() {
		let result = {type: 'array'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._min.flag)
			result['min'] = this._min.value;

		if(this._max.flag)
			result['max'] = this._max.value;

		if(this._item.flag)
			result['item'] = this._item.value.toJSON();

		return result;
	}

	/**
	 * @param schema {Object}
	 * @returns {ArrayValidator}
	 */
	fromJS(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'array') {
			let schemaMap = new Map(Object.entries(schema));

			if(schemaMap.has('required'))
				this.required(schemaMap.get('required'));

			if(schemaMap.has('default'))
				this.default(schemaMap.get('default'));

			if(schemaMap.has('min'))
				this.min(schemaMap.get('min'));

			if(schemaMap.has('max'))
				this.max(schemaMap.get('max'));

			if(schemaMap.has('item')) {
				let schemaType = getSchemaType(schemaMap.get('item'));

				if(this._validatorMap.has(schemaType))
					this.item((new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(schemaMap.get('item')));
				else
					throw new SchemaError('Validator ' + schemaType + ' not found');
			}

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
			if(!(data instanceof Type.Array))
				if(this._required.flag)
					throw new ParseError('Expected data to be an Array');
				else
					throw new ParseError('Expected data to be an Array or Null');

			if(this._min.flag && data.length < this._min.value)
				throw new ParseError('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && data.length > this._max.value)
				throw new ParseError('Expected data.length to be at most ' + this._max.value);

			if(this._item.flag) {
				let result = [];

				data.forEach(element => {
					result.push(this._item.value.parseSync(element));
				});

				return result;
			}

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

module.exports = ArrayValidator;