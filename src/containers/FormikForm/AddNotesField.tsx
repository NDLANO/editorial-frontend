/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldsetLegend,
  FieldsetRoot,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  name: string;
  labelWarningNote?: string;
  onChange: (contributors: string[]) => void;
  value: string[];
  showError?: boolean;
}

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    alignItems: "flex-start",
    gap: "small",
  },
});

const NoteWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const AddNotesField = ({ labelWarningNote, onChange, value, showError }: Props) => {
  const { t } = useTranslation();
  const onNotesChange = (newContributors: string[]) => {
    onChange(newContributors);
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
    <StyledFieldsetRoot>
      <FieldsetLegend>{t("form.name.notes")}</FieldsetLegend>
      {value.map((note, index) => (
        <StyledFieldRoot key={`note-${index}`} invalid={!!showError && note === ""}>
          <FieldLabel srOnly>{`${t("form.notes.history.note")} ${index + 1}`}</FieldLabel>
          <NoteWrapper>
            <FieldInput
              type="text"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={note}
              data-testid="notesInput"
              onChange={(e) => handleNoteChange(e, index)}
              placeholder={t("form.notes.placeholder")}
            />
            <IconButton
              variant="danger"
              onClick={(e) => removeNote(e, index)}
              aria-label={t("form.notes.remove")}
              title={t("form.notes.remove")}
            >
              <DeleteBinLine />
            </IconButton>
          </NoteWrapper>
          <FieldErrorMessage>{labelWarningNote}</FieldErrorMessage>
        </StyledFieldRoot>
      ))}
      <Button variant="secondary" onClick={addNote} data-testid="addNote">
        {t("form.notes.add")}
      </Button>
    </StyledFieldsetRoot>
  );
};

export default AddNotesField;
