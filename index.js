const BooleanValidator = require('./Validators/BooleanValidator');
const NumberValidator = require('./Validators/NumberValidator');
const StringValidator = require('./Validators/StringValidator');
const ArrayValidator = require('./Validators/ArrayValidator');
const ObjectValidator = require('./Validators/ObjectValidator');
const Validator = require('./Validators/Validator');

module.exports = {
	Boolean: () => {return new BooleanValidator();},
	Number: () => {return new NumberValidator();},
	String: () => {return new StringValidator();},
	Array: () => {return new ArrayValidator();},
	Object: () => {return new ObjectValidator();},
	isSchema: (schema) => {
		return schema instanceof Validator;
	}
};