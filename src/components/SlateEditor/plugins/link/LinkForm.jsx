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
import { injectT } from '@ndla/i18n';
import { compose } from 'redux';
import { Field, FieldErrorMessages, getField } from '../../../Fields';
import validateSchema from '../../../validateSchema';
import { SchemaShape, LinkShape } from '../../../../shapes';
import { toolbarClasses } from '../SlateToolbar/SlateToolbar'; // TODO: Remove depdency
import reformed from '../../../reformed';

export const getInitialModel = (link = {}) => ({
  text: link.text || '',
  title: link.title || '',
  href: link.href || '',
  checkbox: link.checkbox || false,
});

class LinkForm extends Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(evt) {
    evt.preventDefault();
    const { onSave, model, validationErrors, setSubmitted } = this.props;
    if (!validationErrors.isValid) {
      setSubmitted(true);
      return;
    }

    onSave(model);
  }

  render() {
    const {
      t,
      validationErrors,
      submitted,
      bindInput,
      isEdit,
      onRemove,
      onClose,
    } = this.props;
    return (
      <form>
        <Field>
          <label htmlFor="text">{t('form.content.link.text')}</label>
          <input type="text" {...bindInput('text')} />
          <FieldErrorMessages
            label={t('form.content.link.text')}
            field={getField('text', validationErrors)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="href">{t('form.content.link.href')}</label>
          <input type="text" {...bindInput('href')} />
          <FieldErrorMessages
            label={t('form.content.link.href')}
            field={getField('href', validationErrors)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="title">{t('form.content.link.title')}</label>
          <input type="text" {...bindInput('title')} />
          <FieldErrorMessages
            label={t('form.content.link.title')}
            field={getField('title', validationErrors)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="checkbox">{t('form.content.link.newTab')}</label>

          <input
            css={{ appearance: 'checkbox !important' }}
            type="checkbox"
            {...bindInput('checkbox', 'checkbox')}
          />
          <FieldErrorMessages
            label={t('form.content.link.newTab')}
            field={getField('checkbox', validationErrors)}
            submitted={submitted}
          />
        </Field>
        <Field right>
          <div {...toolbarClasses('link-actions')}>
            {isEdit ? (
              <Button onClick={onRemove}>
                {t('form.content.link.remove')}
              </Button>
            ) : (
              ''
            )}
            <Button outline onClick={onClose}>
              {t('form.abort')}
            </Button>
            <Button type="button" onClick={this.handleSave}>
              {isEdit
                ? t('form.content.link.update')
                : t('form.content.link.insert')}
            </Button>
          </div>
        </Field>
      </form>
    );
  }
}

LinkForm.propTypes = {
  model: LinkShape.isRequired,
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
