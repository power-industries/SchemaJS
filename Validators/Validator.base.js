module.exports = class {
	constructor() {}

	validate(data) {
		return new Promise((resolve, reject) => {
			return reject(new Error('Method not defined'));
		});
	}
	validateSync(data) {
		throw new Error('Method not defined');
	}

	parse(data) {
		return new Promise((resolve, reject) => {
			return reject(new Error('Method not defined'))
		});
	}

	parseSync(data) {
		throw new Error('Method not defined');
	}
}