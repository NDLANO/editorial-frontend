/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectT } from '@ndla/i18n';
import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Agreement } from '@ndla/icons/editor';
import Field from '../../../components/Field';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import AgreementFields from './AgreementFields';
import { formClasses, FormikActionButton } from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';

const getInitialValues = (agreement = {}) => ({
  id: agreement.id,
  title: agreement.title || '',
  content: agreement.content || '',
  creators: parseCopyrightContributors(agreement, 'creators'),
  processors: parseCopyrightContributors(agreement, 'processors'),
  rightsholders: parseCopyrightContributors(agreement, 'rightsholders'),
  origin:
    agreement.copyright && agreement.copyright.origin
      ? agreement.copyright.origin
      : '',
  license:
    agreement.copyright && agreement.copyright.license
      ? agreement.copyright.license.license
      : DEFAULT_LICENSE.license,
  validFrom:
    agreement.copyright && agreement.copyright.validFrom
      ? agreement.copyright.validFrom
      : undefined,
  validTo:
    agreement.copyright && agreement.copyright.validTo
      ? agreement.copyright.validTo
      : undefined,
});

const rules = {
  title: {
    required: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  content: {
    required: true,
  },
  validFrom: {
    required: true,

    dateBefore: true,
    afterKey: 'validTo',
  },
  validTo: {
    required: true,
    dateAfter: true,
    beforeKey: 'validFrom',
  },
};

class AgreementForm extends Component {
  handleSubmit = async (values, actions) => {
    const { licenses, onUpdate } = this.props;
    actions.setSubmitting(true);

    const agreementMetaData = {
      id: values.id,
      title: values.title,
      content: values.content,
      copyright: {
        license: licenses.find(license => license.license === values.license),
        origin: values.origin,
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
        validFrom: values.validFrom,
        validTo: values.validTo,
      },
    };
    await onUpdate(agreementMetaData);
    actions.setSubmitting(false);
  };

  render() {
    const { t, agreement, licenses, history } = this.props;

    const initVal = getInitialValues(agreement);
    return (
      <Formik
        initialValues={initVal}
        validateOnBlur={false}
        onSubmit={this.handleSubmit}
        enableReinitialize
        validate={values => validateFormik(values, rules, t)}>
        {({ values, isSubmitting }) => (
          <Form {...formClasses('', 'gray-background')}>
            <div {...formClasses('header', 'other')}>
              <div className="u-4/6@desktop">
                <Agreement />
                <span>
                  {values.id
                    ? t('agreementForm.title.update')
                    : t('agreementForm.title.create')}
                </span>
              </div>
            </div>
            <div
              {...formClasses(
                'content',
                '',
                'u-4/6@desktop u-push-1/6@desktop',
              )}>
              <AgreementFields licenses={licenses} />
            </div>
            <Field right>
              <FormikActionButton
                outline
                onClick={history.goBack}
                disabled={isSubmitting}>
                {t('form.abort')}
              </FormikActionButton>
              <FormikActionButton submit>{t('form.save')}</FormikActionButton>
            </Field>
          </Form>
        )}
      </Formik>
    );
  }
}

AgreementForm.propTypes = {
  agreement: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(
  injectT,
  withRouter,
)(AgreementForm);
