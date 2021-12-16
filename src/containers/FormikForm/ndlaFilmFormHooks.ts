/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { FormikProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IFilmFrontPageData } from '@ndla/types-frontpage-api';
import { formatErrorMessage } from '../../util/apiHelpers';
import { getInitialValues } from '../../util/ndlaFilmHelpers';
import { getNdlaFilmFromSlate } from '../../util/ndlaFilmHelpers';
import { FilmFormikType } from '../../containers/NdlaFilm/components/NdlaFilmForm';
import { useMessages } from '../Messages/MessagesProvider';
import { useUpdateFilmFrontpageMutation } from '../../modules/frontpage/filmMutations';

export function useNdlaFilmFormHooks(filmFrontpage: IFilmFrontPageData, selectedLanguage: string) {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const updateFilmFrontpage = useUpdateFilmFrontpageMutation();

  const initialValues = getInitialValues(filmFrontpage, selectedLanguage);
  const { createMessage, applicationError } = useMessages();

  const handleSubmit = async (formik: FormikProps<FilmFormikType>) => {
    formik.setSubmitting(true);
    const newNdlaFilm = getNdlaFilmFromSlate(filmFrontpage, formik.values, selectedLanguage);

    try {
      await updateFilmFrontpage.mutateAsync(newNdlaFilm);

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
