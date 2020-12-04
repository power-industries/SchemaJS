// Util Libraries
const getSchemaType = require('./Util/getSchemaType.function');
const checkValidatorMap = require('./Util/checkValidatorMap.function');
const Rule = require('./Util/Rule.function');

// Error Libraries
const SchemaError = require('./Util/Errors/SchemaError.class');
const ParseError = require('./Util/Errors/ParseError.class');

class Schema {
	/**
	 * @param customValidatorMap {Map<String, module.Validator>}
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
	 * @returns {module.Validator}
	 * @throws {module.SchemaError}
	 */
	fromJSON(schema) {
		const schemaType = getSchemaType(schema);

		if(!this._validatorMap.has(schemaType))
			throw new SchemaError('Validator ' + schemaType + ' not found');

		return (new (this._validatorMap.get(schemaType))(this._validatorMap)).fromJSON(schema);
	}

	/**
	 * @param schema {module.Validator}
	 * @returns {Object}
	 */
	toJSON(schema) {
		return schema.toJSON();
	}

	/**
	 * @returns {module.Any}
	 * @constructor
	 */
	Any() {
		return new Schema.Any(this._validatorMap);
	}

	/**
	 * @returns {module.Boolean}
	 * @constructor
	 */
	Boolean() {
		return new Schema.Boolean(this._validatorMap);
	}

	/**
	 * @returns {module.Number}
	 * @constructor
	 */
	Number() {
		return new Schema.Number(this._validatorMap);
	}

	/**
	 * @returns {module.String}
	 * @constructor
	 */
	String() {
		return new Schema.String(this._validatorMap);
	}

	/**
	 * @returns {module.Array}
	 * @constructor
	 */
	Array() {
		return new Schema.Array(this._validatorMap);
	}

	/**
	 * @returns {module.Object}
	 * @constructor
	 */
	Object() {
		return new Schema.Object(this._validatorMap);
	}

	/**
	 * @returns {module.Or}
	 * @constructor
	 */
	Or() {
		return new Schema.Or(this._validatorMap);
	}

	/**
	 * @returns {module.Any}
	 * @constructor
	 */
	And() {
		return new Schema.Any(this._validatorMap);
	}

	static get Any() {
		return require('./Validators/TypeValidators/Any.Validator.class');
	}
	static get Boolean() {
		return require('./Validators/TypeValidators/Boolean.Validator.class');
	}
	static get Number() {
		return require('./Validators/TypeValidators/Number.Validator.class');
	}
	static get String() {
		return require('./Validators/TypeValidators/String.Validator.class');
	}
	static get Array() {
		return require('./Validators/ContainerValidators/Array.Validator.class');
	}
	static get Object() {
		return require('./Validators/ContainerValidators/Object.Validator.class');
	}
	static get Or() {
		return require('./Validators/LogicalValidators/Or.Validator.class');
	}
	static get And() {
		return require('./Validators/LogicalValidators/And.Validator.class');
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