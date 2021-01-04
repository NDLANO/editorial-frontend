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
  isPlainId,
} from '../EditLink';

test('urls are parsed correctly', async () => {
  const articleUrls = [
    'https://www.test.ndla.no/article/64323',
    'https://www.test.ndla.no/sma/article/64323',
    'http://www.test.ndla.no/en/article/64323',
  ];

  const subjectUrls = [
    'https://api.test.ndla.no/en/subject:3/topic:1:2342/resource:1:64323',
    'https://api.test.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.api.test.ndla.no/sma/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.api.test.ndla.no/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.test.api.ndla.no/nn/subject:3/topic:1:2342/resource:1:64323',
    'https://ndla-frontend.test.api.ndla.no/subject:3/topic:1:2342/resource:1:64323',
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
    expect(isPlainId(url)).toBe(false);
  });

  subjectUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(true);
    expect(isPlainId(url)).toBe(false);
  });

  learningPathUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(true);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(false);
  });

  plainIds.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(true);
  });

  otherUrls.forEach(url => {
    expect(isNDLAArticleUrl(url)).toBe(false);
    expect(isNDLALearningPathUrl(url)).toBe(false);
    expect(isNDLATaxonomyUrl(url)).toBe(false);
    expect(isPlainId(url)).toBe(false);
  });
});
