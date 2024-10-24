/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "@ndla/primitives";
import { ThemeNames } from "./ThemeEditor";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { FormActionsContainer } from "../../../components/FormikForm";

const blankTheme = {
  nb: "",
  nn: "",
  en: "",
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

const ThemeNameDialog = ({ initialTheme = {}, activateButton, messages, onSaveTheme, createTheme }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [newTheme, setNewTheme] = useState({
    ...blankTheme,
    ...initialTheme,
  });

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>{activateButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{messages.title}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          {Object.entries(newTheme).map(([key, value]) => (
            <FieldRoot key={key}>
              <FieldLabel>{t(`languages.${key}`)}</FieldLabel>
              <FieldInput
                type="text"
                value={value}
                onChange={(e) => {
                  setNewTheme({
                    ...newTheme,
                    [key]: e.currentTarget.value,
                  });
                }}
                placeholder={t("ndlaFilm.editor.groupNamePlaceholder", {
                  lang: t(`languages.${key}`),
                })}
              />
            </FieldRoot>
          ))}

          <FormActionsContainer>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {messages.cancel}
            </Button>
            <Button
              onClick={() => {
                onSaveTheme(newTheme);
                if (createTheme) setNewTheme(blankTheme);
                setOpen(false);
              }}
            >
              {messages.save}
            </Button>
          </FormActionsContainer>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default ThemeNameDialog;
