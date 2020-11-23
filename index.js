const Type = require('@power-industries/typejs');

// The Base Validator
const Validator = require('./Util/Validator');

// Default TypeValidators - can be overridden by custom Validators
const AnyValidator = require('./Validators/TypeValidators/AnyValidator');
const BooleanValidator = require('./Validators/TypeValidators/BooleanValidator');
const NumberValidator = require('./Validators/TypeValidators/NumberValidator');
const StringValidator = require('./Validators/TypeValidators/StringValidator');
const ArrayValidator = require('./Validators/TypeValidators/ArrayValidator');
const ObjectValidator = require('./Validators/TypeValidators/ObjectValidator');

class Schema {
	/**
	 * Create a new Schema instance
	 * @param schema {Object | Validator} - A Schema, has to be a JSON-Schema or a Validator
	 * @param customValidatorMap {Map<String, Validator>} - A Map of Strings and Validators
	 * @throws {TypeError} - Throws TypeError if customValidatorMap is not a Map
	 * @throws {TypeError} - Throws TypeError if keys of customValidatorMap are not Strings
	 * @throws {TypeError} - Throws TypeError if values of customValidatorMap are not derived of Validator
	 * @throws {TypeError} - Throws TypeError if schema is not an Object or Validator
	 */
	constructor(schema, customValidatorMap = new Map()) {
		if(!(customValidatorMap instanceof Map))
			throw new TypeError('Expected customValidatorMap to be a Map');

		customValidatorMap.forEach((value, key) => {
			if(!(key instanceof Type.String && value instanceof Validator))
				throw new TypeError('Expected customValidatorMap to be a Map of Strings and Validators');
		});

		this._validatorMap = new Map([
			['any', AnyValidator],
			['boolean', BooleanValidator],
			['number', NumberValidator],
			['string', StringValidator],
			['array', ArrayValidator],
			['object', ObjectValidator],
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
		let schemaType = Schema.getSchemaType(schema);

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
}

module.exports = Schema;