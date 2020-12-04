const Type = require('@power-industries/typejs');
const Validator = require('../Validators/Validator.base');

/**
 * Function checking if validatorMap is actually Map<String, Validator>
 * @param validatorMap {Map<String, Validator>} - The Map to check
 * @throws {TypeError} - Throws a TypeError if validatorMap is not a Map
 * @throws {TypeError} - Throws a TypeError if
 * 		a key of validatorMap is not a String
 * 		the prototype of a value of validatorMap is not an instance of Validator
 */
const checkValidatorMap = (validatorMap) => {
	if(!(validatorMap instanceof Map))
		throw new TypeError('Expected customValidatorMap to be a Map');

	validatorMap.forEach((value, key) => {
		if(!(key instanceof Type.String && value.prototype instanceof Validator))
			throw new TypeError('Expected customValidatorMap to be a Map of Strings and Validators');
	});
}

module.exports = checkValidatorMap;