/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { FooterLinkButton } from '@ndla/editor';
import { colors, spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { Launch } from '@ndla/icons/common';
import { IStatus as ConceptStatus } from '@ndla/types-backend/concept-api';
import { IStatus as DraftStatus } from '@ndla/types-backend/draft-api';
import { useFormikContext } from 'formik';
import { memo, useCallback, useEffect, useState } from 'react';
import { SingleValue } from '@ndla/select';
import { Switch } from '@ndla/switch';
import { toPreviewDraft } from '../../util/routeHelpers';
import SaveMultiButton from '../SaveMultiButton';
import { NewMessageType, useMessages } from '../../containers/Messages/MessagesProvider';
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from '../../interfaces';
import ResponsibleSelect from '../../containers/FormikForm/components/ResponsibleSelect';
import StatusSelect from '../../containers/FormikForm/components/StatusSelect';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../constants';
import PreviewDraftLightboxV2 from '../PreviewDraft/PreviewDraftLightboxV2';
import { useSession } from '../../containers/Session/SessionProvider';
import Footer from '../Footer/Footer';
import { articleResourcePageStyle } from '../../containers/ArticlePage/styles';

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
  prioritized?: boolean;
}

interface FormValues {
  id: number;
  language: string;
  revision?: number;
  status: ConceptStatus;
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
  prioritized,
}: Props) {
  const [status, setStatus] = useState<SingleValue>(null);
  const [responsible, setResponsible] = useState<SingleValue>(null);

  const { ndlaId } = useSession();
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();
  const { createMessage, formatErrorMessage } = useMessages();

  // Wait for newStatus to be set to trigger since formik doesn't update fields instantly
  const [newStatus, setNewStatus] = useState<SingleValue>(null);
  const [prioritizedOn, setPrioritizedOn] = useState(prioritized ?? false);

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
        setFieldValue('responsibleId', responsible ? responsible.value : null);
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
        translationKey: 'form.validationOk',
        severity: 'success',
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
        setFieldValue('status', { current: status?.value });
      } catch (error) {
        catchError(error, createMessage);
      }
    },
    [catchError, createMessage, setFieldValue],
  );

  const updatePrioritized = useCallback(
    (prioritized: boolean) => {
      setPrioritizedOn(prioritized);
      setFieldValue('prioritized', prioritized);
    },
    [setFieldValue],
  );

  const onPreviewDraft = useCallback(() => {
    window.open(toPreviewDraft(values.id, values.language));
  }, [values.id, values.language]);

  if (showSimpleFooter) {
    return (
      <Footer css={isArticle && articleResourcePageStyle}>
        <StyledFooter>
          <StyledFooterControls>
            {isArticle && (
              <Switch
                checked={prioritizedOn}
                onChange={updatePrioritized}
                thumbCharacter="P"
                label={t('editorFooter.prioritized')}
                id="prioritized"
              />
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
        <div data-cy="footerPreviewAndValidate">
          {values.id && isConcept && (
            <PreviewDraftLightboxV2
              type="concept"
              language={values.language}
              activateButton={<ButtonV2 variant="link">{t('form.preview.button')}</ButtonV2>}
            />
          )}
          {values.id && isArticle && (
            <FooterLinkButton bold onClick={onPreviewDraft}>
              {t('form.preview.button')}
              <Launch />
            </FooterLinkButton>
          )}
          <StyledLine />
          {values.id && isArticle && (
            <FooterLinkButton bold onClick={onValidateClick}>
              {t('form.validate')}
            </FooterLinkButton>
          )}
        </div>

        <StyledFooterControls data-cy="footerStatus">
          {isArticle && (
            <Switch
              checked={prioritizedOn}
              onChange={updatePrioritized}
              thumbCharacter="P"
              label={t('editorFooter.prioritized')}
              id="prioritized"
            />
          )}
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
