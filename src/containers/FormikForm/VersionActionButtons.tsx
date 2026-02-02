/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine, EyeFill, ResetLeft } from "@ndla/icons";
import { Button, IconButton, Text } from "@ndla/primitives";
import { ArticleDTO } from "@ndla/types-backend/draft-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../components/FormikForm";
import { PreviewResourceDialog } from "../../components/PreviewDraft/PreviewResourceDialog";
import { useDeleteCurrentRevision } from "../../modules/draft/draftMutations";

interface Props {
  showFromArticleApi: boolean;
  article: ArticleDTO;
  resetVersion: (version: ArticleDTO, language: string, showFromArticleApi: boolean) => Promise<void>;
  version: ArticleDTO;
  current: boolean;
  currentLanguage: string;
  canDeleteCurrentRevision: boolean;
  formIsDirty: boolean;
  fetchAndResetFormValues: () => Promise<void>;
}

const VersionActionButtons = ({
  showFromArticleApi,
  current,
  article,
  resetVersion,
  version,
  currentLanguage,
  canDeleteCurrentRevision,
  formIsDirty,
  fetchAndResetFormValues,
}: Props) => {
  const { t } = useTranslation();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const deleteCurrentRevision = useDeleteCurrentRevision();
  const [deleteError, setDeleteError] = useState<string>("");

  const onDeleteCurrentRevision = () => {
    setDeleteError("");
    deleteCurrentRevision.mutate(
      { articleId: article.id },
      {
        onSuccess: () => {
          setDeleteConfirmationOpen(false);
          fetchAndResetFormValues();
        },
        onError: () => setDeleteError(t("errorMessage.genericError")),
      },
    );
  };

  if (current && !showFromArticleApi) {
    const deleteDialogTitle = t("form.workflow.deleteCurrentRevision.dialogTitle");
    const deleteButtonLabel = formIsDirty
      ? t("form.workflow.deleteCurrentRevision.buttonLabelDirty")
      : !canDeleteCurrentRevision
        ? t("form.workflow.deleteCurrentRevision.buttonLabelPublished")
        : t("form.workflow.deleteCurrentRevision.buttonLabel");
    return (
      <>
        <IconButton
          disabled={formIsDirty || !canDeleteCurrentRevision}
          variant="danger"
          size="small"
          aria-label={deleteButtonLabel}
          title={deleteButtonLabel}
          onClick={() => setDeleteConfirmationOpen(true)}
        >
          <DeleteBinLine />
        </IconButton>
        <AlertDialog
          label={deleteDialogTitle}
          title={deleteDialogTitle}
          text={t("form.workflow.deleteCurrentRevision.dialogText")}
          show={deleteConfirmationOpen}
          onCancel={() => setDeleteConfirmationOpen(false)}
        >
          {!!deleteError && <Text>{deleteError}</Text>}
          <FormActionsContainer>
            <Button variant="secondary" onClick={() => setDeleteConfirmationOpen(false)}>
              {t("form.workflow.deleteCurrentRevision.dialogCancel")}
            </Button>
            <Button variant="danger" loading={deleteCurrentRevision.isPending} onClick={onDeleteCurrentRevision}>
              {t("form.workflow.deleteCurrentRevision.dialogConfirm")}
            </Button>
          </FormActionsContainer>
        </AlertDialog>
      </>
    );
  }
  // we only show preview and reset for current versions if they are the ONLY version
  // ie. that they were published before versions were introduced
  else if (!current || showFromArticleApi)
    return (
      <>
        <PreviewResourceDialog
          type="version"
          article={version}
          language={currentLanguage}
          activateButton={
            <IconButton
              variant="tertiary"
              size="small"
              title={t("form.previewVersion")}
              aria-label={t("form.previewVersion")}
              data-testid="previewVersion"
            >
              <EyeFill />
            </IconButton>
          }
        />
        <IconButton
          variant="tertiary"
          size="small"
          aria-label={t("form.resetToVersion")}
          title={t("form.resetToVersion")}
          data-testid="resetToVersion"
          onClick={() => resetVersion(version, article.title!.language, showFromArticleApi)}
        >
          <ResetLeft />
        </IconButton>
      </>
    );

  return null;
};

export default VersionActionButtons;
