/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Footer, FooterStatus, FooterLinkButton } from '@ndla/editor';
import { colors, spacing } from '@ndla/core';
import { Launch } from '@ndla/icons/common';
import { IConcept as ConceptApiType } from '@ndla/types-concept-api';
import { useFormikContext } from 'formik';

import { toPreviewDraft } from '../../util/routeHelpers';
import { PossibleStatuses } from './editorTypes';
import { formatErrorMessage } from '../../util/apiHelpers';
import PreviewConceptLightbox from '../PreviewConcept/PreviewConceptLightbox';
import SaveMultiButton from '../SaveMultiButton';
import { ConceptStatus } from '../../modules/concept/conceptApiInterfaces';
import { DraftStatus, UpdatedDraftApiType } from '../../modules/draft/draftApiInterfaces';
import { createGuard, createReturnTypeGuard } from '../../util/guards';
import { NewMessageType, useMessages } from '../../containers/Messages/MessagesProvider';

interface Props {
  formIsDirty: boolean;
  savedToServer: boolean;
  getEntity?: () => UpdatedDraftApiType | ConceptApiType;
  entityStatus?: DraftStatus;
  showSimpleFooter: boolean;
  onSaveClick: (saveAsNewVersion?: boolean) => void;
  statusStateMachine?: PossibleStatuses;
  validateEntity?: (id: number, updatedEntity: UpdatedDraftApiType) => Promise<{ id: number }>;
  isArticle?: boolean;
  isConcept: boolean;
  hideSecondaryButton: boolean;
  isNewlyCreated: boolean;
  hasErrors?: boolean;
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

function EditorFooter<T extends FormValues>({
  formIsDirty,
  savedToServer,
  getEntity,
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
}: Props) {
  const { t } = useTranslation();
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();
  const { createMessage } = useMessages();
  // Wait for newStatus to be set to trigger since formik doesn't update fields instantly
  const [newStatus, setNewStatus] = useState<string | null>(null);
  useEffect(() => {
    if (newStatus) {
      onSaveClick();
      setNewStatus(null);
    }
  }, [newStatus, onSaveClick]);

  const saveButton = (
    <SaveMultiButton
      large
      isSaving={isSubmitting}
      formIsDirty={formIsDirty}
      showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
      onClick={onSaveClick}
      hideSecondaryButton={hideSecondaryButton}
      disabled={!!hasErrors}
    />
  );

  const catchError = (error: any, createMessage: (message: NewMessageType) => void) => {
    if (error?.json?.messages) {
      createMessage(formatErrorMessage(error));
    } else {
      createMessage(error);
    }
  };

  const isDraftApiType = createGuard<UpdatedDraftApiType, ConceptApiType>('subjectIds', {
    lacksProp: true,
  });

  const onValidateClick = async () => {
    const { id, revision } = values;
    if (!getEntity) return;
    const entity = getEntity();
    if (!isDraftApiType(entity)) return;
    const updatedEntity = { ...entity, revision: revision ?? entity.revision };
    try {
      await validateEntity?.(id, updatedEntity);
      createMessage({
        translationKey: 'form.validationOk',
        severity: 'success',
      });
    } catch (error) {
      catchError(error, createMessage);
    }
  };

  if (showSimpleFooter) {
    return (
      <Footer>
        <div>{saveButton}</div>
      </Footer>
    );
  }

  const transformStatus = (entityStatus: DraftStatus, status: string) => ({
    name: t(`form.status.actions.${status}`),
    id: status,
    active: status === entityStatus.current,
  });

  const statuses =
    statusStateMachine && entityStatus
      ? statusStateMachine[entityStatus.current]?.map(s => transformStatus(entityStatus, s)) ?? []
      : [];

  const updateStatus = async (comment: string, status: string) => {
    try {
      // Set new status field and update form (which we listen for changes to in the useEffect above)
      setNewStatus(status);
      setFieldValue('status', { current: status });
    } catch (error) {
      catchError(error, createMessage);
    }
  };

  const isConceptType = createReturnTypeGuard<ConceptApiType>('subjectIds');

  return (
    <Footer>
      <>
        <div data-cy="footerPreviewAndValidate">
          {values.id && isConcept && getEntity && isConceptType(getEntity) && (
            <PreviewConceptLightbox getConcept={getEntity} typeOfPreview={'preview'} />
          )}
          {values.id && isArticle && (
            <FooterLinkButton
              bold
              onClick={() => window.open(toPreviewDraft(values.id, values.language))}>
              {t('form.preview.button')}
              <Launch />
            </FooterLinkButton>
          )}
          <StyledLine />
          {values.id && isArticle && getEntity && (
            <FooterLinkButton bold onClick={() => onValidateClick()}>
              {t('form.validate')}
            </FooterLinkButton>
          )}
        </div>
        <div data-cy="footerStatus">
          <FooterStatus
            onSave={updateStatus}
            options={statuses}
            messages={{
              label: '',
              changeStatus: t(`form.status.${entityStatus?.current.toLowerCase()}`),
              back: t('editorFooter.back'),
              inputHeader: t('editorFooter.inputHeader'),
              inputHelperText: t('editorFooter.inputHelperText'),
              cancelLabel: t('editorFooter.cancelLabel'),
              saveLabel: t('editorFooter.saveLabel'),
              warningSavedWithoutComment: t('editorFooter.warningSaveWithoutComment'),
              newStatusPrefix: t('editorFooter.newStatusPrefix'),
              statusLabel: t('editorFooter.statusLabel'),
            }}
          />
          {saveButton}
        </div>
      </>
    </Footer>
  );
}

export default EditorFooter;
