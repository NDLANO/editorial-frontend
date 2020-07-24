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
  subjectId: number,
) {
  const [savedToServer, setSavedToServer] = useState(false);
  const initialValues = getInitialValues(
    subjectpage,
    subjectId,
    selectedLanguage,
  );

  const handleSubmit = async (formik: FormikProps<SubjectpageEditType>) => {
    formik.setSubmitting(true);
    const newSubjectpage = getSubjectpageFromSlate(formik.values);

    try {
      await updateSubjectpage(newSubjectpage);

      setSavedToServer(true);
      formik.resetForm();

      Object.keys(formik.values).map(fieldName =>
        formik.setFieldTouched(fieldName, true, true),
      );
    } catch (err) {
      if (err && err.status && err.status === 409) {
        messageActions.addMessage({
          message: t('alertModal.needToRefresh'),
          timeToLive: 0,
        });
      } else if (err && err.json && err.json.messages) {
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
