/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownShortLine, CheckLine } from "@ndla/icons";
import { Button, IconButton, MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SAVE_BUTTON_ID } from "../constants";

const StyledMultiButton = styled("div", {
  base: {
    display: "flex",
    gap: "5xsmall",
    marginInlineStart: "auto",
  },
});

const StyledSaveButton = styled(Button, {
  base: {
    marginInlineStart: "auto",
  },
});

const StyledButton = styled(Button, {
  base: {
    borderRightRadius: "0",
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    borderLeftRadius: "0",
    _open: {
      "& svg": {
        transform: "rotate(180deg)",
      },
    },
  },
});

type SaveVariant = "saveAsNew" | "save";

interface SecondaryButton {
  label: "string";
  value: SaveVariant;
  disable: boolean;
}

interface Props {
  isSaving: boolean;
  showSaved: boolean;
  formIsDirty: boolean;
  hasErrors: boolean;
  onClick: (saveAsNew: boolean) => void;
  hideSecondaryButton?: boolean;
}

const SaveMultiButton = ({ isSaving, showSaved, formIsDirty, hasErrors, onClick, hideSecondaryButton }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const disabledButton = isSaving || !formIsDirty || hasErrors;
  const buttonSaveText = t(`form.${showSaved ? "saved" : "save"}`);

  const onSaveMainButton = (evt: MouseEvent<HTMLButtonElement>) => {
    if (showSaved) {
      evt.preventDefault();
      return;
    }
    onClick(false);
  };

  if (hideSecondaryButton)
    return (
      <StyledSaveButton
        id={SAVE_BUTTON_ID}
        variant={showSaved ? "success" : "primary"}
        disabled={!!disabledButton && !showSaved}
        loading={isSaving}
        onClick={onSaveMainButton}
        aria-live="polite"
      >
        {!!showSaved && <CheckLine />}
        {buttonSaveText}
      </StyledSaveButton>
    );

  const secondaryButtons: SecondaryButton[] = [
    {
      label: t("form.saveAsNewVersion"),
      value: "saveAsNew",
      disable: isSaving,
    },
    {
      label: t("form.save"),
      value: "save",
      disable: disabledButton,
    },
  ];

  const isDisabled = secondaryButtons.some((button) => !button.disable) ? hasErrors : true;

  return (
    <StyledMultiButton data-testid="saveLearningResourceButtonWrapper">
      <StyledButton
        id={SAVE_BUTTON_ID}
        variant={showSaved ? "success" : "primary"}
        disabled={!!disabledButton && !showSaved}
        loading={isSaving}
        onClick={onSaveMainButton}
        aria-live="polite"
      >
        {!!showSaved && <CheckLine />}
        {buttonSaveText}
      </StyledButton>
      <MenuRoot
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
        positioning={{
          placement: "top",
        }}
      >
        <MenuTrigger asChild>
          <StyledIconButton disabled={isDisabled} aria-label={t("form.open")} title={t("form.open")}>
            <ArrowDownShortLine />
          </StyledIconButton>
        </MenuTrigger>
        <MenuContent>
          {secondaryButtons.map((button) => (
            <MenuItem key={button.value} value={button.value} disabled={button.disable} asChild consumeCss>
              <button type="button" onClick={() => onClick(button.value === "saveAsNew")} disabled={button.disable}>
                {button.label}
              </button>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </StyledMultiButton>
  );
};

export default SaveMultiButton;
