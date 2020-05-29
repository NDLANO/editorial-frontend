/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const NAVIGATION_HEADER_MARGIN = '71px';

export const RESOURCE_TYPE_LEARNING_PATH = 'urn:resourcetype:learningPath';
export const RESOURCE_TYPE_SUBJECT_MATERIAL =
  'urn:resourcetype:subjectMaterial';
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES =
  'urn:resourcetype:reviewResource';
export const RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES =
  'urn:resourcetype:externalResource';
export const RESOURCE_TYPE_SOURCE_MATERIAL = 'urn:resourcetype:SourceMaterial';
export const RESOURCE_TYPE_CONCEPT = 'urn:resourcetype:concept'; // Not yet added to @ndla/ui

// Filters
export const RESOURCE_FILTER_CORE = 'urn:relevance:core';
export const RESOURCE_FILTER_SUPPLEMENTARY = 'urn:relevance:supplementary';

export const ARTICLE_EXTERNAL = 'external-learning-resources';

export const DRAFT_WRITE_SCOPE = 'drafts:write';
export const DRAFT_HTML_SCOPE = 'drafts:html';
export const DRAFT_PUBLISH_SCOPE = 'drafts:publish';

export const CONCEPT_WRITE_SCOPE = 'concept:write';

export const TAXONOMY_WRITE_SCOPE = 'taxonomy:write';
export const TAXONOMY_ADMIN_SCOPE = 'taxonomy:admin';

export const EXTERNAL_WHITELIST_PROVIDERS = [
  { name: 'H5P', url: ['h5p'] },
  { name: 'YouTube', url: ['youtube.com', 'youtu.be'], height: '486px' },
  { name: 'NRK', url: ['static.nrk.no'], height: '398px' },
  { name: 'Vimeo', url: ['vimeo.no', 'vimeopro.com'], height: '486px' },
  { name: 'Norgesfilm', url: ['ndla.filmiundervisning.no'] },
  { name: 'TED', url: ['ted.com'] },
  { name: 'TV2 Skole', url: ['www.tv2skole.no'], height: '431px' },
  { name: 'Khan Academy', url: ['nb.khanacademy.org'], height: '486px' },
  { name: 'Prezi', url: ['prezi.com'] },
  { name: 'SlideShare', url: ['www.slideshare.net'], height: '500px' },
  { name: 'Scribd', url: ['scribd.com'] },
  { name: 'Kahoot', url: ['embed.kahoot.it'] },
  {
    name: 'Livestream',
    url: ['livestream.com', 'new.livestream.com'],
    height: '398px',
  },
  { name: 'Issuu', url: ['e.issuu.com'] },
  { name: 'Geogebra', url: ['geogebra.org', 'ggbm.at'] },
  { name: 'IMDB', url: ['www.imdb.com', 'imdb.com'], height: '398px' },
  { name: 'Tom Knudsen', url: ['www.tomknudsen.no', 'tomknudsen.no'] },
  { name: 'Phet', url: ['phet.colorado.edu'] },
  { name: 'Worldbank', url: ['worldbank.org', '*.worldbank.org'] },
  {
    name: 'Miljøstatus',
    url: [
      'www.miljostatus.no',
      'miljostatus.no',
      'miljoatlas.miljodirektoratet.no',
    ],
    height: '398px',
  },
];
