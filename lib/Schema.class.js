// Util Libraries
const getSchemaType = require('./Util/getSchemaType.function');
const checkValidatorMap = require('./Util/checkValidatorMap.function');
const Rule = require('./Util/Rule.function');

// Error Libraries
const SchemaError = require('./Util/Errors/SchemaError.class');
const ParseError = require('./Util/Errors/ParseError.class');

class Schema {
	/**
	 * @param customValidatorMap {Map<String, Validator>}
	 */
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

	/**
	 * @param schema {Object}
	 * @returns {Validator}
	 */
	fromJSON(schema) {
		const schemaType = getSchemaType(schema);

		if(!this._validatorMap.has(schemaType))
			throw new SchemaError('Validator ' + schemaType + ' not found');

		return (new (this._validatorMap.get(schemaType))(this._validatorMap)).fromJSON(schema);
	}

	/**
	 * @param schema {Validator}
	 * @returns {Object}
	 */
	toJSON(schema) {
		return schema.toJSON();
	}

	/**
	 * @returns {AnyValidator}
	 * @constructor
	 */
	Any() {
		return new Schema.Any(this._validatorMap);
	}

	/**
	 * @returns {BooleanValidator}
	 * @constructor
	 */
	Boolean() {
		return new Schema.Boolean(this._validatorMap);
	}

	/**
	 * @returns {NumberValidator}
	 * @constructor
	 */
	Number() {
		return new Schema.Number(this._validatorMap);
	}

	/**
	 * @returns {StringValidator}
	 * @constructor
	 */
	String() {
		return new Schema.String(this._validatorMap);
	}

	/**
	 * @returns {ArrayValidator}
	 * @constructor
	 */
	Array() {
		return new Schema.Array(this._validatorMap);
	}

	/**
	 * @returns {ObjectValidator}
	 * @constructor
	 */
	Object() {
		return new Schema.Object(this._validatorMap);
	}

	/**
	 * @returns {OrValidator}
	 * @constructor
	 */
	Or() {
		return new Schema.Or(this._validatorMap);
	}

	/**
	 * @returns {AndValidator}
	 * @constructor
	 */
	And() {
		return new Schema.Any(this._validatorMap);
	}

	/**
	 * @returns {AnyValidator}
	 */
	static get Any() {
		return require('./Validators/TypeValidators/Any.Validator.class');
	}

	/**
	 * @returns {BooleanValidator}
	 */
	static get Boolean() {
		return require('./Validators/TypeValidators/Boolean.Validator.class');
	}

	/**
	 * @returns {NumberValidator}
	 */
	static get Number() {
		return require('./Validators/TypeValidators/Number.Validator.class');
	}

	/**
	 * @returns {StringValidator}
	 */
	static get String() {
		return require('./Validators/TypeValidators/String.Validator.class');
	}

	/**
	 * @returns {ArrayValidator}
	 */
	static get Array() {
		return require('./Validators/ContainerValidators/Array.Validator.class');
	}

	/**
	 * @returns {ObjectValidator}
	 */
	static get Object() {
		return require('./Validators/ContainerValidators/Object.Validator.class');
	}

	/**
	 * @returns {OrValidator}
	 */
	static get Or() {
		return require('./Validators/LogicalValidators/Or.Validator.class');
	}

	/**
	 * @returns {AndValidator}
	 */
	static get And() {
		return require('./Validators/LogicalValidators/And.Validator.class');
	}

	/**
	 * @returns {Validator}
	 */
	static get Validator() {
		return require('./Validators/Validator.class');
	}

	/**
	 * @returns {Object}
	 */
	static get Util() {
		return {
			Error: {ParseError, SchemaError},
			Rule,
			getSchemaType,
			checkValidatorMap
		}
	}

	/**
	 * @returns {Schema}
	 */
	get Schema() {
		return Schema;
	}
}

module.exports = Schema;