/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ShareBoxLine } from "@ndla/icons";
import { Button, FieldRoot } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO as ConceptStatus } from "@ndla/types-backend/concept-api";
import { IStatusDTO as DraftStatus, IArticleDTO } from "@ndla/types-backend/draft-api";
import { ARCHIVED, PUBLISHED, SAVE_DEBOUNCE_MS, UNPUBLISHED } from "../../constants";
import PrioritySelect from "../../containers/FormikForm/components/PrioritySelect";
import ResponsibleSelect from "../../containers/FormikForm/components/ResponsibleSelect";
import StatusSelect from "../../containers/FormikForm/components/StatusSelect";
import { hasUnpublishedConcepts } from "../../containers/FormikForm/utils";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../interfaces";
import { NewlyCreatedLocationState, toPreviewDraft } from "../../util/routeHelpers";
import { FormField } from "../FormField";
import { createEditUrl, TranslatableType, translatableTypes } from "../HeaderWithLanguage/util";
import { PreviewResourceDialog } from "../PreviewDraft/PreviewResourceDialog";
import SaveMultiButton from "../SaveMultiButton";

interface Props {
  article?: IArticleDTO | undefined;
  formIsDirty: boolean;
  savedToServer: boolean;
  entityStatus?: DraftStatus;
  showSimpleFooter: boolean;
  onSaveClick: () => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  isArticle?: boolean;
  isConcept: boolean;
  hideSecondaryButton: boolean;
  hasErrors?: boolean;
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

interface LanguageButtonProps {
  article: IArticleDTO | undefined;
}

const LanguageButton = ({ article }: LanguageButtonProps) => {
  const { t } = useTranslation();

  if (!article) return;

  const articleType = article.articleType as TranslatableType;
  if (
    ((article.content?.language === "nb" && article.supportedLanguages.includes("nn")) ||
      (article.content?.language === "nn" && article.supportedLanguages.includes("nb"))) &&
    translatableTypes.includes(articleType)
  ) {
    const targetLanguage = article.content.language === "nb" ? "nn" : "nb";

    return (
      <StyledSafeLinkButton variant="link" to={createEditUrl(article.id, targetLanguage, articleType)}>
        {t(`languages.${targetLanguage}`)}
      </StyledSafeLinkButton>
    );
  }
};

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
  article,
  formIsDirty,
  savedToServer,
  entityStatus,
  showSimpleFooter,
  onSaveClick,
  statusStateMachine,
  isArticle,
  isConcept,
  hideSecondaryButton,
  hasErrors,
}: Props) {
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();
  const { createMessage } = useMessages();
  const location = useLocation();

  // Wait for newStatus to be set to trigger since formik doesn't update fields instantly
  const [newStatus, setNewStatus] = useState<string | undefined>(undefined);
  const [shouldSave, setShouldSave] = useState(false);

  const articleOrConcept = isArticle || isConcept;

  const onSave = useCallback(() => {
    if (STATUSES_RESET_RESPONSIBLE.find((s) => s === values.status?.current)) {
      setFieldValue("responsibleId", null);
    }
    onSaveClick();
  }, [onSaveClick, setFieldValue, values.status]);

  useEffect(() => {
    if (shouldSave) {
      onSave();
      setShouldSave(false);
    }
  }, [onSave, shouldSave]);

  useEffect(() => {
    (async () => {
      if (newStatus === PUBLISHED) {
        setTimeout(() => setShouldSave(true), SAVE_DEBOUNCE_MS);
        setNewStatus(undefined);
        if (article?.responsible?.responsibleId) {
          const unpublishedConcepts = await hasUnpublishedConcepts(article);
          if (unpublishedConcepts) {
            createMessage({ message: t("form.unpublishedConcepts"), timeToLive: 0, severity: "warning" });
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatus]);

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
            {!!values.id && !!isConcept && (
              <PreviewResourceDialog
                type="concept"
                language={values.language}
                activateButton={<Button variant="link">{t("form.preview.button")}</Button>}
              />
            )}
            {!!values.id && !!isArticle && (
              <SafeLinkButton variant="link" to={toPreviewDraft(values.id, values.language)} target="_blank">
                {t("form.preview.button")}
                <ShareBoxLine size="small" />
              </SafeLinkButton>
            )}
            <LanguageButton article={article} />
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
          showSaved={!formIsDirty && (savedToServer || !!(location.state as NewlyCreatedLocationState)?.isNewlyCreated)}
          onClick={(saveAsNew) => {
            setFieldValue("saveAsNew", saveAsNew);
            setTimeout(() => setShouldSave(true), SAVE_DEBOUNCE_MS);
          }}
          hideSecondaryButton={hideSecondaryButton}
          hasErrors={!!hasErrors}
        />
      </ContentWrapper>
    </StyledPageContent>
  );
}

export default memo(EditorFooter);
