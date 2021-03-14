const { normaliseAddAndSubtract } = require('../../src/handlers/score');

describe('score', () => {
	describe('#normaliseAddAndSubtract', () => {

		it('Can normalise a score with missing subtract', () => {
			const scores = [
				{
					add: 1,
				}
			];
			normaliseAddAndSubtract(scores);
			expect(scores[0].add).toBe(1)
			expect(scores[0].subtract).toBe(0)
		});

		it('Can normalise a score with missing add', () => {
			const scores = [
				{
					subtract: 1,
				}
			];
			normaliseAddAndSubtract(scores);
			expect(scores[0].add).toBe(0)
			expect(scores[0].subtract).toBe(1)
		});

		it('Can normalise a score with missing add and subtract properties', () => {
			const scores = [
				{
					foo: 'bar',
				}
			];
			normaliseAddAndSubtract(scores);
			expect(scores[0].add).toBe(0)
			expect(scores[0].subtract).toBe(0)
		});

	});

});
