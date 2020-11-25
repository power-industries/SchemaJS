const Type = require('@power-industries/typejs');

const isJSONType = (value) => {
	if (value instanceof Type.Null ||
		value instanceof Type.Boolean ||
		value instanceof Type.Number ||
		value instanceof Type.String)
		return true;
	else if(value instanceof Type.Array)
		return value.reduce((accumulator, element) => {
			accumulator &= isJSONType(element);
			return accumulator;
		}, true);
	else if(value instanceof Type.Object)
		return Object.keys(value).reduce((accumulator, key) => {
			accumulator &= ((key instanceof Type.String) && isJSONType(value[key]));
			return accumulator;
		}, true);
	else
		return false;
}

module.exports = isJSONType;