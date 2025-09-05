/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBlocker } from "react-router";
import { Button } from "@ndla/primitives";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../components/FormikForm";
import { MessageSeverity } from "../../interfaces";

interface Props {
  text: string;
  severity?: MessageSeverity;
  isSubmitting: boolean;
  formIsDirty: boolean;
  onContinue?: () => void;
}

export const AlertDialogWrapper = ({ text, severity, isSubmitting, formIsDirty, onContinue }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const blocker = useBlocker(!(isSubmitting || !formIsDirty));

  useEffect(() => {
    setOpen(blocker.state === "blocked");
  }, [blocker.state]);

  const onCancel = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  const onWillContinue = useCallback(() => {
    if (onContinue) onContinue();
    blocker.proceed?.();
  }, [blocker, onContinue]);

  return (
    <AlertDialog
      title={t("unsavedChanges")}
      label={t("unsavedChanges")}
      show={open}
      onCancel={onCancel}
      text={text}
      severity={severity}
    >
      <FormActionsContainer>
        <Button onClick={onCancel} variant="secondary">
          {t("form.abort")}
        </Button>
        <Button onClick={onWillContinue} variant="danger">
          {t("alertDialog.continue")}
        </Button>
      </FormActionsContainer>
    </AlertDialog>
  );
};
