const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');
const getSchemaType = require('../../Util/getSchemaType');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class NotValidator extends Validator {
	constructor(schema) {
		super();
		this._required = new Rule();
		this._default = new Rule();

		if(!(schema instanceof Validator))
			throw new SchemaError('Expected schema to be a Validator');

		this._schema = new Rule(true, schema);
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
		let result = {type: 'not'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._schema.flag)
			result['schema'] = this._schema.value.toJSON();

		return result;
	}
	static fromJSON(schema, validatorMap) {
		if (getSchemaType(schema) !== 'not')
			throw new SchemaError('Expected schema.type to be "not"');

		let schemaMap = new Map(Object.entries(schema));
		let schemaType = getSchemaType(schemaMap.get('schema'));

		if (!validatorMap.has(schemaType))
			throw new SchemaError('Validator ' + schemaType + ' not found');

		let result = new NotValidator(validatorMap.get(schemaType).fromJSON(schemaMap.get('schema'), validatorMap));

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		return result;
	}

	parseSync(data) {
		try {
			this._schema.value.parseSync(data);
		}
		catch(error) {
			return data;
		}

		if(this._required.flag) {
			if(this._default.flag)
				return this._default.value;
			else
				throw new ParseError('Expected data to be not be parsable');
		}
		else {
			return null;
		}
	}
}

module.exports = NotValidator;