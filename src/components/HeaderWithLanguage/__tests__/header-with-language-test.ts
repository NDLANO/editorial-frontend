import { getTaxonomyPathsFromTaxonomy } from '../util';

test('that getTaxonomyPathsFromTaxonomy finds correct paths from object with id', () => {
  const result = getTaxonomyPathsFromTaxonomy(
    {
      topics: [
        {
          paths: ['/subject:1/topic:1/topic:456', '/subject:1/topic:2/topic:456'],
        },
        {
          paths: ['/subject:2/topic:3'],
        },
      ],
      resources: [
        {
          paths: [],
        },
      ],
    },
    1,
  );

  expect(result).toStrictEqual([
    '/subject:1/topic:1/topic:456',
    '/subject:1/topic:2/topic:456',
    '/subject:2/topic:3',
    '/article/1',
  ]);
});

test('that getTaxonomyPathsFromTaxonomy finds correct paths from object without id', () => {
  const result = getTaxonomyPathsFromTaxonomy({
    topics: [],
    resources: [
      {
        paths: ['/subject:1/topic:1/topic:2/resource:1'],
      },
    ],
  });

  expect(result).toStrictEqual(['/subject:1/topic:1/topic:2/resource:1']);
});
