/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Formik, Form, FormikHelpers } from 'formik';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import Field from '../../../Field';
import config from '../../../../config';
import validateFormik from '../../../formikValidationSchema';
import FormikField from '../../../FormikField';
import { Checkbox } from '../../../../containers/FormikForm';
import {
  isNDLAArticleUrl,
  isNDLAEdPathUrl,
  isNDLALearningPathUrl,
  isNDLATaxonomyUrl,
  isPlainId,
} from './EditLink';
import { isUrl } from '../../../validators';
import { Model } from './Link';

const marginLeftStyle = css`
  margin-left: 0.2rem;
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
      validate={values => validateFormik(values, linkValidationRules, t, 'linkForm')}>
      {({ submitForm, values }) => (
        <Form data-cy="link_form">
          <FormikField
            name="text"
            type="text"
            label={t('form.content.link.text')}
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
          <Field right>
            {isEdit ? <Button onClick={onRemove}>{t('form.content.link.remove')}</Button> : ''}
            <Button css={marginLeftStyle} outline onClick={onClose}>
              {t('form.abort')}
            </Button>
            <Button css={marginLeftStyle} onClick={submitForm}>
              {isEdit ? t('form.content.link.update') : t('form.content.link.insert')}
            </Button>
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default LinkForm;
