/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Plus, Cross } from 'ndla-icons/action';
import { Field, FieldErrorMessages, getField, classes } from '../../components/Fields';
import CirclePlusButton from '../../components/CirclePlusButton';

const AddNotes = props => {
  const {
    name,
    label,
    schema,
    submitted,
    placeholder,
    bindInput,
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
      <label htmlFor={name}>{label}</label>
      {value.map((note, index) => (
        <div key={/* eslint-disable */ `notes_${index}` /* eslint-enable */} {...classes('d', 'flex')}>
          <input value={note} placeholder={placeholder} onChange={e => handleNoteChange(e, index)} />
          <Button stripped onClick={e => removeNote(e, index)}>
            <Cross className="c-icon--medium" />
          </Button>
        </div>
      ))}
      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
        submitted={submitted}
      />
      <CirclePlusButton onClick={addNote}>
        <Plus className="c-icon--medium" />
      </CirclePlusButton>
    </Field>
  );
};

AddNotes.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  bindInput: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
};

export default AddNotes;
