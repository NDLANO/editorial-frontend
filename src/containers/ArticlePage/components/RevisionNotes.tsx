/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { colors } from '@ndla/core';
import FormikField from '../../../components/FormikField/FormikField';
import AddRevisionDateField from '../../FormikForm/AddRevisionDateField';

const ErrorField = styled.p`
  color: ${colors.support.red};
`;

const RevisionNotes = () => {
  const { t } = useTranslation();
  return (
    <FormikField
      name="revisionMeta"
      label={t('form.name.revisions')}
      description={t('form.revisions.description')}
      showError={false}>
      {({ field, form: { errors } }) => {
        return (
          <>
            <AddRevisionDateField
              showError={!!errors[field.name]}
              formikField={field}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
            />
            <ErrorField> {errors.revisionError} </ErrorField>
          </>
        );
      }}
    </FormikField>
  );
};

export default RevisionNotes;
