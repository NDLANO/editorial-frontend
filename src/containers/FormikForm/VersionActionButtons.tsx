/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, EyeFill, ResetLeft } from "@ndla/icons";
import { Button, IconButton, Text } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ArticleFormType } from "./articleFormHooks";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../components/FormikForm";
import { PreviewResourceDialog } from "../../components/PreviewDraft/PreviewResourceDialog";
import { useDeleteCurrentRevision } from "../../modules/draft/draftMutations";
import { isFormikFormDirty } from "../../util/formHelper";

interface Props {
  showFromArticleApi: boolean;
  article: IArticleDTO;
  resetVersion: (version: IArticleDTO, language: string, showFromArticleApi: boolean) => Promise<void>;
  version: IArticleDTO;
  current: boolean;
  currentLanguage: string;
  canDeleteCurrentRevision: boolean;
  articleChanged: boolean;
}

const VersionActionButtons = ({
  showFromArticleApi,
  current,
  article,
  resetVersion,
  version,
  currentLanguage,
  canDeleteCurrentRevision,
  articleChanged,
}: Props) => {
  const { t } = useTranslation();
  const { values, initialValues, dirty, isSubmitting } = useFormikContext<ArticleFormType>();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const deleteCurrentRevision = useDeleteCurrentRevision();
  const [deleteError, setDeleteError] = useState<string>("");

  const formIsDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
        changed: articleChanged,
      }) || isSubmitting,
    [values, initialValues, dirty, articleChanged, isSubmitting],
  );

  // TODO: Need to refresh content of Slate editor
  const onDeleteCurrentRevision = () => {
    setDeleteError("");
    deleteCurrentRevision.mutate(
      { articleId: article.id },
      {
        onSuccess: () => setDeleteConfirmationOpen(false),
        onError: () => setDeleteError(t("errorMessage.genericError")),
      },
    );
  };

  const deleteDialogTitle = t("form.workflow.deleteCurrentRevision.title");
  const deleteButtonLabel = t("alertDialog.delete");

  if (current && canDeleteCurrentRevision)
    return (
      <>
        <IconButton
          disabled={formIsDirty}
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
              {t("alertDialog.cancel")}
            </Button>
            <Button variant="danger" loading={deleteCurrentRevision.isPending} onClick={onDeleteCurrentRevision}>
              {deleteButtonLabel}
            </Button>
          </FormActionsContainer>
        </AlertDialog>
      </>
    );
  // we only show preview and reset for current versions if they are the ONLY version
  // ie. that they were published before versions were introduced
  else if (current && !showFromArticleApi) return null;

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
};

export default VersionActionButtons;
