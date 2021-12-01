/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import Field from '../../../Field';
import config from '../../../../config';
import { LinkShape } from '../../../../shapes';
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

const marginLeftStyle = css`
  margin-left: 0.2rem;
`;

const linkValidationRules = {
  text: { required: true },
  href: { required: true, urlOrNumber: true },
};

const getLinkFieldStyle = input => {
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

export const getInitialValues = (link = {}) => ({
  text: link.text || '',
  href: link.href || '',
  checkbox: link.checkbox || false,
});

class LinkForm extends Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
  }

  async handleSave(values, actions) {
    const { onSave } = this.props;
    actions.setSubmitting(true);
    onSave(values);
    actions.setSubmitting(false);
  }

  render() {
    const { t, isEdit, link, onRemove, onClose } = this.props;
    return (
      <Formik
        initialValues={getInitialValues(link)}
        onSubmit={this.handleSave}
        validate={values => validateFormik(values, linkValidationRules, t, 'linkForm')}>
        {({ submitForm, values }) => (
          <Form data-cy="link_form">
            <FormikField name="text" type="text" label={t('form.content.link.text')} />
            <FormikField
              name="href"
              description={t('form.content.link.description', {
                url: config.ndlaFrontendDomain,
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
  }
}

LinkForm.propTypes = {
  link: LinkShape.isRequired,
  isEdit: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  node: PropTypes.any,
};

export default withTranslation()(LinkForm);
