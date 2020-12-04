// Util Libraries
const getSchemaType = require('./Util/getSchemaType.function');
const checkValidatorMap = require('./Util/checkValidatorMap.function');
const Rule = require('./Util/Rule.function');

// Error Libraries
const SchemaError = require('./Util/Errors/SchemaError.class');
const ParseError = require('./Util/Errors/ParseError.class');

// Validator Base Class
const Validator = require('./Validators/Validator.class');

// Primitive Validator Classes
const AnyValidator = require('./Validators/TypeValidators/AnyValidator.class');
const BooleanValidator = require('./Validators/TypeValidators/BooleanValidator.class');
const NumberValidator = require('./Validators/TypeValidators/NumberValidator.class');
const StringValidator = require('./Validators/TypeValidators/StringValidator.class');

// Container Validator Classes
const ArrayValidator = require('./Validators/ContainerValidators/ArrayValidator.class');
const ObjectValidator = require('./Validators/ContainerValidators/ObjectValidator.class');

// Logic Validator Classes
const OrValidator = require('./Validators/LogicalValidators/OrValidator.class');
const AndValidator = require('./Validators/LogicalValidators/AndValidator.class');

class Schema {
	constructor(customValidatorMap = new Map()) {
		checkValidatorMap(customValidatorMap);

		this._validatorMap = new Map([
			['any', AnyValidator],
			['boolean', BooleanValidator],
			['number', NumberValidator],
			['string', StringValidator],
			['array', ArrayValidator],
			['object', ObjectValidator],
			['or', OrValidator],
			['and', AndValidator],
			...customValidatorMap
		]);
	}

	fromJSON(schema) {
		const schemaType = getSchemaType(schema);

		if(!this._validatorMap.has(schemaType))
			throw new TypeError('Validator ' + schemaType + ' not found');

		return (new (this._validatorMap.get(schemaType))(this._validatorMap)).fromJSON(schema);
	}
	toJSON(schema) {
		return schema.toJSON();
	}

	Any() {
		return new AnyValidator(this._validatorMap);
	}
	Boolean() {
		return new BooleanValidator(this._validatorMap);
	}
	Number() {
		return new NumberValidator(this._validatorMap);
	}
	String() {
		return new StringValidator(this._validatorMap);
	}
	Array() {
		return new ArrayValidator(this._validatorMap);
	}
	Object() {
		return new ObjectValidator(this._validatorMap);
	}
	Or() {
		return new OrValidator(this._validatorMap);
	}
	And() {
		return new AndValidator(this._validatorMap);
	}

	static get Any() {
		return AnyValidator;
	}
	static get Boolean() {
		return BooleanValidator;
	}
	static get Number() {
		return NumberValidator;
	}
	static get String() {
		return StringValidator;
	}
	static get Array() {
		return ArrayValidator;
	}
	static get Object() {
		return ObjectValidator;
	}
	static get Or() {
		return OrValidator;
	}
	static get And() {
		return AndValidator;
	}
	static get Validator() {
		return Validator;
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