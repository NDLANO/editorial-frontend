/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ndlaBaseUrl } from './config';

export const NAVIGATION_HEADER_MARGIN = '71px';

export const RESOURCE_TYPE_LEARNING_PATH = 'urn:resourcetype:learningPath';
export const RESOURCE_TYPE_SUBJECT_MATERIAL = 'urn:resourcetype:subjectMaterial';
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES = 'urn:resourcetype:tasksAndActivities';
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES = 'urn:resourcetype:reviewResource';
export const RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES = 'urn:resourcetype:externalResource';
export const RESOURCE_TYPE_SOURCE_MATERIAL = 'urn:resourcetype:SourceMaterial';
export const RESOURCE_TYPE_CONCEPT = 'urn:resourcetype:concept'; // Not yet added to @ndla/ui

export const ITUNES_STANDARD_MINIMUM_WIDTH = 1400;
export const ITUNES_STANDARD_MAXIMUM_WIDTH = 3000;

export const STORED_LANGUAGE_KEY = 'language';

export const REMEMBER_FAVOURITE_SUBJECTS = 'rememberFavouriteSubjects';
// Relevances
export const RESOURCE_FILTER_CORE = 'urn:relevance:core';
export const RESOURCE_FILTER_SUPPLEMENTARY = 'urn:relevance:supplementary';

export const NDLA_FILM_SUBJECT = 'urn:subject:20';

export const ARTICLE_EXTERNAL = 'external-learning-resources';

export const DRAFT_ADMIN_SCOPE = 'drafts:admin';
export const DRAFT_WRITE_SCOPE = 'drafts:write';
export const DRAFT_HTML_SCOPE = 'drafts:html';
export const DRAFT_PUBLISH_SCOPE = 'drafts:publish';

export const CONCEPT_WRITE_SCOPE = 'concept:write';
export const CONCEPT_ADMIN_SCOPE = 'concept:admin';

export const TAXONOMY_WRITE_SCOPE = 'taxonomy:write';
export const TAXONOMY_ADMIN_SCOPE = 'taxonomy:admin';

export const TAXONOMY_CUSTOM_FIELD_LANGUAGE = 'language';
export const TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES = 'topic-resources';
export const TAXONOMY_CUSTOM_FIELD_GROUPED_RESOURCE = 'grouped';
export const TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE = 'ungrouped';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT = 'forklaringsfag';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID = 'old-subject-id';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY = 'subjectCategory';

export const MAX_IMAGE_UPLOAD_SIZE = 1024 * 1024 * 40; // 40MB.

export const LOCALE_VALUES = ['nb', 'nn', 'en'] as const;

export const EXTERNAL_WHITELIST_PROVIDERS = [
  { name: 'H5P', url: ['h5p'] },
  { name: 'YouTube', url: ['youtube.com', 'youtu.be'], height: '486px' },
  { name: 'NRK', url: ['static.nrk.no'], height: '398px' },
  { name: 'Vimeo', url: ['vimeo.com', 'vimeopro.com'], height: '486px' },
  { name: 'Norgesfilm', url: ['ndla.filmiundervisning.no'] },
  { name: 'TED', url: ['ted.com', 'embed.ted.com'] },
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
  { name: 'Geogebra', url: ['geogebra.org', 'www.geogebra.org', 'ggbm.at'] },
  { name: 'IMDB', url: ['www.imdb.com', 'imdb.com'], height: '398px' },
  { name: 'Tom Knudsen', url: ['www.tomknudsen.no', 'tomknudsen.no'] },
  { name: 'Phet', url: ['phet.colorado.edu'] },
  { name: 'Worldbank', url: ['worldbank.org', '*.worldbank.org'] },
  {
    name: 'Miljøstatus',
    url: ['www.miljostatus.no', 'miljostatus.no', 'miljoatlas.miljodirektoratet.no'],
    height: '398px',
  },
  { name: 'MolView', url: ['embed.molview.org'] },
  {
    name: 'NDLA Statisk',
    url: [`statisk.${ndlaBaseUrl()}`],
  },
  {
    name: 'NDLA Liste',
    url: [`liste.${ndlaBaseUrl()}`],
    height: '398px',
  },
  { name: 'ebok', url: ['ebok.no'] },
];

export const SearchTypeValues = [
  // Available search types, there is a type equivalent in `interfaces.ts`
  'content',
  'audio',
  'image',
  'concept',
  'podcast-series',
] as const;
