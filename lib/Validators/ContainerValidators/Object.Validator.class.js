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

class ObjectValidator extends Validator {
	/**
	 * @param validatorMap {Map<String, Validator>}
	 */
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
		this._preserve = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._schema = new Rule();
	}

	/**
	 * @param value {Boolean}
	 * @returns {ObjectValidator}
	 */
	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}

	/**
	 * @param value {Object | Null}
	 * @returns {ObjectValidator}
	 */
	default(value) {
		if(!(value instanceof Type.Object || value instanceof Type.Null))
			throw new SchemaError('Expected value to be an Object or Null');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}

	/**
	 * @param value {Boolean}
	 * @returns {ObjectValidator}
	 */
	preserve(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._preserve.flag = true;

		return this;
	}

	/**
	 * @param value {Number}
	 * @returns {ObjectValidator}
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
	 * @returns {ObjectValidator}
	 */
	max(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}

	/**
	 * @param value {Object<String, Validator>}
	 * @returns {ObjectValidator}
	 */
	schema(value) {
		if(!(value instanceof Type.Object))
			throw new SchemaError('Expected value to be an Object of Validators');

		Object.keys(value).forEach(key => {
			if(!(value[key] instanceof Validator))
				throw new SchemaError('Expected value to be an Object of Validator');
		});

		this._schema.value = value;
		this._schema.flag = true;

		return this;
	}

	/**
	 * @returns {Object}
	 */
	toJSON() {
		let result = {type: 'object'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._preserve.flag)
			result['preserve'] = true;

		if(this._min.flag)
			result['min'] = this._min.value;

		if(this._max.flag)
			result['max'] = this._max.value;

		if(this._schema.flag) {
			let res = {};

			Object.keys(this._schema.value).forEach(key => {
				res[key] = this._schema.value[key].toJSON();
			});

			result['schema'] = res;
		}

		return result;
	}

	/**
	 * @param schema {Object}
	 * @returns {ObjectValidator}
	 */
	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'object') {
			let schemaMap = new Map(Object.entries(schema));

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

			if(schemaMap.has('schema')) {
				if(!(schemaMap.get('schema') instanceof Type.Object))
					throw new SchemaError('Expected schema.schema to be an Object');

				let result = {};

				Object.keys(schemaMap.get('schema')).forEach(key => {
					let schemaType = getSchemaType(schemaMap.get('schema')[key]);

					if(this._validatorMap.has(schemaType))
						result[key] = (new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(schemaMap.get('schema')[key]);
					else
						throw new SchemaError('Validator ' + schemaType + ' not found');
				});

				this.schema(result);
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
			if(!(data instanceof Type.Object))
				throw new ParseError('Expected data to be an Object');

			if(this._min.flag && Object.keys(data).length < this._min.value)
				throw new ParseError('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && Object.keys(data).length > this._max.value)
				throw new ParseError('Expected data.length to be at most ' + this._max.value);

			if(this._schema.flag) {
				Object.keys(this._schema.value).forEach(key => {
					data[key] = this._schema.value[key].parseSync(data[key]);
				});
			}

			if(!this._preserve.flag && this._schema.flag)
				Object.keys(data)
					.filter(key => !Object.keys(this._schema.value).includes(key))
					.forEach(key => delete data[key]);

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

module.exports = ObjectValidator;