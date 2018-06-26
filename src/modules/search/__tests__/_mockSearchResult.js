/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const contentResults = {
  totalCount: 40,
  page: 1,
  pageSize: 10,
  language: 'all',
  results: [
    {
      id: 3142,
      title: {
        title: 'Alkoholreklame på fjernsyn',
        language: 'nb',
      },
      metaDescription: {
        metaDescription:
          'Norge har hatt forbud mot alkoholreklame siden 1975. Men regelverket ble oppmyket i 2015.',
        language: 'nb',
      },
      metaImage: 'https://test.api.ndla.no/image-api/raw/id/37695',
      url: 'https://test.api.ndla.no/draft-api/v1/drafts/3142',
      contexts: [
        {
          id: 'urn:resource:1:86218',
          subject: 'Medie- og informasjonskunnskap',
          path: '/subject:14/topic:1:185036/topic:1:185602/resource:1:86218',
          breadcrumbs: [
            'Medie- og informasjonskunnskap',
            'Journalistikk, informasjon og reklame',
            'Markedskommunikasjon',
          ],
          filters: [
            {
              name: 'MIK 1',
              relevance: 'Kjernestoff',
            },
            {
              name: 'MIK 2',
              relevance: 'Tilleggsstoff',
            },
          ],
          learningResourceType: 'standard',
          resourceTypes: [
            {
              id: 'urn:resourcetype:subjectMaterial',
              name: 'Fagstoff',
              language: 'nb',
            },
            {
              id: 'urn:resourcetype:academicArticle',
              name: 'Fagartikkel',
              language: 'nb',
            },
          ],
          language: 'nb',
        },
        {
          id: 'urn:resource:1:86218',
          subject: 'Medieuttrykk og mediesamfunnet',
          path: '/subject:1/topic:1:171906/topic:1:166872/resource:1:86218',
          breadcrumbs: [
            'Medieuttrykk og mediesamfunnet',
            'Mediebransjen',
            'Markedsføring',
          ],
          filters: [
            {
              name: 'SF VG1',
              relevance: 'Kjernestoff',
            },
            {
              name: 'Mediesamfunnet',
              relevance: 'Kjernestoff',
            },
          ],
          learningResourceType: 'standard',
          resourceTypes: [
            {
              id: 'urn:resourcetype:subjectMaterial',
              name: 'Fagstoff',
              language: 'nb',
            },
            {
              id: 'urn:resourcetype:academicArticle',
              name: 'Fagartikkel',
              language: 'nb',
            },
          ],
          language: 'nb',
        },
        {
          id: 'urn:resource:1:86218',
          subject: 'Medie- og informasjonskunnskap',
          path: '/subject:14/topic:1:185036/topic:1:166872/resource:1:86218',
          breadcrumbs: [
            'Medie- og informasjonskunnskap',
            'Journalistikk, informasjon og reklame',
            'Markedsføring',
          ],
          filters: [
            {
              name: 'MIK 1',
              relevance: 'Kjernestoff',
            },
            {
              name: 'MIK 2',
              relevance: 'Tilleggsstoff',
            },
          ],
          learningResourceType: 'standard',
          resourceTypes: [
            {
              id: 'urn:resourcetype:subjectMaterial',
              name: 'Fagstoff',
              language: 'nb',
            },
            {
              id: 'urn:resourcetype:academicArticle',
              name: 'Fagartikkel',
              language: 'nb',
            },
          ],
          language: 'nb',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
    },
    {
      id: 5943,
      title: {
        title:
          'Folket betrakter mat som sitt himmelrike (Mín yǐ shí wéi tiān 民以食为天)',
        language: 'nb',
      },
      metaDescription: {
        metaDescription:
          'Kina har en rikholding matkultur, med store regionale variasjoner.',
        language: 'nb',
      },
      metaImage: 'https://test.api.ndla.no/image-api/raw/id/1759',
      url: 'https://test.api.ndla.no/draft-api/v1/drafts/5943',
      contexts: [
        {
          id: 'urn:resource:1:163488',
          subject: 'Kinesisk',
          path: '/subject:2/topic:1:182035/resource:1:163488',
          breadcrumbs: ['Kinesisk', 'Å spise på restaurant'],
          filters: [
            {
              name: 'Kinesisk 1',
              relevance: 'Kjernestoff',
            },
          ],
          learningResourceType: 'standard',
          resourceTypes: [
            {
              id: 'urn:resourcetype:subjectMaterial',
              name: 'Fagstoff',
              language: 'nb',
            },
            {
              id: 'urn:resourcetype:academicArticle',
              name: 'Fagartikkel',
              language: 'nb',
            },
          ],
          language: 'nb',
        },
      ],
      supportedLanguages: ['nb', 'nn'],
    },
  ],
};

export const mediaResults = [
  {
    type: 'images',
    language: 'all',
    totalCount: 32,
    page: 3,
    pageSize: 2,
    results: [
      {
        id: 7533,
        title: 'Dekningsgrad',
        altText: '',
        previewUrl:
          'https://test.api.ndla.no/image-api/raw/2011-05-03_0924.png',
        metaUrl: 'https://test.api.ndla.no/image-api/v2/images/7533',
        supportedLanguages: ['unknown', 'nb', 'nn', 'en'],
      },
      {
        id: 7534,
        title: 'Dekningsbidrag ved makspris',
        altText: '',
        previewUrl:
          'https://test.api.ndla.no/image-api/raw/2011-05-03_0917.png',
        metaUrl: 'https://test.api.ndla.no/image-api/v2/images/7534',
        supportedLanguages: ['unknown', 'nb', 'nn', 'en'],
      },
    ],
  },
];
