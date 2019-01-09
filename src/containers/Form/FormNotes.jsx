/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import {
  FormHeader,
  FormSections,
  FormInput,
  FormRemoveButton,
} from '@ndla/forms';
import { Field } from '../../components/Fields';
import FormNotesTable from './components/FormNotesTable';

class FormNotes extends Component {
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
    const newNotes = [].concat(value);
    newNotes.push('');
    this.onNotesChange(newNotes);
  }

  removeNote(e, index) {
    const { value } = this.props;
    e.preventDefault();
    const newNotes = [].concat(value);
    newNotes.splice(index, 1);
    this.onNotesChange(newNotes);
  }

  handleNoteChange(evt, index) {
    const { value } = this.props;
    const newNotes = [].concat(value);
    newNotes[index] = { ...value[index], note: evt.target.value };
    this.onNotesChange(newNotes);
  }

  render() {
    const {
      submitted,
      placeholder,
      value,
      labelAddNote,
      labelRemoveNote,
      labelHeading,
      labelWarningNote,
    } = this.props;

    return (
      <Fragment>
        <FormNotesTable value={value} />
        <Field>
          <FormHeader title={labelHeading} width={3 / 4} />
          {value.map((note, index) => (
            <FormSections
              key={/* eslint-disable */ `notes_${index}` /* eslint-enable */}>
              <div>
                <FormInput
                  warningText={submitted && note === '' ? labelWarningNote : ''}
                  container="div"
                  type="text"
                  focusOnMount
                  placeholder={placeholder}
                  value={note.note}
                  onChange={e => this.handleNoteChange(e, index)}
                />
              </div>
              <div>
                <FormRemoveButton onClick={evt => this.removeNote(evt, index)}>
                  {labelRemoveNote}
                </FormRemoveButton>
              </div>
            </FormSections>
          ))}
          <Button outline onClick={this.addNote}>
            {labelAddNote}
          </Button>
        </Field>
      </Fragment>
    );
  }
}

FormNotes.propTypes = {
  name: PropTypes.string.isRequired,
  labelHeading: PropTypes.string.isRequired,
  bindInput: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  labelRemoveNote: PropTypes.string.isRequired,
  labelAddNote: PropTypes.string.isRequired,
  labelWarningNote: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({}),
};

export default FormNotes;
