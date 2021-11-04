/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { FormikProps } from 'formik';
import { useState } from 'react';
import { TFunction } from 'react-i18next';
import { ContentResultType, NdlaFilmApiType, NdlaFilmThemesEditType } from '../../interfaces';
import { formatErrorMessage } from '../../util/apiHelpers';
import { updateFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import { getInitialValues } from '../../util/ndlaFilmHelpers';
import { getNdlaFilmFromSlate } from '../../util/ndlaFilmHelpers';
import { NdlaFilmFormikType } from '../../containers/NdlaFilm/components/NdlaFilmForm';
import { useMessages } from '../Messages/MessagesProvider';

export function useNdlaFilmFormHooks(
  t: TFunction,
  filmFrontpage: NdlaFilmApiType,
  updateEditorState: Function,
  slideshowMovies: ContentResultType[],
  themes: NdlaFilmThemesEditType[],
  selectedLanguage: string,
) {
  const [savedToServer, setSavedToServer] = useState(false);

  const initialValues = getInitialValues(filmFrontpage, slideshowMovies, themes, selectedLanguage);
  const { createMessage, applicationError } = useMessages();

  const handleSubmit = async (formik: FormikProps<NdlaFilmFormikType>) => {
    formik.setSubmitting(true);
    const newNdlaFilm = getNdlaFilmFromSlate(filmFrontpage, formik.values, selectedLanguage);

    try {
      const updated = await updateFilmFrontpage(newNdlaFilm);
      await updateEditorState(updated);

      Object.keys(formik.values).map(fieldName => formik.setFieldTouched(fieldName, true, true));

      formik.resetForm();
      setSavedToServer(true);
    } catch (err) {
      if (err?.status === 409) {
        createMessage({
          message: t('alertModal.needToRefresh'),
          timeToLive: 0,
        });
      } else if (err?.json?.messages) {
        createMessage(formatErrorMessage(err));
      } else {
        applicationError(err);
      }
      formik.setSubmitting(false);
      setSavedToServer(false);
    }
    await formik.validateForm();
  };

  return {
    savedToServer,
    handleSubmit,
    initialValues,
  };
}
