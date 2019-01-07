/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import {
  FormHeader,
  FormSections,
  FormInput,
  FormRemoveButton,
} from '@ndla/forms';
import { Field } from '../../components/Fields';

const AddNotes = props => {
  const {
    name,
    submitted,
    placeholder,
    bindInput,
    labelAddNote,
    labelRemoveNote,
    labelHeading,
    labelWarningNote,
  } = props;
  const { onChange, value } = bindInput(name);

  const onNotesChange = newContributors => {
    onChange({
      target: {
        value: newContributors,
        name,
      },
    });
  };
  const addNote = () => {
    const newNotes = [].concat(value);
    newNotes.push('');
    onNotesChange(newNotes);
  };

  const removeNote = (e, index) => {
    e.preventDefault();
    const newNotes = [].concat(value);
    newNotes.splice(index, 1);
    onNotesChange(newNotes);
  };

  const handleNoteChange = (evt, index) => {
    const newNotes = [].concat(value);
    newNotes[index] = evt.target.value;
    onNotesChange(newNotes);
  };

  return (
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
              value={note}
              onChange={e => handleNoteChange(e, index)}
            />
          </div>
          <div>
            <FormRemoveButton onClick={evt => removeNote(evt, index)}>
              {labelRemoveNote}
            </FormRemoveButton>
          </div>
        </FormSections>
      ))}
      <Button outline onClick={addNote}>
        {labelAddNote}
      </Button>
    </Field>
  );
};

AddNotes.propTypes = {
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
};

export default AddNotes;
