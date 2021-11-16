/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent } from 'react';
import Button from '@ndla/button';
import { FieldSection, Input, FieldRemoveButton } from '@ndla/forms';
import Field from '../../components/Field';

interface Props {
  name: string;
  placeholder?: string;
  labelRemoveNote: string;
  labelAddNote: string;
  labelWarningNote?: string;
  onChange: Function;
  value: string[];
  showError?: boolean;
}

const AddNotesField = ({
  name,
  placeholder,
  labelAddNote,
  labelRemoveNote,
  labelWarningNote,
  onChange,
  value,
  showError,
}: Props) => {
  const onNotesChange = (newContributors: string[]) => {
    onChange({
      target: {
        value: newContributors,
        name,
      },
    });
  };

  const addNote = () => {
    onNotesChange([...value, '']);
  };

  const removeNote = (e: Event, noteIndexToRemove: number) => {
    e.preventDefault();
    onNotesChange(value.filter((_, index) => index !== noteIndexToRemove));
  };

  const handleNoteChange = (evt: FormEvent<HTMLInputElement>, index: number) => {
    const newNotes = [...value];
    newNotes[index] = evt.currentTarget.value;
    onNotesChange(newNotes);
  };
  return (
    <Field>
      {value.map((note, index) => (
        <FieldSection key={`notes_${index}`}>
          <div>
            <Input
              warningText={showError && note === '' ? labelWarningNote : ''}
              container="div"
              type="text"
              focusOnMount
              placeholder={placeholder}
              value={note}
              data-testid="notesInput"
              onChange={(e: FormEvent<HTMLInputElement>) => handleNoteChange(e, index)}
              white
            />
          </div>
          <div>
            <FieldRemoveButton onClick={(evt: Event) => removeNote(evt, index)}>
              {labelRemoveNote}
            </FieldRemoveButton>
          </div>
        </FieldSection>
      ))}
      <Button outline onClick={addNote} data-testid="addNote">
        {labelAddNote}
      </Button>
    </Field>
  );
};

export default AddNotesField;
