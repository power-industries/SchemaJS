const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');
const getSchemaType = require('../../Util/getSchemaType');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class OrValidator extends Validator {
	constructor(validatorArray) {
		super();
		this._required = new Rule();
		this._default = new Rule();
		this._schema = new Rule();

		this.validators(validatorArray);
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
	validators(value) {
		if(!(value instanceof Type.Array))
			throw new SchemaError('Expected value to be an Array');

		value.forEach(validator => {
			if(!(validator instanceof Validator))
				throw new SchemaError('Expected schema to be an Array of Validators');
		});

		this._schema.flag = true;
		this._schema.value = value;

		return this;
	}

	toJSON() {
		let result = {type: 'or'};

		if(this._required.flag)
			result['require'] = true;

		if(this._default.flag)
			result['default'] = this._default.value;

		if(this._schema.flag)
			result['schema'] = this._schema.value.map(validator => validator.toJSON());

		return result;
	}
	static fromJSON(schema, validatorMap) {
		let result = new OrValidator();

		if (getSchemaType(schema) !== 'or')
			throw new SchemaError('Expected schema.type to be "or"');

		let schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('schema')) {
			if(!(schemaMap.get('schema') instanceof Type.Array))
				throw new SchemaError('Expected schema.schema to be an Array');

			result.validators(schemaMap.get('schema').map(schema => {
				let schemaType = getSchemaType(schema);

				if (!validatorMap.has(schemaType))
					throw new SchemaError('Validator ' + schemaType + ' not found');

				return validatorMap.get(schemaType).fromJSON(schema, validatorMap);
			}));
		}

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		return result;
	}

	parseSync(data) {
		for(let i = 0; i < this._schema.value.length; i++) {
			try {
				return this._schema.value[i].parseSync(data);
			}
			catch (ignore) {}
		}

		if(this._required.flag) {
			if(this._default.flag)
				return this._default.value;
			else
				throw new ParseError('Expected data to be parsable by one Validator');
		}
		else {
			return null;
		}
	}
}

module.exports = OrValidator;