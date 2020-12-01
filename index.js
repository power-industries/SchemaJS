// Util Libraries
const getSchemaType = require('./Util/getSchemaType');
const checkValidatorMap = require('./Util/checkValidatorMap');
const Rule = require('./Util/Rule');

// Error Libraries
const SchemaError = require('./Util/Errors/SchemaError');
const ParseError = require('./Util/Errors/ParseError');

// Validator Base Class
const Validator = require('./Validators/Validator.base');

// Primitive Validator Classes
const AnyValidator = require('./Validators/TypeValidators/AnyValidator');
const BooleanValidator = require('./Validators/TypeValidators/BooleanValidator');
const NumberValidator = require('./Validators/TypeValidators/NumberValidator');
const StringValidator = require('./Validators/TypeValidators/StringValidator');

// Container Validator Classes
const ArrayValidator = require('./Validators/ContainerValidators/ArrayValidator');
const ObjectValidator = require('./Validators/ContainerValidators/ObjectValidator');

// Logic Validator Classes
const OrValidator = require('./Validators/LogicalValidators/OrValidator');
const AndValidator = require('./Validators/LogicalValidators/AndValidator');

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

		return (new this._validatorMap.get(schemaType)(this._validatorMap)).fromJSON(schema);
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

	get AnyValidator() {
		return AnyValidator;
	}
	get BooleanValidator() {
		return BooleanValidator;
	}
	get NumberValidator() {
		return NumberValidator;
	}
	get StringValidator() {
		return StringValidator;
	}
	get ArrayValidator() {
		return ArrayValidator;
	}
	get ObjectValidator() {
		return ObjectValidator;
	}

	get OrValidator() {
		return OrValidator;
	}
	get AndValidator() {
		return AndValidator;
	}

	get dev() {
		return {
			Validator: Validator,
			Error: {
				ParseError, SchemaError
			},
			Util: {
				Rule, getSchemaType, checkValidatorMap
			}
		};
	}
}

module.exports = Schema;