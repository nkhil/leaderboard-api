const { 
	normaliseAddAndSubtract, 
} = require('../../src/handlers/score');

describe('score', () => {
	describe('#normaliseAddAndSubtract', () => {

		it('Can normalise a score with missing subtract', () => {
			const scores = [
				{
					add: 1,
				}
			];
			const result = normaliseAddAndSubtract(scores);
			expect(result[0].add).toBe(1)
			expect(result[0].subtract).toBe(0)
		});

		it('Can normalise a score with missing add', () => {
			const scores = [
				{
					subtract: 1,
				}
			];
			const result = normaliseAddAndSubtract(scores);
			expect(result[0].add).toBe(0)
			expect(result[0].subtract).toBe(1)
		});

		it('Can normalise a score with missing add and subtract properties', () => {
			const scores = [
				{
					foo: 'bar',
				}
			];
			const result = normaliseAddAndSubtract(scores);
			expect(result[0].add).toBe(0)
			expect(result[0].subtract).toBe(0)
		});

	});

});
