/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../components/FormikForm";

interface Props {
  show: boolean;
  onClose: () => void;
}

const UnpublishedConceptsAlertDialog = ({ show, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <AlertDialog
      show={show}
      severity="warning"
      onCancel={onClose}
      label={t("alertModal.unpublishedConcepts")}
      text={t("alertModal.unpublishedConcepts")}
    >
      <FormActionsContainer>
        <Button onClick={onClose}>OK</Button>
      </FormActionsContainer>
    </AlertDialog>
  );
};

export default UnpublishedConceptsAlertDialog;
