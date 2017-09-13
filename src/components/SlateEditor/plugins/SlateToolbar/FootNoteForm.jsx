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

export const getInitialModel = (footNote = {}) => ({
  title: footNote.title || '',
  year: footNote.year || '',
  authors: footNote.authors || [],
  edition: footNote.edition || '',
  publisher: footNote.publisher || '',
  type: footNote.type || '',
});

class FootNoteForm extends Component {
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
            {t('learningResourceForm.fields.content.footNote.title')}
          </label>
          <input type="text" {...bindInput('title')} />
        </Field>
        <Field>
          <label htmlFor="year">
            {t('learningResourceForm.fields.content.footNote.year')}
          </label>
          <input type="text" {...bindInput('year')} />
        </Field>
        <Field>
          <label htmlFor="authors">
            {t('learningResourceForm.fields.content.footNote.authors.label')}
          </label>
          <MultiSelect
            {...bindInput('authors')}
            messages={{
              createNew: t(
                'learningResourceForm.fields.content.footNote.authors.createNew',
              ),
              emptyFilter: t(
                'learningResourceForm.fields.content.footNote.authors.emptyFilter',
              ),
              emptyList: t(
                'learningResourceForm.fields.content.footNote.authors.emptyList',
              ),
            }}
          />
        </Field>
        <Field>
          <label htmlFor="edition">
            {t('learningResourceForm.fields.content.footNote.edition')}
          </label>
          <input {...bindInput('edition')} type="text" />
        </Field>
        <Field>
          <label htmlFor="publisher">
            {t('learningResourceForm.fields.content.footNote.publisher')}
          </label>
          <input type="text" {...bindInput('publisher')} />
        </Field>
        <Field right>
          <div {...toolbarClasses('link-actions')}>
            {isEdit
              ? <Button onClick={onRemove}>
                  {t(
                    'learningResourceForm.fields.content.footNote.removeFootNote',
                  )}
                </Button>
              : ''}
            <Button outline onClick={onClose}>
              {t('learningResourceForm.fields.content.footNote.abort')}
            </Button>
            <Button onClick={this.handleSave}>
              {t('learningResourceForm.fields.content.footNote.save')}
            </Button>
          </div>
        </Field>
      </div>
    );
  }
}

FootNoteForm.propTypes = {
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

export default compose(injectT, reformed)(FootNoteForm);
