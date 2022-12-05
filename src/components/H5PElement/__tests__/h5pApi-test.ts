import { getH5pLocale } from '../h5pApi';

test('get correct code from language', () => {
  expect(getH5pLocale('en')).toBe('en-gb');
  expect(getH5pLocale('nn')).toBe('nn-no');
  expect(getH5pLocale('nb')).toBe('nb-no');
  expect(getH5pLocale('se')).toBe('nb-no');
  expect(getH5pLocale('sma')).toBe('nb-no');
  expect(getH5pLocale('anything')).toBe('nb-no');
});
