/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShareBoxLine } from "@ndla/icons";
import { Button, FieldRoot } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO as ConceptStatus } from "@ndla/types-backend/concept-api";
import { IStatusDTO as DraftStatus } from "@ndla/types-backend/draft-api";
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from "../../constants";
import PrioritySelect from "../../containers/FormikForm/components/PrioritySelect";
import ResponsibleSelect from "../../containers/FormikForm/components/ResponsibleSelect";
import StatusSelect from "../../containers/FormikForm/components/StatusSelect";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../interfaces";
import { toPreviewDraft } from "../../util/routeHelpers";
import { FormField } from "../FormField";
import { createEditUrl, TranslatableType, translatableTypes } from "../HeaderWithLanguage/util";
import { PreviewResourceDialog } from "../PreviewDraft/PreviewResourceDialog";
import SaveMultiButton from "../SaveMultiButton";

interface Props {
  formIsDirty: boolean;
  savedToServer: boolean;
  entityStatus?: DraftStatus;
  showSimpleFooter: boolean;
  onSaveClick: () => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  isArticle?: boolean;
  isConcept: boolean;
  hideSecondaryButton: boolean;
  isNewlyCreated: boolean;
  hasErrors?: boolean;
  articleId?: number;
  articleType?: string;
  selectedLanguage?: string;
  supportedLanguages?: string[];
}

interface FormValues {
  id: number;
  language: string;
  revision?: number;
  status: ConceptStatus;
  priority?: string;
}

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "5xsmall",
    alignItems: "flex-start",
  },
});

const StyledPageContent = styled("div", {
  base: {
    position: "sticky",
    bottom: "4xsmall",
    zIndex: "docked",
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    whiteSpace: "nowrap",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr repeat(3, minmax(150px, max-content)) min-content",
    justifyContent: "space-between",
    rowGap: "xsmall",
    columnGap: "medium",
    padding: "small",
    boxShadow: "medium",
    marginInline: "-xsmall",
    borderRadius: "xsmall",
    border: "1px solid",
    borderColor: "stroke.default",
    alignItems: "center",
    background: "background.default",
    desktopDown: {
      display: "flex",
      flexWrap: "wrap",
    },
  },
});

const STATUSES_RESET_RESPONSIBLE = [ARCHIVED, UNPUBLISHED];

function EditorFooter<T extends FormValues>({
  formIsDirty,
  savedToServer,
  entityStatus,
  showSimpleFooter,
  onSaveClick,
  statusStateMachine,
  isArticle,
  isConcept,
  hideSecondaryButton,
  isNewlyCreated,
  hasErrors,
  articleId,
  articleType,
  selectedLanguage,
  supportedLanguages,
}: Props) {
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();

  // Wait for newStatus to be set to trigger since formik doesn't update fields instantly
  const [newStatus, setNewStatus] = useState<string | undefined>(undefined);

  const articleOrConcept = isArticle || isConcept;

  const languageButton = useMemo(() => {
    if (
      ((selectedLanguage === "nb" && supportedLanguages?.includes("nn")) ||
        (selectedLanguage === "nn" && supportedLanguages?.includes("nb"))) &&
      articleId &&
      articleType &&
      translatableTypes.includes(articleType as TranslatableType)
    ) {
      const targetLanguage = selectedLanguage === "nb" ? "nn" : "nb";
      const buttonText = t(`languages.${targetLanguage}`);
      return (
        <StyledSafeLinkButton
          aria-label={buttonText}
          variant="link"
          to={createEditUrl(articleId, targetLanguage, articleType as TranslatableType)}
        >
          {buttonText}
        </StyledSafeLinkButton>
      );
    } else {
      return undefined;
    }
  }, [articleId, articleType, selectedLanguage, supportedLanguages, t]);

  useEffect(() => {
    if (newStatus === PUBLISHED) {
      onSaveClick();
      setNewStatus(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatus]);

  const onSave = useCallback(
    (saveAsNewVersion?: boolean | undefined) => {
      if (STATUSES_RESET_RESPONSIBLE.find((s) => s === values.status.current)) {
        setFieldValue("responsibleId", null);
      }
      setFieldValue("saveAsNew", !!saveAsNewVersion);
      onSaveClick();
    },
    [onSaveClick, setFieldValue, values.status],
  );

  const onUpdateStatus = useCallback(
    (value: string | undefined) => {
      setFieldValue("status", { current: value });
      setNewStatus(value);
    },
    [setFieldValue],
  );

  return (
    <StyledPageContent>
      <ContentWrapper>
        {!showSimpleFooter && (
          <LinksWrapper>
            {!!articleId && !!isConcept && (
              <PreviewResourceDialog
                type="concept"
                language={values.language}
                activateButton={<Button variant="link">{t("form.preview.button")}</Button>}
              />
            )}
            {!!articleId && !!isArticle && (
              <SafeLinkButton variant="link" to={toPreviewDraft(articleId, values.language)} target="_blank">
                {t("form.preview.button")}
                <ShareBoxLine size="small" />
              </SafeLinkButton>
            )}
            {!!languageButton && languageButton}
          </LinksWrapper>
        )}
        {!!isArticle && (
          <FormField name="priority">
            {({ field, helpers }) => (
              <FieldRoot>
                <PrioritySelect priority={field.value} updatePriority={helpers.setValue} />
              </FieldRoot>
            )}
          </FormField>
        )}
        {!!articleOrConcept && (
          <FormField name="responsibleId">
            {({ field, helpers }) => (
              <FieldRoot>
                <ResponsibleSelect responsible={field.value} onSave={helpers.setValue} />
              </FieldRoot>
            )}
          </FormField>
        )}
        {!showSimpleFooter && (
          <FormField name="status">
            {({ field }) => (
              <FieldRoot>
                <StatusSelect
                  status={field.value}
                  updateStatus={onUpdateStatus}
                  statusStateMachine={statusStateMachine}
                  entityStatus={entityStatus}
                />
              </FieldRoot>
            )}
          </FormField>
        )}
        <SaveMultiButton
          isSaving={isSubmitting}
          formIsDirty={formIsDirty}
          showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
          onClick={onSave}
          hideSecondaryButton={hideSecondaryButton}
          hasErrors={!!hasErrors}
        />
      </ContentWrapper>
    </StyledPageContent>
  );
}

export default memo(EditorFooter);
