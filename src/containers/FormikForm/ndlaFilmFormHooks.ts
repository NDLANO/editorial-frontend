/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { FormikProps } from 'formik';
import { useState } from 'react';
import {
  ContentResultType,
  NdlaFilmApiType,
  NdlaFilmThemesEditType,
  SubjectpageEditType,
  TranslateType,
} from '../../interfaces';
import * as messageActions from '../Messages/messagesActions';
import { formatErrorMessage } from '../../util/apiHelpers';
import { updateFilmFrontpage } from '../../modules/frontpage/frontpageApi';
import { getInitialValues } from '../../util/ndlaFilmHelpers';
import { getNdlaFilmFromSlate } from '../../util/ndlaFilmHelpers';

export function useNdlaFilmFormHooks(
  t: TranslateType,
  filmFrontpage: NdlaFilmApiType,
  updateEditorState: Function,
  slideshowMovies: ContentResultType[],
  themes: NdlaFilmThemesEditType,
  selectedLanguage: string,
) {
  const [savedToServer, setSavedToServer] = useState(false);

  const initialValues = getInitialValues(
    filmFrontpage,
    slideshowMovies,
    themes,
    selectedLanguage,
  );

  const handleSubmit = async (formik: FormikProps<SubjectpageEditType>) => {
    formik.setSubmitting(true);
    const newNdlaFilm = getNdlaFilmFromSlate(
      filmFrontpage,
      formik.values,
      selectedLanguage,
    );

    try {
      const updated = await updateFilmFrontpage(newNdlaFilm);
      await updateEditorState(updated);

      Object.keys(formik.values).map(fieldName =>
        formik.setFieldTouched(fieldName, true, true),
      );

      formik.resetForm(initialValues);
      setSavedToServer(true);
    } catch (err) {
      if (err?.status === 409) {
        messageActions.addMessage({
          message: t('alertModal.needToRefresh'),
          timeToLive: 0,
        });
      } else if (err?.json?.messages) {
        messageActions.addMessage(formatErrorMessage(err));
      } else {
        messageActions.applicationError(err);
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
