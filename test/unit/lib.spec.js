/* eslint-disable no-undef */
const { generateSalt, generateApiKey } = require('../../src/lib/apikey');

describe('apiKey library helper functions', () => {
  describe('#generateSalt', () => {
    it('Creates a string of the right length', () => {
      const result = generateSalt(5);
      expect(result.length).toBe(5);
    });

    it('Contains letters and numbers only', () => {
      const regexp = /^[0-9a-zA-Z]+$/;
      const salt = generateSalt(5);
      const result = salt.match(regexp);
      expect(!!result).toBe(true);
    });
  });

  describe('#generateApiKey', () => {
    it('can create an api key', () => {
      const apiKey = generateApiKey(30);
      expect(typeof apiKey).toBe('string');
      expect(apiKey.length).toBe(30);
    });
  });
});
