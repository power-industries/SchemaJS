const Type = require('@power-industries/typejs');
const getSchemaType = require('./Util/getSchemaType');

const Validator = require('./Util/Validator');

const AnyValidator = require('./Validators/TypeValidators/AnyValidator');
const BooleanValidator = require('./Validators/TypeValidators/BooleanValidator');
const NumberValidator = require('./Validators/TypeValidators/NumberValidator');
const StringValidator = require('./Validators/TypeValidators/StringValidator');
const ArrayValidator = require('./Validators/TypeValidators/ArrayValidator');
const ObjectValidator = require('./Validators/TypeValidators/ObjectValidator');

const OrValidator = require('./Validators/LogicalValidators/OrValidator');
const AndValidator = require('./Validators/LogicalValidators/AndValidator');

class Schema {
	constructor(schema, customValidatorMap = new Map()) {
		if(!(customValidatorMap instanceof Map))
			throw new TypeError('Expected customValidatorMap to be a Map');

		customValidatorMap.forEach((value, key) => {
			if(!(key instanceof Type.String && value.prototype instanceof Validator))
				throw new TypeError('Expected customValidatorMap to be a Map of Strings and Validators');
		});

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

		if(schema instanceof Validator)
			this._schema = schema;
		else if(schema instanceof Type.Object)
			this.fromJSON(schema);
		else
			throw new TypeError('Expected schema to be a JSON Schema or a Validator');
	}

	fromJSON(schema) {
		let schemaType = getSchemaType(schema);

		if(!this._validatorMap.has(schemaType))
			throw new TypeError('Validator ' + schemaType + ' not found');

		this._schema = this._validatorMap.get(schemaType).fromJSON(schema, this._validatorMap);
	}
	toJSON() {
		return this._schema.toJSON();
	}

	validate(data) {
		return new Promise((resolve, reject) => {
			if(this.validateSync(data))
				return resolve();
			else
				return reject();
		});
	}
	validateSync(data) {
		try {
			this.parseSync(data);
			return true;
		}
		catch (e) {
			return false;
		}
	}

	parse(data) {
		return new Promise((resolve, reject) => {
			try {
				return resolve(this.parseSync(data));
			}
			catch (e) {
				return reject(e);
			}
		});
	}
	parseSync(data) {
		return this._schema.parseSync(data);
	}

	static Any() {
		return new AnyValidator();
	}
	static Boolean() {
		return new BooleanValidator();
	}
	static Number() {
		return new NumberValidator();
	}
	static String() {
		return new StringValidator();
	}
	static Array() {
		return new ArrayValidator();
	}
	static Object() {
		return new ObjectValidator();
	}

	static Or(validator) {
		return new OrValidator(validator);
	}
	static And(validator) {
		return new AndValidator(validator);
	}

	static get AnyValidator() {
		return AnyValidator;
	}
	static get BooleanValidator() {
		return BooleanValidator;
	}
	static get NumberValidator() {
		return NumberValidator;
	}
	static get StringValidator() {
		return StringValidator;
	}
	static get ArrayValidator() {
		return ArrayValidator;
	}
	static get ObjectValidator() {
		return ObjectValidator;
	}

	static get OrValidator() {
		return OrValidator;
	}
	static get AndValidator() {
		return AndValidator;
	}
}

module.exports = Schema;