/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
import { Footer, FooterStatus, FooterLinkButton } from '@ndla/editor';
import { colors, spacing } from '@ndla/core';
import { Launch } from '@ndla/icons/common';
import { useFormikContext } from 'formik';

import { toPreviewDraft } from '../../util/routeHelpers';
import { Article, PossibleStatuses } from './editorTypes';
import { CreateMessageType } from '../../interfaces';
import { formatErrorMessage } from '../../util/apiHelpers';
import PreviewConceptLightbox from '../PreviewConcept/PreviewConceptLightbox';
import SaveMultiButton from '../SaveMultiButton';
import { ConceptType, FormValues } from '../../modules/concept/conceptApiInterfaces';

interface Props {
  formIsDirty: boolean;
  savedToServer: boolean;
  getEntity: () => Article | ConceptType;
  entityStatus: { current: string };
  createMessage?: (o: CreateMessageType) => void;
  showSimpleFooter: boolean;
  onSaveClick: VoidFunction;
  fetchStatusStateMachine: () => Promise<PossibleStatuses>;
  validateEntity: (id: number, updatedEntity: Article | ConceptType) => void;
  isArticle?: boolean;
  isConcept: boolean;
  hideSecondaryButton: boolean;
  isNewlyCreated: boolean;
  hasErrors?: boolean;
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
  createMessage,
  entityStatus,
  showSimpleFooter,
  onSaveClick,
  fetchStatusStateMachine,
  validateEntity,
  isArticle,
  isConcept,
  hideSecondaryButton,
  isNewlyCreated,
  hasErrors,
  t,
}: Props & tType) {
  const { values, setFieldValue, isSubmitting } = useFormikContext<T>();
  const [possibleStatuses, setStatuses] = useState<PossibleStatuses | any>({});

  useEffect(() => {
    const fetchStatuses = async (setStatuses: React.Dispatch<PossibleStatuses>) => {
      const possibleStatuses = await fetchStatusStateMachine();
      setStatuses(possibleStatuses);
    };
    fetchStatuses(setStatuses);
  }, [fetchStatusStateMachine]);

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

  const catchError = (error: any, createMessage: (o: CreateMessageType) => void) => {
    if (error?.json?.messages) {
      createMessage(formatErrorMessage(error));
    } else {
      createMessage(error);
    }
  };
  const onValidateClick = async () => {
    const { id, revision } = values;
    const updatedEntity = { ...getEntity(), revision };
    try {
      await validateEntity(id, updatedEntity);
      if (createMessage) {
        createMessage({
          translationKey: 'form.validationOk',
          severity: 'success',
        });
      }
    } catch (error) {
      if (createMessage) {
        catchError(error, createMessage);
      }
    }
  };

  if (showSimpleFooter) {
    return (
      <Footer>
        <div>{saveButton}</div>
      </Footer>
    );
  }

  const getStatuses = () =>
    Array.isArray(possibleStatuses[entityStatus.current])
      ? possibleStatuses[entityStatus.current].map((status: string) => ({
          name: t(`form.status.actions.${status}`),
          id: status,
          active: status === entityStatus.current,
        }))
      : [];

  const updateStatus = async (comment: string, status: string) => {
    try {
      // Set new status field and update form (which we listen for changes to in the useEffect above)
      setNewStatus(status);
      setFieldValue('status', { current: status });
    } catch (error) {
      if (createMessage) {
        catchError(error, createMessage);
      }
    }
  };

  return (
    <Footer>
      <>
        <div data-cy="footerPreviewAndValidate">
          {values.id && isConcept && (
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
          {values.id && isArticle && (
            <FooterLinkButton bold onClick={() => onValidateClick()}>
              {t('form.validate')}
            </FooterLinkButton>
          )}
        </div>
        <div data-cy="footerStatus">
          <FooterStatus
            onSave={updateStatus}
            options={getStatuses()}
            messages={{
              label: '',
              changeStatus: t(`form.status.${entityStatus.current.toLowerCase()}`),
              back: t('editorFooter.back'),
              inputHeader: t('editorFooter.inputHeader'),
              inputHelperText: t('editorFooter.inputHelperText'),
              cancelLabel: t('editorFooter.cancelLabel'),
              saveLabel: t('editorFooter.saveLabel'),
              warningSavedWithoutComment: t('editorFooter.warningSaveWithoutComment'),
              newStatusPrefix: t('editorFooter.newStatusPrefix'),
              statusLabel: t('editorFooter.statusLabel'),
              commentPlaceholder: '',
            }}
          />
          {saveButton}
        </div>
      </>
    </Footer>
  );
}

export default injectT(EditorFooter);
