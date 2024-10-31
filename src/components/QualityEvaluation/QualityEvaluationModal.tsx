/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import QualityEvaluationForm from "./QualityEvaluationForm";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.nsmall};
  padding-top: 0px;
`;

interface Props {
  articleType?: string;
  article?: IArticle;
  taxonomy?: Node[];
  iconButtonColor?: "light" | "primary";
  revisionMetaField?: FieldInputProps<ArticleFormType["revisionMeta"]>;
  revisionMetaHelpers?: FieldHelperProps<ArticleFormType["revisionMeta"]>;
  updateNotes?: (art: IUpdatedArticle) => Promise<IArticle>;
}

const QualityEvaluationModal = ({
  articleType,
  article,
  taxonomy,
  iconButtonColor = "light",
  revisionMetaField,
  revisionMetaHelpers,
  updateNotes,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const resourceTranslation =
    articleType === "topic-article" ? t("qualityEvaluationForm.topicArticle") : t("qualityEvaluationForm.article");
  const title = taxonomy?.length ? t("qualityEvaluationForm.edit") : t("qualityEvaluationForm.disabled");

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <IconButtonV2
          title={title}
          aria-label={title}
          variant="solid"
          colorTheme={iconButtonColor}
          size="xsmall"
          disabled={!taxonomy?.length}
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
            {t("qualityEvaluationForm.description", { resource: resourceTranslation })}
          </Text>
          {taxonomy && (
            <QualityEvaluationForm
              setOpen={setOpen}
              taxonomy={taxonomy}
              revisionMetaField={revisionMetaField}
              revisionMetaHelpers={revisionMetaHelpers}
              updateNotes={updateNotes}
              article={article}
            />
          )}
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QualityEvaluationModal;
