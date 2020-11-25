const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');
const getSchemaType = require('../../Util/getSchemaType');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class ObjectValidator extends Validator {
	constructor() {
		super();

		this._required = new Rule();
		this._default = new Rule();
		this._preserve = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._schema = new Rule();
	}

	required(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._required.flag = value;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.Object))
			throw new SchemaError('Expected value to be an Object');

		this._default.value = value;
		this._default.flag = true;

		return this;
	}
	preserve(value = true) {
		if(!(value instanceof Type.Boolean))
			throw new SchemaError('Expected value to be a Boolean');

		this._preserve.flag = true;

		return this;
	}
	min(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}
	max(value) {
		if(!(value instanceof Type.Number))
			throw new SchemaError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}
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
	static fromJSON(schema, validatorMap) {
		let result = new ObjectValidator();

		if (getSchemaType(schema) !== 'object')
			throw new SchemaError('Expected schema.type to be "object"');

		let schemaMap = new Map(Object.entries(schema));

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		if(schemaMap.has('preserve'))
			result.preserve(schemaMap.get('preserve'));

		if(schemaMap.has('min'))
			result.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			result.max(schemaMap.get('max'));

		if(schemaMap.has('schema')) {
			if(!(schemaMap.get('schema') instanceof Type.Object))
				throw new SchemaError('Expected schema.schema to be an Object');

			let res = {};

			Object.keys(schemaMap.get('schema')).forEach(key => {
				let schemaType = getSchemaType(schemaMap.get('schema')[key]);

				if(validatorMap.has(schemaType))
					res[key] = (validatorMap.get(schemaType).fromJSON(schemaMap.get('schema')[key], validatorMap));
				else
					throw new SchemaError('Validator ' + schemaType + ' not found');
			});

			result.schema(res);
		}

		return result;
	}

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
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw error;
			}
			else {
				return null;
			}
		}
	}
}

module.exports = ObjectValidator;