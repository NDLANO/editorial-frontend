/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldRemoveButton, Label, InputV3, FieldErrorMessage } from "@ndla/forms";
import { FormControl } from "../../components/FormField";

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

const NoteWrapper = styled.li`
  display: flex;
  gap: ${spacing.small};
  margin: 0;
  padding: 0;
`;

const NotesContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  align-items: flex-start;
  list-style: none;
  margin: 0;
  padding: 0;
  div {
    width: 100%;
  }
`;

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
  const { t } = useTranslation();
  const onNotesChange = (newContributors: string[]) => {
    onChange({
      target: {
        value: newContributors,
        name,
      },
    });
  };

  const addNote = () => {
    onNotesChange([...value, ""]);
  };

  const removeNote = (e: MouseEvent<HTMLButtonElement>, noteIndexToRemove: number) => {
    e.preventDefault();
    onNotesChange(value.filter((_, index) => index !== noteIndexToRemove));
  };

  const handleNoteChange = (evt: FormEvent<HTMLInputElement>, index: number) => {
    const newNotes = [...value];
    newNotes[index] = evt.currentTarget.value;
    onNotesChange(newNotes);
  };

  return (
    <NotesContainer>
      {value.map((note, index) => (
        <FormControl key={`note-${index}`} isInvalid={showError && note === ""}>
          <Label visuallyHidden>{`${t("form.notes.history.note")} ${index + 1}`}</Label>
          <NoteWrapper>
            <InputV3
              type="text"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              placeholder={placeholder}
              value={note}
              data-testid="notesInput"
              onChange={(e) => handleNoteChange(e, index)}
            />
            <FieldRemoveButton onClick={(evt) => removeNote(evt, index)}>{labelRemoveNote}</FieldRemoveButton>
          </NoteWrapper>
          <FieldErrorMessage>{labelWarningNote}</FieldErrorMessage>
        </FormControl>
      ))}
      <ButtonV2 variant="outline" onClick={addNote} data-testid="addNote">
        {labelAddNote}
      </ButtonV2>
    </NotesContainer>
  );
};

export default AddNotesField;
