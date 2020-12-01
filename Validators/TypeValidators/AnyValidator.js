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

class AnyValidator extends Validator {
	constructor(validatorMap) {
		super();

		checkValidatorMap(validatorMap);
		this._validatorMap = validatorMap;

		this._required = new Rule();
		this._default = new Rule();
	}

	required(value = true) {
		if (!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}
	default(value) {
		if (!(value instanceof Type.Null ||
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

	toJSON() {
		let result = {type: 'any'};

		if (this._required.flag)
			result['require'] = true;

		if (this._default.flag)
			result['default'] = this._default.value;

		return result;
	}
	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(schemaType === 'any') {
			let schemaMap = new Map(Object.entries(schema));

			if (schemaMap.has('required'))
				this.required(schemaMap.get('required'));

			if (schemaMap.has('default'))
				this.default(schemaMap.get('default'));

			return this;
		}
		else if (this._validatorMap.has(schemaType))
			return (new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(schema);
		else
			throw new TypeError('Validator ' + schemaType + ' not found');
	}

	parseSync(data) {
		try {
			if (!(data instanceof Type.Boolean ||
				data instanceof Type.Number ||
				data instanceof Type.String ||
				data instanceof Type.Array ||
				data instanceof Type.Object))
				throw new ParseError('Expected data to be a JSON-compatible Type');

			return data;
		} catch (error) {
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

module.exports = AnyValidator;