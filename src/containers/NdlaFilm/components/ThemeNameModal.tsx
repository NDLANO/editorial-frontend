/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { InputV3, Label } from "@ndla/forms";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { ThemeNames } from "./ThemeEditor";
import { FormControl } from "../../../components/FormField";

const blankTheme = {
  nb: "",
  nn: "",
  en: "",
};

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const initialState = (initialTheme = {}) => {
  return {
    ...blankTheme,
    ...initialTheme,
  };
};

interface Props {
  onSaveTheme: (newTheme: ThemeNames) => void;
  initialTheme?: ThemeNames;
  activateButton: ReactElement;
  messages: {
    save: string;
    cancel: string;
    title: string;
  };
  createTheme?: boolean;
}

const ThemeNameModal = ({ initialTheme, activateButton, messages, onSaveTheme, createTheme }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [newTheme, setNewTheme] = useState(initialState(initialTheme));
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>{activateButton}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{messages.title}</ModalTitle>
        </ModalHeader>
        <StyledModalBody>
          {Object.entries(newTheme).map(([key, value]) => (
            <FormControl key={key}>
              <Label>{t(`languages.${key}`)}</Label>
              <InputV3
                type="text"
                value={value}
                onChange={(e) => {
                  setNewTheme((prev) => ({
                    ...prev,
                    [key]: e.currentTarget.value,
                  }));
                }}
                placeholder={t("ndlaFilm.editor.groupNamePlaceholder", {
                  lang: t(`languages.${key}`),
                })}
              />
            </FormControl>
          ))}
          <ButtonWrapper>
            <ModalCloseButton>
              <ButtonV2 variant="outline">{messages.cancel}</ButtonV2>
            </ModalCloseButton>
            <ButtonV2
              onClick={() => {
                onSaveTheme(newTheme);
                if (createTheme) setNewTheme(blankTheme);
                setOpen(false);
              }}
            >
              {messages.save}
            </ButtonV2>
          </ButtonWrapper>
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ThemeNameModal;
