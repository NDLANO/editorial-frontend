/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import ElementList from './ElementList';
import DropdownSearch from './DropdownSearch';
import { ContentResultType, TranslateType } from '../../../interfaces';

interface Props {
  t: TranslateType;
  onUpdateSlideshow: Function;
  onAddMovieToSlideshow: Function;
  allMovies: ContentResultType[];
  loading: boolean;
  field: FieldProps<ContentResultType[]>['field'];
  form: FormikHelpers<FormikValues>;
}

const SlideshowEditor: FC<Props> = ({
  t,
  onUpdateSlideshow,
  allMovies,
  loading,
  field,
  form,
}) => {
  if (loading) {
    return <Spinner />;
  }

  const slideshowMovies = field.value;
  const onAddMovieToSlideshow = (newMovie: ContentResultType) => {
    const movie = allMovies.find(movie => movie.id === newMovie.id);
    if (movie) {
      const temp = slideshowMovies.slice();
      temp.push(movie);
      onUpdateSlideshow(field, form, temp);
    }
  };

  return (
    <>
      <FieldHeader
        title={t('ndlaFilm.editor.slideshowTitle')}
        subTitle={t('ndlaFilm.editor.slideshowSubTitle')}
      />
      <ElementList
        elements={slideshowMovies}
        data-cy="slideshow-movie-list"
        messages={{
          dragElements: t('ndlaFilm.editor.changeOrder'),
          removeElements: t('ndlaFilm.editor.removeMovieFromSlideshow'),
        }}
        onUpdateElements={(movies: ContentResultType[]) =>
          onUpdateSlideshow(field, form, movies)
        }
      />
      <DropdownSearch
        selectedElements={slideshowMovies}
        onChange={(movie: ContentResultType) => onAddMovieToSlideshow(movie)}
        placeholder={t('ndlaFilm.editor.addMovieToSlideshow')}
        clearInputField
      />
    </>
  );
};

export default injectT(SlideshowEditor);
