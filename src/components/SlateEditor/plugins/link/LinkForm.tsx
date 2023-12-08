/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, Form, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import {
  isNDLAArticleUrl,
  isNDLAEdPathUrl,
  isNDLALearningPathUrl,
  isNDLATaxonomyUrl,
  isPlainId,
} from './EditLink';
import { Model } from './Link';
import config from '../../../../config';
import { Checkbox } from '../../../../containers/FormikForm';
import FormikField from '../../../FormikField';
import validateFormik from '../../../formikValidationSchema';
import { isUrl } from '../../../validators';

const StyledField = styled.div`
  gap: ${spacing.xsmall};
  display: flex;
  justify-content: flex-end;
`;

const linkValidationRules = {
  text: { required: true },
  href: { required: true, urlOrNumber: true },
};

const getLinkFieldStyle = (input: string) => {
  if (
    isNDLAArticleUrl(input) ||
    isNDLAEdPathUrl(input) ||
    isNDLALearningPathUrl(input) ||
    isNDLATaxonomyUrl(input) ||
    isPlainId(input)
  ) {
    return css`
      input {
        background-color: ${colors.brand.light};
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        box-shadow: 0 0 0 30px ${colors.brand.light} inset;
      }
    `;
  } else if (isUrl(input)) {
    return css`
      input {
        background-color: ${colors.tasksAndActivities.background};
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        box-shadow: 0 0 0 30px ${colors.tasksAndActivities.background} inset;
      }
    `;
  } else {
    return '';
  }
};

export const getInitialValues = (link: Partial<Model> = {}): Model => ({
  text: link.text || '',
  href: link.href || '',
  checkbox: link.checkbox || false,
});

interface Props {
  onSave: (model: Model) => void;
  link: Partial<Model>;
  isEdit: boolean;
  onRemove: () => void;
  onClose: () => void;
}

const LinkForm = ({ onSave, link, isEdit, onRemove, onClose }: Props) => {
  const { t } = useTranslation();

  const handleSave = async (values: Model, actions: FormikHelpers<Model>) => {
    actions.setSubmitting(true);
    onSave(values);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(link)}
      onSubmit={handleSave}
      validate={(values) => validateFormik(values, linkValidationRules, t, 'linkForm')}
    >
      {({ submitForm, values }) => (
        <Form data-testid="link_form">
          <FormikField
            name="text"
            type="text"
            label={t('form.content.link.text')}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
          />
          <FormikField
            name="href"
            description={t('form.content.link.description', {
              url: config.ndlaFrontendDomain,
              interpolation: { escapeValue: false },
            })}
            label={t('form.content.link.href')}
            css={getLinkFieldStyle(values.href)}
          />
          <Checkbox name="checkbox" label={t('form.content.link.newTab')} />
          <StyledField>
            {isEdit ? <ButtonV2 onClick={onRemove}>{t('form.content.link.remove')}</ButtonV2> : ''}
            <ButtonV2 variant="outline" onClick={onClose}>
              {t('form.abort')}
            </ButtonV2>
            <ButtonV2 onClick={submitForm}>
              {isEdit ? t('form.content.link.update') : t('form.content.link.insert')}
            </ButtonV2>
          </StyledField>
        </Form>
      )}
    </Formik>
  );
};

export default LinkForm;
