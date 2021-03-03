const { generateSalt, generateApiKey } = require('../../src/lib/apikey');

describe('api key library functions', () => {
	describe('generateSalt function', () => {
		it('Creates a string of the right length', () => {
			const result = generateSalt(5)
			expect(result.length).toBe(5)
		});

		it('Contains letters and numbers only', () => {
			const regexp = /^[0-9a-zA-Z]+$/
			const salt = generateSalt(5)
			const result = salt.match(regexp)
			expect(!!result).toBe(true)
		});
	});

	describe('#generateApiKey', () => {
		it('throws an error if no params provided', () => {
			expect(() => generateApiKey()).toThrow('API Key length not defined.');
		});
	});
});
