import { removeLastItemFromUrl, getResourceIdFromPath, getPathsFromUrl } from '../routeHelpers';

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

test('getResourceIdFromPath', () => {
  const input = [
    'https://ndla.no/subjects/subject:9/topic:1:182020/topic:1:186218/resource:1:132925',
    'https://ndla.no/subjects/subject:9/topic:1:182020/resource:1:142207/',
    'https://stier.ndla.no/nb/learningpaths/125/step/871',
    'resource:1243/?something',
  ];

  const output = ['urn:resource:1:132925', 'urn:resource:1:142207', '125', ''];

  input.forEach((path, i) => {
    expect(getResourceIdFromPath(path)).toBe(output[i]);
  });
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
