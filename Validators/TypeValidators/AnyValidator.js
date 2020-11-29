const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');
const getSchemaType = require('../../Util/getSchemaType');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class AnyValidator extends Validator {
	constructor() {
		super();
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

	static fromJSON(schema) {
		let result = new AnyValidator();

		if (getSchemaType(schema) !== 'any')
			throw new SchemaError('Expected schema.type to be "any"');

		let schemaMap = new Map(Object.entries(schema));

		if (schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if (schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		return result;
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