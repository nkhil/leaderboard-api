const { arrayHasProps } = require('../../src/helpers/array-has-prop');

describe('#arrayHasProps', () => {
  it('returns true if all items in an array have prop', () => {
    const leaderboardId = '12345';
    const teams = [
      { leaderboardId: '12345'}, 
      { leaderboardId: '12345' }
    ];
    expect(arrayHasProps(teams, 'leaderboardId', leaderboardId)).toBe(true)
  });

  it('returns false if all items in an array do not have prop', () => {
    const leaderboardId = '12345';
    const teams = [
      { leaderboardId: '66666'}, 
      { leaderboardId: '66666' }
    ];
    expect(arrayHasProps(teams, 'leaderboardId', leaderboardId)).toBe(false)
  });
})