/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { Formik, Form } from 'formik';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import Field from '../../../Field';
import { FootnoteShape } from '../../../../shapes';
import MultiSelectDropdown from '../../../Dropdown/MultiSelectDropdown';
import FormikField from '../../../FormikField';
import validateFormik from '../../../formikValidationSchema';

const marginLeftStyle = css`
  margin-left: 0.2rem;
`;

const rules = {
  title: { required: true },
  year: { required: true, minLength: 4, maxLength: 4, numeric: true },
  authors: { minItems: 1 },
};

const getInitialValues = (footnote = {}) => ({
  title: footnote.title || '',
  year: footnote.year || '',
  resource: footnote.resource || 'footnote',
  authors: footnote.authors || [],
  edition: footnote.edition || '',
  publisher: footnote.publisher || '',
  type: footnote.type || '',
});

class FootnoteForm extends Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
  }

  async handleSave(values, actions) {
    const { setSubmitting } = actions;
    const { onSave } = this.props;
    setSubmitting(true);
    onSave(values);
    setSubmitting(false);
  }

  render() {
    const { t, isEdit, footnote, onRemove, onClose } = this.props;
    return (
      <Formik
        initialValues={getInitialValues(footnote)}
        onSubmit={this.handleSave}
        validate={values => validateFormik(values, rules, t, 'footnoteForm')}>
        {({ submitForm }) => (
          <Form>
            <FormikField
              name="title"
              type="text"
              label={t('form.content.footnote.title')}
            />
            <FormikField
              name="year"
              type="text"
              label={t('form.content.footnote.year')}
            />
            <FormikField
              name="authors"
              label={t('form.content.footnote.authors.label')}
              obligatory>
              {({ field }) => (
                <MultiSelectDropdown {...field} valueField="authors" />
              )}
            </FormikField>
            <FormikField
              name="edition"
              type="text"
              label={t('form.content.footnote.edition')}
            />

            <FormikField
              name="publisher"
              type="text"
              label={t('form.content.footnote.publisher')}
            />
            <Field right>
              {isEdit && (
                <Button onClick={onRemove}>
                  {t('form.content.footnote.removeFootnote')}
                </Button>
              )}
              <Button css={marginLeftStyle} outline onClick={onClose}>
                {t('form.abort')}
              </Button>
              <Button
                css={marginLeftStyle}
                data-cy="save_footnote"
                type="button"
                onClick={submitForm}>
                {t('form.save')}
              </Button>
            </Field>
          </Form>
        )}
      </Formik>
    );
  }
}

FootnoteForm.propTypes = {
  footnote: FootnoteShape.isRequired,
  isEdit: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default injectT(FootnoteForm);
