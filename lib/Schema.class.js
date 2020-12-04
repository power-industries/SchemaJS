// Util Libraries
const getSchemaType = require('./Util/getSchemaType.function');
const checkValidatorMap = require('./Util/checkValidatorMap.function');
const Rule = require('./Util/Rule.function');

// Error Libraries
const SchemaError = require('./Util/Errors/SchemaError.class');
const ParseError = require('./Util/Errors/ParseError.class');

class Schema {
	constructor(customValidatorMap = new Map()) {
		checkValidatorMap(customValidatorMap);

		this._validatorMap = new Map([
			['any', Schema.Any],
			['boolean', Schema.Boolean],
			['number', Schema.Number],
			['string', Schema.String],
			['array', Schema.Array],
			['object', Schema.Object],
			['or', Schema.Or],
			['and', Schema.And],
			...customValidatorMap
		]);
	}

	fromJSON(schema) {
		const schemaType = getSchemaType(schema);

		if(!this._validatorMap.has(schemaType))
			throw new SchemaError('Validator ' + schemaType + ' not found');

		return (new (this._validatorMap.get(schemaType))(this._validatorMap)).fromJSON(schema);
	}
	toJSON(schema) {
		return schema.toJSON();
	}

	Any() {
		return new Schema.Any(this._validatorMap);
	}
	Boolean() {
		return new Schema.Boolean(this._validatorMap);
	}
	Number() {
		return new Schema.Number(this._validatorMap);
	}
	String() {
		return new Schema.String(this._validatorMap);
	}
	Array() {
		return new Schema.Array(this._validatorMap);
	}
	Object() {
		return new Schema.Object(this._validatorMap);
	}
	Or() {
		return new Schema.Or(this._validatorMap);
	}
	And() {
		return new Schema.Any(this._validatorMap);
	}

	static get Any() {
		return require('./Validators/TypeValidators/AnyValidator.class');
	}
	static get Boolean() {
		return require('./Validators/TypeValidators/BooleanValidator.class');
	}
	static get Number() {
		return require('./Validators/TypeValidators/NumberValidator.class');
	}
	static get String() {
		return require('./Validators/TypeValidators/StringValidator.class');
	}
	static get Array() {
		return require('./Validators/ContainerValidators/ArrayValidator.class');
	}
	static get Object() {
		return require('./Validators/ContainerValidators/ObjectValidator.class');
	}
	static get Or() {
		return require('./Validators/LogicalValidators/OrValidator.class');
	}
	static get And() {
		return require('./Validators/LogicalValidators/AndValidator.class');
	}
	static get Validator() {
		return require('./Validators/Validator.class');
	}
	static get Util() {
		return {
			Error: {ParseError, SchemaError},
			Rule,
			getSchemaType,
			checkValidatorMap
		}
	}

	get Schema() {
		return Schema;
	}
}

module.exports = Schema;