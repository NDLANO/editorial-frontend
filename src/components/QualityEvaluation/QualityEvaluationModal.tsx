/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogOpenChangeDetails, Portal } from "@ark-ui/react";
import { PencilLine } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Text,
} from "@ndla/primitives";
import { IArticleDTO, IUpdatedArticleDTO } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import QualityEvaluationForm from "./QualityEvaluationForm";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  articleType?: string;
  article?: IArticleDTO;
  taxonomy?: Node[];
  iconButtonColor?: "light" | "primary";
  revisionMetaField?: FieldInputProps<ArticleFormType["revisionMeta"]>;
  revisionMetaHelpers?: FieldHelperProps<ArticleFormType["revisionMeta"]>;
  updateNotes?: (art: IUpdatedArticleDTO) => Promise<IArticleDTO>;
}

const QualityEvaluationModal = ({
  articleType,
  article,
  taxonomy,
  revisionMetaField,
  revisionMetaHelpers,
  updateNotes,
}: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onOpenChange = useCallback((details: DialogOpenChangeDetails) => setOpen(details.open), []);

  const resourceTranslation =
    articleType === "topic-article" ? t("qualityEvaluationForm.topicArticle") : t("qualityEvaluationForm.article");
  const title = taxonomy?.length ? t("qualityEvaluationForm.edit") : t("qualityEvaluationForm.disabled");

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <IconButton title={title} aria-label={title} size="small" disabled={!taxonomy?.length} variant="secondary">
          <PencilLine />
        </IconButton>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("qualityEvaluationForm.modalTitle")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Text textStyle="label.small">
              {t("qualityEvaluationForm.description", { resource: resourceTranslation })}
            </Text>
            {!!taxonomy && (
              <QualityEvaluationForm
                setOpen={setOpen}
                taxonomy={taxonomy}
                revisionMetaField={revisionMetaField}
                revisionMetaHelpers={revisionMetaHelpers}
                updateNotes={updateNotes}
                article={article}
              />
            )}
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default QualityEvaluationModal;
