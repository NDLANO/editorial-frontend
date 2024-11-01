/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { History, Blocker, Transition } from "history";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UNSAFE_NavigationContext, useNavigate, Location } from "react-router-dom";
import { Button } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { supportedLanguages } from "../../i18n2";
import { MessageSeverity } from "../../interfaces";

interface Props {
  text: string;
  severity?: MessageSeverity;
  isSubmitting: boolean;
  formIsDirty: boolean;
  onContinue?: () => void;
}

// V6 has not added useBlocker hook yet. Source taken from react-router.
const useBlocker = (blocker: Blocker, when = true): void => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;
    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
};

export const AlertDialogWrapper = ({ text, severity, isSubmitting, formIsDirty, onContinue }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [discardChanges, setDiscardChanges] = useState(false);
  const [nextLocation, setNextLocation] = useState<Location | undefined>(undefined);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const shouldBlock = !(isSubmitting || !formIsDirty || discardChanges);

  useEffect(() => {
    if (!shouldBlock && nextLocation) {
      navigate(nextLocation);
    }
  }, [shouldBlock, nextLocation, navigate]);

  useBlocker((transition) => {
    if (shouldBlock) {
      // transition does not respect basename. Filter out basename until it is fixed.
      const pathRegex = new RegExp(supportedLanguages.map((l) => `/${l}/`).join("|"));
      const pathname = transition.location.pathname.replace(pathRegex, "/");
      setOpenModal(true);
      setNextLocation({ ...transition.location, pathname });
    } else {
      setDiscardChanges(false);
    }
  }, shouldBlock);

  const onCancel = () => {
    setNextLocation(undefined);
    setOpenModal(false);
  };

  const onWillContinue = () => {
    if (onContinue) onContinue();
    setDiscardChanges(true);
    setOpenModal(false);
  };

  return (
    <AlertDialog
      title={t("unsavedChanges")}
      label={t("unsavedChanges")}
      show={openModal}
      onCancel={onCancel}
      text={text}
      severity={severity}
    >
      <HStack gap="xsmall" justify="flex-end">
        <Button onClick={onCancel} variant="secondary">
          {t("form.abort")}
        </Button>
        <Button onClick={onWillContinue} variant="danger">
          {t("alertModal.continue")}
        </Button>
      </HStack>
    </AlertDialog>
  );
};
