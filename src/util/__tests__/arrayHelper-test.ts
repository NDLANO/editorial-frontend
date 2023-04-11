import { arrMove } from '../arrayHelpers';

describe('util/arrayHelpers arrMove', () => {
  it('handles moving from 1 to 0', () => {
    const list = [2, 1, 3];
    const expected = [1, 2, 3];
    expect(arrMove(list, 1, 0)).toEqual(expected);
  });
  it('handles moving from 0 to 1', () => {
    const list = [2, 1, 3];
    const expected = [1, 2, 3];
    expect(arrMove(list, 0, 1)).toEqual(expected);
  });
  it('handles moving from first to last', () => {
    const list = [3, 1, 2];
    const expected = [1, 2, 3];
    expect(arrMove(list, 0, 2)).toEqual(expected);
  });

  it('handles moving from last to first', () => {
    const list = [2, 3, 1];
    const expected = [1, 2, 3];
    expect(arrMove(list, 2, 0)).toEqual(expected);
  });
});
