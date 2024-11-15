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
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Launch } from "@ndla/icons/common";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { IStatus as ConceptStatus } from "@ndla/types-backend/concept-api";
import { IStatus as DraftStatus } from "@ndla/types-backend/draft-api";
import { ARCHIVED, PUBLISHED, SAVE_BUTTON_ID, UNPUBLISHED } from "../../constants";
import PrioritySelect from "../../containers/FormikForm/components/PrioritySelect";
import ResponsibleSelect from "../../containers/FormikForm/components/ResponsibleSelect";
import StatusSelect from "../../containers/FormikForm/components/StatusSelect";
import { NewMessageType, useMessages } from "../../containers/Messages/MessagesProvider";
import { useSession } from "../../containers/Session/SessionProvider";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../interfaces";
import { toPreviewDraft } from "../../util/routeHelpers";
import Footer from "../Footer/Footer";
import { createEditUrl, TranslatableType, translatableTypes } from "../HeaderWithLanguage/util";
import { PreviewResourceDialog } from "../PreviewDraft/PreviewResourceDialog";
import SaveMultiButton from "../SaveMultiButton";

interface Props {
  formIsDirty: boolean;
  savedToServer: boolean;
  entityStatus?: DraftStatus;
  showSimpleFooter: boolean;
  onSaveClick: (saveAsNewVersion?: boolean) => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  validateEntity?: () => Promise<{ id: number } | undefined>;
  isArticle?: boolean;
  isConcept: boolean;
  hideSecondaryButton: boolean;
  isNewlyCreated: boolean;
  hasErrors?: boolean;
  responsibleId?: string;
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

const StyledLine = styled.hr`
  width: 1px;
  height: ${spacing.medium};
  background: ${colors.brand.greyLight};
  margin: 0 ${spacing.normal} 0 ${spacing.small};
  &:before {
    content: none;
  }
`;

const Wrapper = styled.div`
  width: 200px;
`;

const ResponsibleWrapper = styled.div`
  width: 250px;
`;

const StyledFooterControls = styled.div`
  display: flex;
  gap: ${spacing.normal};
  align-items: center;
`;

const StyledFooter = styled.div`
  margin-left: auto;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  white-space: nowrap;
`;

const STATUSES_RESET_RESPONSIBLE = [ARCHIVED, UNPUBLISHED];

function EditorFooter<T extends FormValues>({
  formIsDirty,
  savedToServer,
  entityStatus,
  showSimpleFooter,
  onSaveClick,
  statusStateMachine,
  validateEntity,
  isArticle,
  isConcept,
  hideSecondaryButton,
  isNewlyCreated,
  hasErrors,
  responsibleId,
  articleId,
  articleType,
  selectedLanguage,
  supportedLanguages,
}: Props) {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [responsible, setResponsible] = useState<string | undefined>(undefined);

  const { ndlaId } = useSession();
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();
  const { createMessage, formatErrorMessage } = useMessages();

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

  const catchError = useCallback(
    (error: any, createMessage: (message: NewMessageType) => void) => {
      if (error?.json?.messages) {
        createMessage(formatErrorMessage(error));
      } else {
        createMessage(error);
      }
    },
    [formatErrorMessage],
  );

  const updateResponsible = useCallback(
    async (responsible: string | undefined) => {
      try {
        setResponsible(responsible);
        setFieldValue("responsibleId", responsible ? responsible : null);
      } catch (error) {
        catchError(error, createMessage);
      }
    },
    [catchError, createMessage, setFieldValue],
  );

  const onSave = useCallback(
    (saveAsNewVersion?: boolean | undefined) => {
      if (STATUSES_RESET_RESPONSIBLE.find((s) => s === status)) {
        updateResponsible(undefined);
      }
      onSaveClick(saveAsNewVersion);
    },
    [onSaveClick, status, updateResponsible],
  );

  const updateStatus = useCallback(
    async (status: string | undefined) => {
      try {
        // Set new status field and update form (which we listen for changes to in the useEffect above)
        setNewStatus(status);
        if (status !== PUBLISHED) {
          setStatus(status);
        }
        setFieldValue("status", { current: status });
      } catch (error) {
        catchError(error, createMessage);
      }
    },
    [catchError, createMessage, setFieldValue],
  );

  const updatePriority = useCallback(
    (value: string | undefined) => setFieldValue("priority", value ?? "unspecified"),
    [setFieldValue],
  );

  if (showSimpleFooter) {
    return (
      <Footer isArticle={isArticle}>
        <StyledFooter>
          <StyledFooterControls>
            {isArticle && <PrioritySelect priority={values.priority} updatePriority={updatePriority} />}
            {articleOrConcept && (
              <Wrapper>
                <ResponsibleSelect
                  responsible={responsible}
                  setResponsible={setResponsible}
                  onSave={updateResponsible}
                  responsibleId={ndlaId}
                />
              </Wrapper>
            )}
            <SaveMultiButton
              isSaving={isSubmitting}
              formIsDirty={formIsDirty}
              showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
              onClick={onSave}
              hideSecondaryButton={hideSecondaryButton}
              hasErrors={!!hasErrors}
            />
          </StyledFooterControls>
        </StyledFooter>
      </Footer>
    );
  }

  return (
    <Footer isArticle={isArticle}>
      <>
        <div data-testid="footerPreviewAndValidate">
          {values.id && isConcept && (
            <PreviewResourceDialog
              type="concept"
              language={values.language}
              activateButton={<Button variant="link">{t("form.preview.button")}</Button>}
            />
          )}
          {values.id && isArticle && (
            <SafeLinkButton variant="link" to={toPreviewDraft(values.id, values.language)} target="_blank">
              {t("form.preview.button")}
              <Launch />
            </SafeLinkButton>
          )}
          {languageButton && (
            <>
              <StyledLine />
              {languageButton}
            </>
          )}
        </div>

        <StyledFooterControls>
          <Wrapper>
            {isArticle && <PrioritySelect priority={values.priority} updatePriority={updatePriority} />}
          </Wrapper>
          <ResponsibleWrapper>
            <ResponsibleSelect
              responsible={responsible}
              setResponsible={setResponsible}
              onSave={updateResponsible}
              responsibleId={responsibleId}
            />
          </ResponsibleWrapper>
          <Wrapper>
            <StatusSelect
              status={status}
              setStatus={setStatus}
              onSave={updateStatus}
              statusStateMachine={statusStateMachine}
              entityStatus={entityStatus}
            />
          </Wrapper>
          <SaveMultiButton
            isSaving={isSubmitting}
            formIsDirty={formIsDirty}
            showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
            onClick={onSave}
            hideSecondaryButton={hideSecondaryButton}
            hasErrors={!!hasErrors}
          />
        </StyledFooterControls>
      </>
    </Footer>
  );
}

export default memo(EditorFooter);
