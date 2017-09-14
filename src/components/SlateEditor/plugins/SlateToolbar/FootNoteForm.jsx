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
import { Field } from '../../../Fields';
import MultiSelect from '../../../MultiSelect';
import { toolbarClasses } from './SlateToolbar';
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

  handleSave() {
    const { onSave, model } = this.props;
    onSave(model);
  }

  render() {
    const { t, bindInput, isEdit, onRemove, onClose } = this.props;
    return (
      <div>
        <Field>
          <label htmlFor="title">
            {t('learningResourceForm.fields.content.footnote.title')}
          </label>
          <input type="text" {...bindInput('title')} />
        </Field>
        <Field>
          <label htmlFor="year">
            {t('learningResourceForm.fields.content.footnote.year')}
          </label>
          <input type="text" {...bindInput('year')} />
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
            <Button onClick={this.handleSave}>
              {t('learningResourceForm.fields.content.footnote.save')}
            </Button>
          </div>
        </Field>
      </div>
    );
  }
}

FootnoteForm.propTypes = {
  model: PropTypes.shape({
    title: PropTypes.string,
    year: PropTypes.string,
    authors: PropTypes.array,
    edition: PropTypes.string,
    publisher: PropTypes.string,
  }),
  isEdit: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default compose(injectT, reformed)(FootnoteForm);
