/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { useField, useFormikContext } from 'formik';
import { ThemeMovies } from './ThemeMovies';

interface Props {
  onUpdateSlideshow: Function;
  fieldName: string;
}

const SlideshowEditor = ({ onUpdateSlideshow, fieldName }: Props) => {
  const { t } = useTranslation();
  const form = useFormikContext();
  const [field] = useField(fieldName);
  const slideshowMovies = field.value;

  return (
    <>
      <FieldHeader
        title={t('ndlaFilm.editor.slideshowTitle')}
        subTitle={t('ndlaFilm.editor.slideshowSubTitle')}
      />
      <ThemeMovies
        movies={slideshowMovies}
        onMoviesUpdated={movies => onUpdateSlideshow(field, form, movies)}
        placeholder={t('ndlaFilm.editor.addMovieToSlideshow')}
      />
    </>
  );
};

export default SlideshowEditor;
