const Validator = require('../../Util/Validator');
const Rule = require('../../Util/Rule');
const Type = require('@power-industries/typejs');
const getSchemaType = require('../../Util/getSchemaType');

const SchemaError = require('../../Util/SchemaError');
const ParseError = require('../../Util/ParseError');

class ArrayValidator extends Validator {
	constructor() {
		super();

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
	static fromJSON(schema, validatorMap) {
		let result = new ArrayValidator();

		if(!(schema instanceof Type.Object))
			throw new SchemaError('Expected schema to be an Object');

		let schemaMap = new Map(Object.entries(schema));

		if (!schemaMap.has('type'))
			throw new SchemaError('Expected schema.type to be a String');

		if (!(schemaMap.get('type') instanceof Type.String))
			throw new SchemaError('Expected schema.type to be a String');

		if (schemaMap.get('type') !== 'array')
			throw new SchemaError('Expected schema.type to be "array"');

		if(schemaMap.has('required'))
			result.required(schemaMap.get('required'));

		if(schemaMap.has('default'))
			result.default(schemaMap.get('default'));

		if(schemaMap.has('min'))
			result.min(schemaMap.get('min'));

		if(schemaMap.has('max'))
			result.max(schemaMap.get('max'));

		if(schemaMap.has('item')) {
			let schemaType = getSchemaType(schemaMap.get('item'));

			if(validatorMap.has(schemaType))
				result.item(validatorMap.get(schemaType).fromJSON(schemaMap.get('item'), validatorMap));
			else
				throw new SchemaError('Validator ' + schemaType + ' not found');
		}

		return result;
	}

	parseSync(data) {
		if(data instanceof Type.Array) {
			if(this._min.flag && data.length < this._min.value)
				throw new ParseError('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && data.length > this._max.value)
				throw new ParseError('Expected data.length to be at most ' + this._max.value);

			if(this._item.flag) {
				let result = [];

				data.forEach(element => {
					result.push(this._item.value.parseSync(element));
				});

				data = result;
			}

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new ParseError('Expected data to be an Array');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = ArrayValidator;