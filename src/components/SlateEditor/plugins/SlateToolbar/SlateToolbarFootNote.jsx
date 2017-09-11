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
import { Cross } from 'ndla-ui/icons';
import { Field } from '../../../Fields';
import MultiSelect from '../../../MultiSelect';
import { toolbarClasses } from './SlateToolbar';

class SlateToolbarFootNote extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      year: '',
      authors: [],
      edition: '',
      publisher: '',
      isEdit: false,
      initialized: false,
    };
    this.onContentChange = this.onContentChange.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    // this.addFootNoteData = this.addFootNoteData.bind(this);
    // this.countFootNotes = this.countFootNotes.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextState.initialized) {
      this.addFootNoteData();
    }
  }

  onContentChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    this.setState({
      [name]: value,
    });
  }

  onCloseDialog() {
    this.setState({
      title: '',
      year: '',
      authors: [],
      edition: '',
      publisher: '',
      isEdit: false,
    });
    this.props.closeDialog();
  }

  // countFootNotes() {
  //   const { state } = this.props;
  //   const { document } = state;
  // }

  // addFootNoteData() {
  //   const { state } = this.props;
  // }

  render() {
    const { title, year, authors, edition, publisher, isEdit } = this.state;
    const { showDialog, t } = this.props;
    return (
      <div {...toolbarClasses('link-overlay', showDialog ? 'open' : 'hidden')}>
        <div {...toolbarClasses('link-dialog')}>
          <Button
            stripped
            {...toolbarClasses('close-dialog')}
            onClick={this.onCloseDialog}>
            <Cross />
          </Button>
          <h2>
            {t(
              `learningResourceForm.fields.content.footNote.${isEdit
                ? 'changeTitle'
                : 'addTitle'}`,
            )}
          </h2>
          <Field>
            <label htmlFor="title">
              {t('learningResourceForm.fields.content.footNote.title')}
            </label>
            <input
              name="title"
              type="title"
              value={title}
              onChange={this.onContentChange}
            />
          </Field>
          <Field>
            <label htmlFor="year">
              {t('learningResourceForm.fields.content.footNote.year')}
            </label>
            <input
              name="year"
              type="year"
              value={year}
              onChange={this.onContentChange}
            />
          </Field>
          <Field>
            <label htmlFor="authors">
              {t('learningResourceForm.fields.content.footNote.authors.label')}
            </label>
            <MultiSelect
              name="authors"
              value={authors}
              data={authors}
              onChange={this.onContentChange}
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
            <input
              name="edition"
              type="edition"
              value={edition}
              onChange={this.onContentChange}
            />
          </Field>
          <Field>
            <label htmlFor="publisher">
              {t('learningResourceForm.fields.content.footNote.publisher')}
            </label>
            <input
              name="publisher"
              type="publisher"
              value={publisher}
              onChange={this.onContentChange}
            />
          </Field>
          <Field right>
            <div {...toolbarClasses('link-actions')}>
              {/* {this.state.nodeType === 'footNote'
                ? <Button onClick={this.removeUrl}>
                    {t('learningResourceForm.fields.content.footNote.removeFootNote')}
                  </Button>
                : ''} */}
              <Button outline onClick={this.onCloseDialog}>
                {t('learningResourceForm.fields.content.footNote.abort')}
              </Button>
              <Button onClick={this.countFootNotes}>
                {t('learningResourceForm.fields.content.footNote.save')}
              </Button>
            </div>
          </Field>
        </div>
      </div>
    );
  }
}

SlateToolbarFootNote.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
};

export default injectT(SlateToolbarFootNote);
