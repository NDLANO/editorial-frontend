/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  isNDLAArticleUrl,
  isNDLALearningPathUrl,
  isNDLATaxonomyUrl,
  isNDLAEdPathUrl,
  isPlainId,
} from '../EditLink';
import { splitArticleUrl, splitLearningPathUrl, splitEdPathUrl, splitPlainUrl } from '../utils';

test('urls are parsed correctly', async () => {
  const articleUrls = [
    'https://www.test.ndla.no/article/64323',
    'https://www.test.ndla.no/sma/article/64323',
    'http://www.test.ndla.no/en/article/64323',
  ];

  const subjectUrls = [
    'https://api.test.ndla.no/en/subjects/subject:3/topic:1:2342/resource:1:64323',
    'https://api.test.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.api.test.ndla.no/sma/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.api.test.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.test.api.ndla.no/nn/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.test.api.ndla.no/subjects/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla.no/sma/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://test.ndla.no/nb/subject:3/topic:1:2342/resource:1:64323',
    'https://test.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://www.ndla.no/nn/subject:3/topic:1:2342/resource:1:64323',
    'https://www.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://www.staging.ndla.no/sma/subject:3/topic:1:2342/resource:1:64323',
    'https://www.staging.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://www.test.ndla.no/en/subject:3/topic:1:2342/resource:1:64323',
    'https://www.test.ndla.no/subject:3/topic:1:2342/resource:1:64323',
  ];

  const learningPathUrls = [
    'https://www.test.ndla.no/nn/learningpaths/64323',
    'https://www.test.ndla.no/learningpaths/64323',
  ];

  const plainIds = ['5512', '123', '12', '1', '12314'];

  const edPathUrls = [
    'https://ed.ndla.no/nb/subject-matter/learning-resource/123/edit/nn',
    'https://ed.test.ndla.no/nb/subject-matter/learning-resource/123/edit/nn',
    'https://ed.staging.ndla.no/nb/subject-matter/learning-resource/123/edit/nn',
    'https://ed.ndla.no/subject-matter/learning-resource/4/edit/nb',
    'https://ed.test.ndla.no/subject-matter/learning-resource/4/edit/nb',
    'https://ed.staging.ndla.no/subject-matter/learning-resource/4/edit/nb',
    'https://ed.ndla.no/subject-matter/topic-article/56/edit/nn',
    'https://ed.test.ndla.no/subject-matter/topic-article/56/edit/nn',
    'https://ed.staging.ndla.no/subject-matter/topic-article/56/edit/nn',
    'https://ed.ndla.no/subject-matter/topic-article/56',
    'https://ed.test.ndla.no/subject-matter/topic-article/56',
    'https://ed.staging.ndla.no/subject-matter/topic-article/56',
  ];

  const otherUrls = [
    'https://www.vg.no/',
    'https://www.youtube.com/subject:3/topic:1:2342/resource:1:64323',
    'https://test.ndla.no/en/subject:3/',
    'https://ndla.no/en/subject:1/',
  ];

  articleUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(true);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isNDLAEdPathUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(false);
  });

  subjectUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(true);
    expect(isNDLAEdPathUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(false);
  });

  learningPathUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(true);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isNDLAEdPathUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(false);
  });

  edPathUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isNDLAEdPathUrl(url)).toBe(true);
    expect(isPlainId(url)).toBe(false);
  });

  plainIds.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isNDLAEdPathUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(true);
  });

  otherUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isNDLAEdPathUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(false);
  });
});

test('test split methods', async () => {
  expect(splitArticleUrl('https://www.test.ndla.no/article/64323').resourceId).toBe('64323');
  expect(splitArticleUrl('https://www.test.ndla.no/sma/article/64323').resourceId).toBe('64323');
  expect(splitLearningPathUrl('https://www.test.ndla.no/learningpaths/64323').resourceId).toBe(
    '64323',
  );
  expect(splitLearningPathUrl('https://www.test.ndla.no/nb/learningpaths/64323').resourceId).toBe(
    '64323',
  );
  expect(
    splitEdPathUrl('https://ed.ndla.no/nb/subject-matter/learning-resource/123/edit/nn').resourceId,
  ).toBe('123');
  expect(splitEdPathUrl('https://ed.test.ndla.no/subject-matter/topic-article/56').resourceId).toBe(
    '56',
  );
  expect(splitPlainUrl('5512').resourceId).toBe('5512');
});
