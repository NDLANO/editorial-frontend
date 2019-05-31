/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import {
  restructureFilmFrontpage,
  getIdFromUrn,
  getUrnFromId,
} from '../ndlaFilmHelpers';

const filmFrontPage = {
  name: 'Film',
  about: [
    {
      title: 'film',
      description: 'film fag',
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

const filmFrontPageAfterTransformation = {
  name: 'Film',
  about: [
    {
      title: 'film',
      description: 'film fag',
      visualElement: {
        type: 'image',
        id: '37',
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

test('util/ndlaFilmHelpers restructureFilmFrontpage', () => {
  expect(restructureFilmFrontpage(filmFrontPage)).toEqual(
    filmFrontPageAfterTransformation,
  );
});

const numberId = '1987';
const urnId = `urn:article:${numberId}`;

test('util/ndlaFilmHelpers getIdFromUrn', () => {
  expect(getIdFromUrn(urnId)).toEqual(numberId);
});

test('util/ndlaFilmHelpers getUrnFromId', () => {
  expect(getUrnFromId(numberId)).toEqual(urnId);
});
