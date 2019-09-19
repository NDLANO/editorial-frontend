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
import { FieldSection, Input, FieldRemoveButton } from '@ndla/forms';
import Field from '../../components/Field';
import { NewArticleShape } from '../../shapes';

class FormikAddNotes extends Component {
  constructor() {
    super();
    this.onNotesChange = this.onNotesChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  onNotesChange(newContributors) {
    const { onChange, name } = this.props;
    onChange({
      target: {
        value: newContributors,
        name,
      },
    });
  }

  addNote() {
    const { value } = this.props;
    this.onNotesChange([...value, '']);
  }

  removeNote(e, noteIndexToRemove) {
    const { value } = this.props;
    e.preventDefault();
    this.onNotesChange(
      value.filter((note, index) => index !== noteIndexToRemove),
    );
  }

  handleNoteChange(evt, index) {
    const { value } = this.props;
    const newNotes = [].concat(value);
    newNotes[index] = evt.target.value;
    this.onNotesChange(newNotes);
  }

  render() {
    const {
      placeholder,
      value,
      labelAddNote,
      labelRemoveNote,
      labelWarningNote,
      showError,
    } = this.props;

    return (
      <Field>
        {value.map((note, index) => (
          <FieldSection
            key={/* eslint-disable */ `notes_${index}` /* eslint-enable */}>
            <div>
              <Input
                warningText={showError && note === '' ? labelWarningNote : ''}
                container="div"
                type="text"
                focusOnMount
                placeholder={placeholder}
                value={note}
                data-testid="notesInput"
                onChange={e => this.handleNoteChange(e, index)}
              />
            </div>
            <div>
              <FieldRemoveButton onClick={evt => this.removeNote(evt, index)}>
                {labelRemoveNote}
              </FieldRemoveButton>
            </div>
          </FieldSection>
        ))}
        <Button outline onClick={this.addNote} data-testid="addNote">
          {labelAddNote}
        </Button>
      </Field>
    );
  }
}

FormikAddNotes.defaultProps = {
  article: {
    notes: [],
  },
};

FormikAddNotes.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  labelRemoveNote: PropTypes.string.isRequired,
  labelAddNote: PropTypes.string.isRequired,
  labelWarningNote: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  article: NewArticleShape,
  showError: PropTypes.bool,
};

export default FormikAddNotes;
