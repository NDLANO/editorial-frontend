/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useCallback, useEffect, useState } from 'react';
import { Spinner } from '@ndla/icons';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import { FieldProps, FormikProps, useFormikContext } from 'formik';
import FormikField from '../../../components/FormikField';
import VisualElementField from '../../FormikForm/components/VisualElementField';
import PlainTextEditor from '../../../components/SlateEditor/PlainTextEditor';
import { TitleField } from '../../FormikForm';
import { SubjectPageFormikType } from '../../../util/subjectHelpers';
import { FilmFormikType } from '../../NdlaFilm/components/NdlaFilmForm';

interface Props<T extends SubjectPageFormikType | FilmFormikType> {
  selectedLanguage?: string;
  handleSubmit: (formik: FormikProps<T>) => void;
}

const SubjectpageAbout = <T extends SubjectPageFormikType | FilmFormikType>({
  selectedLanguage,
  handleSubmit: _handleSubmit,
}: Props<T>) => {
  const { t } = useTranslation();
  const [showLoading, setShowLoading] = useState(false);
  const formikContext = useFormikContext<T>();

  const handleSubmit = useCallback(() => {
    _handleSubmit(formikContext);
  }, [_handleSubmit, formikContext]);

  useEffect(() => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 0);
  }, [selectedLanguage]);

  if (showLoading) {
    return <Spinner />;
  }
  return (
    <>
      <TitleField handleSubmit={handleSubmit} />
      <FormikField
        noBorder
        label={t('subjectpageForm.description')}
        name="description"
        showMaxLength
        maxLength={300}
      >
        {({ field, form: { isSubmitting } }: FieldProps<Descendant[]>) => (
          <PlainTextEditor
            id={field.name}
            {...field}
            submitted={isSubmitting}
            placeholder={t('subjectpageForm.description')}
          />
        )}
      </FormikField>
      <VisualElementField types={['image', 'video']} />
    </>
  );
};

export default SubjectpageAbout;
