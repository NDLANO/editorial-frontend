/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { FormikProps } from 'formik';
import { useState } from 'react';
import { SubjectpageEditType, TranslateType } from '../../interfaces';
import * as messageActions from '../Messages/messagesActions';
import { formatErrorMessage } from '../../util/apiHelpers';

export function useSubjectpageFormHooks(
  getSubjectpageFromSlate: Function,
  updateSubjectpage: Function,
  t: TranslateType,
  subjectpage: SubjectpageEditType,
  getInitialValues: Function,
  selectedLanguage: string,
  elementId: string,
) {
  const [savedToServer, setSavedToServer] = useState(false);
  const initialValues = getInitialValues(
    subjectpage,
    elementId,
    selectedLanguage,
  );

  const handleSubmit = async (formik: FormikProps<SubjectpageEditType>) => {
    formik.setSubmitting(true);
    const newSubjectpage = getSubjectpageFromSlate(formik.values);

    try {
      await updateSubjectpage(newSubjectpage);

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
