// Global Libraries
const Type = require('@power-industries/typejs');

// Util Libraries
const getSchemaType = require('../../Util/getSchemaType');
const checkValidatorMap = require('../../Util/checkValidatorMap');
const Rule = require('../../Util/Rule');

// Error Libraries
const SchemaError = require('../../Util/Errors/SchemaError');
const ParseError = require('../../Util/Errors/ParseError');

// Validator Base Class
const Validator = require('../Validator.base');

class ArrayValidator extends Validator {
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

	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}
	default(value) {
		if (!(value instanceof Type.Array))
			throw new SchemaError('Expected value to be an Array');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}
	min(value) {
		if (!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}
	max(value) {
		if (!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}
	item(value) {
		if(!(value instanceof Validator))
			throw new SchemaError('Expected value to be a Validator');

		this._item.value = value;
		this._item.flag = true;

		return this;
	}

	toJSON() {
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
	fromJSON(schema) {
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
					this.item((new (this._validatorMap.get(schemaType))(this._validatorMap)).fromJSON(schemaMap.get('item')));
				else
					throw new SchemaError('Validator ' + schemaType + ' not found');
			}

			return this;
		}
		else if (this._validatorMap.has(schemaType))
			return (new (this._validatorMap.get(schemaType))(this._validatorMap)).fromJSON(schema);
		else
			throw new TypeError('Validator ' + schemaType + ' not found');
	}

	parseSync(data) {
		try {
			if(!(data instanceof Type.Array))
				throw new ParseError('Expected data to be an Array');

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

module.exports = ArrayValidator;