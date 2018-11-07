/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { injectT } from '@ndla/i18n';
import Button from 'ndla-button';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Agreement } from '@ndla/icons/editor';
import BEMHelper from 'react-bem-helper';
import reformed from '../../../components/reformed';
import validateSchema from '../../../components/validateSchema';
import { Field } from '../../../components/Fields';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
} from '../../../util/formHelper';
import { SchemaShape } from '../../../shapes';
import AgreementFields from './AgreementFields';

export const getInitialModel = (agreement = {}) => ({
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
      ? new Date(agreement.copyright.validFrom)
      : undefined,
  validTo:
    agreement.copyright && agreement.copyright.validTo
      ? new Date(agreement.copyright.validTo)
      : undefined,
});

const classes = new BEMHelper({
  name: 'form',
  prefix: 'c-',
});

class AgreementForm extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const { model, schema, licenses, setSubmitted, onUpdate } = this.props;

    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    const agreementMetaData = {
      id: model.id,
      title: model.title,
      content: model.content,
      copyright: {
        license: licenses.find(license => license.license === model.license),
        origin: model.origin,
        creators: model.creators,
        processors: model.processors,
        rightsholders: model.rightsholders,
        validFrom: model.validFrom,
        validTo: model.validTo,
      },
    };
    onUpdate(agreementMetaData);
  }

  render() {
    const {
      t,
      bindInput,
      schema,
      model,
      submitted,
      licenses,
      isSaving,
      history,
    } = this.props;
    const commonFieldProps = { bindInput, schema, submitted };

    return (
      <form
        onSubmit={event => this.handleSubmit(event)}
        {...classes('', 'gray-background')}>
        <div {...classes('header', 'other')}>
          <div className="u-4/6@desktop">
            <Agreement />
            <span>
              {model.id
                ? t('agreementForm.title.update')
                : t('agreementForm.title.create')}
            </span>
          </div>
        </div>
        <div {...classes('content', '', 'u-4/6@desktop u-push-1/6@desktop')}>
          <AgreementFields
            classes={classes}
            commonFieldProps={commonFieldProps}
            licenses={licenses}
            bindInput={bindInput}
          />
        </div>
        <Field right {...classes('form-actions')}>
          <Button outline onClick={history.goBack} disabled={isSaving}>
            {t('form.abort')}
          </Button>
          <Button submit disabled={false}>
            {t('form.save')}
          </Button>
        </Field>
      </form>
    );
  }
}

AgreementForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  schema: SchemaShape,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(
  injectT,
  withRouter,
  reformed,
  validateSchema({
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
      dateBefore: true,
      afterKey: 'validTo',
    },
    validTo: {
      dateAfter: true,
      beforeKey: 'validFrom',
    },
  }),
)(AgreementForm);
