const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class AnyValidator extends Validator {
	constructor() {
		super();
		this._required = new Rule();
		this._default = new Rule();
	}

	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}
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

	toJSON() {
		let result = {type: 'any'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		return result;
	}
	static fromJSON(schema) {
		let result = new AnyValidator();

		if(!(schema instanceof Type.Object))
			throw new SchemaError('Expected schema to be an Object');

		let schemaMap = new Map(Object.entries(schema));

		if (!schemaMap.has('type'))
			throw new SchemaError('Expected schema.type to be a String');

		if (!(schemaMap.get('type') instanceof Type.String))
			throw new SchemaError('Expected schema.type to be a String');

		if (schemaMap.get('type') !== 'any')
			throw new SchemaError('Expected schema.type to be "any"');

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		return result;
	}

	parseSync(data) {
		if(data instanceof Type.Null ||
			data instanceof Type.Boolean ||
			data instanceof Type.Number ||
			data instanceof Type.String ||
			data instanceof Type.Array ||
			data instanceof Type.Object) {

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new ParseError('Expected data to be of a valid JSON Type');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = AnyValidator;