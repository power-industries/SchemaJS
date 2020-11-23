const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class BooleanValidator extends Validator {
	constructor() {
		super();
		this._required = new Rule();
		this._default = new Rule();
		this._equals = new Rule();
	}

	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

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
	static fromJSON(schema) {
		let result = new BooleanValidator();

		if(!(schema instanceof Type.Object))
			throw new SchemaError('Expected schema to be an Object');

		let schemaMap = new Map(Object.entries(schema));

		if (!schemaMap.has('type'))
			throw new SchemaError('Expected schema.type to be a String');

		if (!(schemaMap.get('type') instanceof Type.String))
			throw new SchemaError('Expected schema.type to be a String');

		if (schemaMap.get('type') !== 'boolean')
			throw new SchemaError('Expected schema.type to be "boolean"');

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		if(schemaMap.has('equals'))
			result.equals(schemaMap.get('equals'));

		return result;
	}

	parseSync(data) {
		if(data instanceof Type.Boolean) {
			if(this._equals.flag && data !== this._equals.value)
				throw new ParseError('Expected data to equal ' + this._equals.value);

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new ParseError('Expected data to be a Boolean');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = BooleanValidator;