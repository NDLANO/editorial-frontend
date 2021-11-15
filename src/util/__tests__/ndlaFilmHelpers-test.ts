/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { IFilmFrontPageData } from '@ndla/types-frontpage-api';
import { FilmFormikType } from '../../containers/NdlaFilm/components/NdlaFilmForm';
import { getInitialValues, getIdFromUrn, getUrnFromId } from '../ndlaFilmHelpers';

const filmFrontPage: IFilmFrontPageData = {
  name: 'Film',
  about: [
    {
      title: 'Om film',
      description: '',
      visualElement: {
        type: 'image',
        url: 'https://test.api.ndla.no/image-api/raw/id/37',
        alt: 'Et bilde Foto.',
      },
      language: 'nb',
    },
  ],
  movieThemes: [
    {
      name: [
        {
          name: 'eksempel 2',
          language: 'nb',
        },
      ],
      movies: ['urn:article:288'],
    },
  ],
  slideShow: [],
};

const filmFrontPageAfterTransformation: FilmFormikType = {
  articleType: 'subjectpage',
  description: [
    {
      children: [
        {
          text: '',
        },
      ],
      type: 'paragraph',
    },
  ],
  themes: [
    {
      name: [
        {
          name: 'eksempel 2',
          language: 'nb',
        },
      ],
      movies: ['urn:article:288'],
    },
  ],
  name: 'Film',
  language: 'nb',
  supportedLanguages: ['nb'],
  slideShow: [],
  title: 'Om film',
  visualElement: [
    {
      type: 'embed',
      data: {
        alt: 'Et bilde Foto.',
        metaData: {
          id: '37',
        },
        resource: 'image',
        resource_id: '37',
        url: 'https://test.api.ndla.no/image-api/raw/id/37',
      },
      children: [
        {
          text: '',
        },
      ],
    },
  ],
};

test('util/ndlaFilmHelpers getInitialValues', () => {
  expect(getInitialValues(filmFrontPage, 'nb')).toEqual(filmFrontPageAfterTransformation);
});

const numberId = 1987;
const urnId = `urn:article:${numberId}`;

test('util/ndlaFilmHelpers getIdFromUrn', () => {
  expect(getIdFromUrn(urnId)).toEqual(numberId);
});

test('util/ndlaFilmHelpers getUrnFromId', () => {
  expect(getUrnFromId(numberId)).toEqual(urnId);
});
