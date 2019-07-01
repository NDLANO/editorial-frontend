import { arrMove } from '../arrayHelpers';

test('util/arrayHelpers arrMove', () => {
  const myList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, 'hei', 'æøå'];
  const checkArray = [0, 1, 2, 3, 4, 6, 7, 8, 9, null, 'hei', 5, 'æøå'];
  expect(arrMove(myList, 5, 11)).toEqual(checkArray);
});
