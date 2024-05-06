/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IQualityEvaluation } from "@ndla/types-backend/draft-api";
import { Text } from "@ndla/typography";
import QualityEvaluationForm from "./QualityEvaluationForm";

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.nsmall};
  padding-top: 0px;
`;

interface Props {
  qualityEvaluation: IQualityEvaluation | undefined;
}

const QualityEvaluationModal = ({ qualityEvaluation }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <IconButtonV2
          title={t("qualityEvaluationForm.edit")}
          aria-label={t("qualityEvaluationForm.edit")}
          variant="solid"
          colorTheme="primary"
          size="xsmall"
        >
          <Pencil />
        </IconButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("qualityEvaluationForm.modalTitle")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <StyledModalBody>
          <Text margin="none" textStyle="meta-text-small">
            {t("qualityEvaluationForm.description")}
          </Text>
          <QualityEvaluationForm qualityEvaluation={qualityEvaluation} setOpen={setOpen} />
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QualityEvaluationModal;
