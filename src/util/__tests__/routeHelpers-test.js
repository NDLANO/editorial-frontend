import { removeLastItemFromUrl, getPathsFromUrl } from '../routeHelpers';

test('correctly removes last part of all urls', () => {
  const url1 =
    'http://localhost:3000/structure/subject:7/topic:1:183193/topic:1:87883';
  const url2 = 'http://localhost:3000/structure/subject:7/topic:1:183193/';
  const url3 = 'http://localhost:3000/structure/subject:7/topic:1:183193';
  const url4 = '';
  expect(removeLastItemFromUrl(url1)).toBe(
    'http://localhost:3000/structure/subject:7/topic:1:183193',
  );
  expect(removeLastItemFromUrl(url2)).toBe(
    'http://localhost:3000/structure/subject:7/topic:1:183193',
  );
  expect(removeLastItemFromUrl(url3)).toBe(
    'http://localhost:3000/structure/subject:7',
  );
  expect(removeLastItemFromUrl(url4)).toBe('');
});

test('getPathsFromUrl', () => {
  const input = [
    '/structure',
    '/structure/urn:subject:7',
    '/structure/urn:subject:7/urn:topic:1:183192',
    '/structure/urn:subject:7/urn:topic:1:183192/urn:topic:1:103222',
  ];
  const output = [
    [],
    ['urn:subject:7'],
    ['urn:subject:7', 'urn:subject:7/urn:topic:1:183192'],
    [
      'urn:subject:7',
      'urn:subject:7/urn:topic:1:183192',
      'urn:subject:7/urn:topic:1:183192/urn:topic:1:103222',
    ],
  ];

  input.forEach((path, i) => {
    expect(getPathsFromUrl(path)).toEqual(output[i]);
  });
});
