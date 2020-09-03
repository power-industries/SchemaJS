const BooleanValidator = require('./Validators/BooleanValidator');
const NumberValidator = require('./Validators/NumberValidator');
const StringValidator = require('./Validators/StringValidator');
const ArrayValidator = require('./Validators/ArrayValidator');
const ObjectValidator = require('./Validators/ObjectValidator');
const Any = require('./Validators/Any');

module.exports = {
	Any: () => {return new Any();},
	Boolean: () => {return new BooleanValidator();},
	Number: () => {return new NumberValidator();},
	String: () => {return new StringValidator();},
	Array: () => {return new ArrayValidator();},
	Object: () => {return new ObjectValidator();},
	Validator: {
		Any: Any,
		Boolean: BooleanValidator,
		Number: NumberValidator,
		String: StringValidator,
		Array: ArrayValidator,
		Object: ObjectValidator
	}
};