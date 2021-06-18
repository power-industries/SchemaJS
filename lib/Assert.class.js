class Assert {
	static isUndefined(value) {
		return value === undefined;
	}
	static isNull(value) {
		return value === null;
	}
	static isBoolean(value) {
		return typeof value === 'boolean';
	}
	static isNumber(value) {
		return typeof value === 'number';
	}
	static isNumerical(value) {
		return Number.isFinite(value);
	}
	static isInteger(value) {
		return Number.isSafeInteger(value);
	}
	static isFloat(value) {
		return Number.isFinite(value) && !Number.isSafeInteger(value);
	}
	static isNaN(value) {
		return Number.isNaN(value);
	}
	static isInfinite(value) {
		return value === Infinity || value === -Infinity;
	}
	static isString(value) {
		return typeof value === 'string';
	}
	static isArray(value) {
		return Array.isArray(value);
	}
	static isObject(value) {
		return Object.prototype.toString.call(value) === '[object Object]';
	}
	static isMap(value) {
		return value instanceof Map;
	}
	static isSet(value) {
		return value instanceof Set;
	}
	static isSymbol(value) {
		return value instanceof Symbol;
	}
	static isFunction(value) {
		return typeof value === 'function';
	}
	static hasArity(value, arity) {
		if(typeof value !== 'function')
			throw new TypeError('Expected value to be a Function');

		return value.length === arity;
	}
}

module.exports = Assert;