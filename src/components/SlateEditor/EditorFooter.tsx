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
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { Launch } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import { SingleValue } from "@ndla/select";
import { IStatus as ConceptStatus } from "@ndla/types-backend/concept-api";
import { IStatus as DraftStatus } from "@ndla/types-backend/draft-api";
import { ARCHIVED, PUBLISHED, SAVE_BUTTON_ID, UNPUBLISHED } from "../../constants";
import { articleResourcePageStyle } from "../../containers/ArticlePage/styles";
import PrioritySelect from "../../containers/FormikForm/components/PrioritySelect";
import ResponsibleSelect from "../../containers/FormikForm/components/ResponsibleSelect";
import StatusSelect from "../../containers/FormikForm/components/StatusSelect";
import { NewMessageType, useMessages } from "../../containers/Messages/MessagesProvider";
import { useSession } from "../../containers/Session/SessionProvider";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../interfaces";
import { toPreviewDraft } from "../../util/routeHelpers";
import Footer from "../Footer/Footer";
import PreviewDraftLightboxV2 from "../PreviewDraft/PreviewDraftLightboxV2";
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

const StyledFooterControls = styled.div`
  display: flex;
  gap: ${spacing.normal};
  align-items: center;
`;

const StyledFooter = styled.div`
  margin-left: auto;
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
}: Props) {
  const [status, setStatus] = useState<SingleValue>(null);
  const [responsible, setResponsible] = useState<SingleValue>(null);

  const { ndlaId } = useSession();
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();
  const { createMessage, formatErrorMessage } = useMessages();

  // Wait for newStatus to be set to trigger since formik doesn't update fields instantly
  const [newStatus, setNewStatus] = useState<SingleValue>(null);

  const articleOrConcept = isArticle || isConcept;

  useEffect(() => {
    if (newStatus?.value === PUBLISHED) {
      onSaveClick();
      setNewStatus(null);
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
    async (responsible: SingleValue) => {
      try {
        setResponsible(responsible);
        setFieldValue("responsibleId", responsible ? responsible.value : null);
      } catch (error) {
        catchError(error, createMessage);
      }
    },
    [catchError, createMessage, setFieldValue],
  );

  const onSave = useCallback(
    (saveAsNewVersion?: boolean | undefined) => {
      if (STATUSES_RESET_RESPONSIBLE.find((s) => s === status?.value)) {
        updateResponsible(null);
      }
      onSaveClick(saveAsNewVersion);
    },
    [onSaveClick, status?.value, updateResponsible],
  );

  const onValidateClick = useCallback(async () => {
    if (!values.id || !isArticle) {
      return;
    }

    try {
      await validateEntity?.();
      createMessage({
        translationKey: "form.validationOk",
        severity: "success",
      });
    } catch (error) {
      catchError(error, createMessage);
    }
  }, [catchError, createMessage, isArticle, validateEntity, values.id]);

  const updateStatus = useCallback(
    async (status: SingleValue) => {
      try {
        // Set new status field and update form (which we listen for changes to in the useEffect above)
        setNewStatus(status);
        if (status?.value !== PUBLISHED) {
          setStatus(status);
        }
        setFieldValue("status", { current: status?.value });
      } catch (error) {
        catchError(error, createMessage);
      }
    },
    [catchError, createMessage, setFieldValue],
  );

  const updatePriority = useCallback(
    (p: SingleValue) => setFieldValue("priority", p ? p.value : "unspecified"),
    [setFieldValue],
  );

  if (showSimpleFooter) {
    return (
      <Footer css={isArticle && articleResourcePageStyle}>
        <StyledFooter>
          <StyledFooterControls>
            {isArticle && (
              <PrioritySelect id="priority-select" priority={values.priority} updatePriority={updatePriority} />
            )}
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
              large
              saveId={SAVE_BUTTON_ID}
              isSaving={isSubmitting}
              formIsDirty={formIsDirty}
              showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
              onClick={onSave}
              hideSecondaryButton={hideSecondaryButton}
              disabled={!!hasErrors}
            />
          </StyledFooterControls>
        </StyledFooter>
      </Footer>
    );
  }

  return (
    <Footer css={isArticle && articleResourcePageStyle}>
      <>
        <div data-testid="footerPreviewAndValidate">
          {values.id && isConcept && (
            <PreviewDraftLightboxV2
              type="concept"
              language={values.language}
              activateButton={<ButtonV2 variant="link">{t("form.preview.button")}</ButtonV2>}
            />
          )}
          {values.id && isArticle && (
            <SafeLinkButton variant="link" to={toPreviewDraft(values.id, values.language)} target="_blank">
              {t("form.preview.button")}
              <Launch />
            </SafeLinkButton>
          )}
          <StyledLine />
          {values.id && isArticle && (
            <ButtonV2 variant="link" onClick={onValidateClick}>
              {t("form.validate")}
            </ButtonV2>
          )}
        </div>

        <StyledFooterControls>
          <Wrapper>
            {isArticle && (
              <PrioritySelect id="priority-select" priority={values.priority} updatePriority={updatePriority} />
            )}
          </Wrapper>
          <Wrapper>
            <ResponsibleSelect
              responsible={responsible}
              setResponsible={setResponsible}
              onSave={updateResponsible}
              responsibleId={responsibleId}
            />
          </Wrapper>
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
            large
            saveId={SAVE_BUTTON_ID}
            isSaving={isSubmitting}
            formIsDirty={formIsDirty}
            showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
            onClick={onSave}
            hideSecondaryButton={hideSecondaryButton}
            disabled={!!hasErrors}
          />
        </StyledFooterControls>
      </>
    </Footer>
  );
}

export default memo(EditorFooter);
