/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
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

const marginLeftStyle = css`
  margin-left: 0.2rem;
`;

const linkValidationRules = {
  text: { required: true },
  href: { required: true, urlOrNumber: true },
};

const getLinkFieldStyle = node => {
  const isExternalResource = node.href;
  const isNdlaResource = node.resource === 'content-link';

  if (isNdlaResource) {
    return css`
      input {
        background-color: ${colors.tasksAndActivities.background};
        background-color: ${colors.brand.light};
      }
    `;
  } else if (isExternalResource) {
    return css`
      input {
        background-color: ${colors.brand.light};
        background-color: ${colors.tasksAndActivities.background};
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
    const { t, isEdit, link, onRemove, onClose, node } = this.props;
    return (
      <Formik
        initialValues={getInitialValues(link)}
        onSubmit={this.handleSave}
        validate={values => validateFormik(values, linkValidationRules, t, 'linkForm')}>
        {({ submitForm }) => (
          <Form data-cy="link_form">
            <FormikField name="text" type="text" label={t('form.content.link.text')} />
            <FormikField
              name="href"
              description={t('form.content.link.description', {
                url: config.ndlaFrontendDomain,
              })}
              label={t('form.content.link.href')}
              css={getLinkFieldStyle(node)}
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
