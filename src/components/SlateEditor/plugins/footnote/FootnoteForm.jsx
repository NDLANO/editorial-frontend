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
import { SchemaShape, FootnoteShape } from '../../../../shapes';
import MultiSelect from '../../../MultiSelect';
import { toolbarClasses } from '../SlateToolbar/SlateToolbar'; // TODO: Remove depdency
import reformed from '../../../reformed';

export const getInitialModel = (footnote = {}) => ({
  title: footnote.title || '',
  year: footnote.year || '',
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
          <label htmlFor="title">
            {t('learningResourceForm.fields.content.footnote.title')}
          </label>
          <input type="text" {...bindInput('title')} />
          <FieldErrorMessages
            label={t('learningResourceForm.fields.content.footnote.title')}
            field={getField('title', schema)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="year">
            {t('learningResourceForm.fields.content.footnote.year')}
          </label>
          <input type="text" {...bindInput('year')} />
          <FieldErrorMessages
            label={t('learningResourceForm.fields.content.footnote.year')}
            field={getField('year', schema)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="authors">
            {t('learningResourceForm.fields.content.footnote.authors.label')}
          </label>
          <MultiSelect
            {...bindInput('authors')}
            messages={{
              createNew: t(
                'learningResourceForm.fields.content.footnote.authors.createNew',
              ),
              emptyFilter: t(
                'learningResourceForm.fields.content.footnote.authors.emptyFilter',
              ),
              emptyList: t(
                'learningResourceForm.fields.content.footnote.authors.emptyList',
              ),
            }}
          />
          <FieldErrorMessages
            label={t(
              'learningResourceForm.fields.content.footnote.authors.label',
            )}
            field={getField('authors', schema)}
            submitted={submitted}
          />
        </Field>
        <Field>
          <label htmlFor="edition">
            {t('learningResourceForm.fields.content.footnote.edition')}
          </label>
          <input {...bindInput('edition')} type="text" />
        </Field>
        <Field>
          <label htmlFor="publisher">
            {t('learningResourceForm.fields.content.footnote.publisher')}
          </label>
          <input type="text" {...bindInput('publisher')} />
        </Field>
        <Field right>
          <div {...toolbarClasses('link-actions')}>
            {isEdit
              ? <Button onClick={onRemove}>
                  {t(
                    'learningResourceForm.fields.content.footnote.removeFootnote',
                  )}
                </Button>
              : ''}
            <Button outline onClick={onClose}>
              {t('learningResourceForm.fields.content.footnote.abort')}
            </Button>
            <Button submit>
              {t('learningResourceForm.fields.content.footnote.save')}
            </Button>
          </div>
        </Field>
      </form>
    );
  }
}

FootnoteForm.propTypes = {
  model: FootnoteShape.isRequired,
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
    title: { required: true },
    year: { required: true, minLength: 4, maxLength: 4, numeric: true },
    authors: { minItems: 1 },
  }),
)(FootnoteForm);
