/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import DropdownSearch from './DropdownSearch';
import { ContentResultType } from '../../../interfaces';
import { NDLA_FILM_SUBJECT } from '../../../constants';

interface Props {
  onUpdateSlideshow: Function;
  allMovies: ContentResultType[];
  loading: boolean;
  field: FieldProps<ContentResultType[]>['field'];
  form: FormikHelpers<FormikValues>;
}

const SlideshowEditor = ({
  t,
  onUpdateSlideshow,
  allMovies,
  loading,
  field,
  form,
}: Props & tType) => {
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
          dragElement: t('ndlaFilm.editor.changeOrder'),
          removeElement: t('ndlaFilm.editor.removeMovieFromSlideshow'),
        }}
        onUpdateElements={(movies: ContentResultType[]) => onUpdateSlideshow(field, form, movies)}
      />
      <DropdownSearch
        selectedElements={slideshowMovies}
        onChange={(movie: ContentResultType) => onAddMovieToSlideshow(movie)}
        placeholder={t('ndlaFilm.editor.addMovieToSlideshow')}
        subjectId={NDLA_FILM_SUBJECT}
        contextTypes={'standard'}
        clearInputField
      />
    </>
  );
};

export default injectT(SlideshowEditor);
