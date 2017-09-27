/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { compose } from 'redux';
import { Field, FieldErrorMessages, getField } from '../../../Fields';
import validateSchema from '../../../../components/validateSchema';
import { SchemaShape } from '../../../../shapes';
import { toolbarClasses } from '../SlateToolbar/SlateToolbar'; // TODO: Remove depdency
import reformed from '../../../reformed';

export const getInitialModel = (link = {}) => ({
  text: link.text || '',
  href: link.href || '',
});

class LinkForm extends Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(evt) {
    evt.preventDefault();
    const { onSave, model, schema, setSubmitted } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    onSave(model);
  }

  render() {
    const {
      t,
      schema,
      submitted,
      bindInput,
      isEdit,
      onRemove,
      onClose,
    } = this.props;
    return (
      <form onSubmit={this.handleSave}>
        <Field>
          <label htmlFor="text">
            {t('learningResourceForm.fields.content.link.text')}
          </label>
          <input type="text" {...bindInput('text')} />
          <FieldErrorMessages
            label={t('learningResourceForm.fields.content.link.text')}
            field={getField('text', schema)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="href">
            {t('learningResourceForm.fields.content.link.href')}
          </label>
          <input type="text" {...bindInput('href')} />
          <FieldErrorMessages
            label={t('learningResourceForm.fields.content.link.href')}
            field={getField('href', schema)}
            submitted={submitted}
          />
        </Field>
        <Field right>
          <div {...toolbarClasses('link-actions')}>
            {isEdit
              ? <Button onClick={onRemove}>
                  {t('learningResourceForm.fields.content.link.remove')}
                </Button>
              : ''}
            <Button outline onClick={onClose}>
              {t('form.abort')}
            </Button>
            <Button submit>
              {t('form.save')}
            </Button>
          </div>
        </Field>
      </form>
    );
  }
}

LinkForm.propTypes = {
  model: PropTypes.shape({
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
  schema: SchemaShape,
  setSubmitted: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default compose(
  injectT,
  reformed,
  validateSchema({
    text: { required: true },
    href: { required: true, url: true },
  }),
)(LinkForm);
