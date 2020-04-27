/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import { Footer, FooterStatus, FooterLinkButton } from '@ndla/editor';
import { colors, spacing } from '@ndla/core';
import { Launch } from '@ndla/icons/common';

import { toPreviewDraft } from '../../util/routeHelpers';
import { Article, Concept, PossibleStatuses, Values } from './editorTypes';
import * as draftApi from '../../modules/draft/draftApi';
import * as conceptApi from '../../modules/concept/conceptApi'
import { formatErrorMessage } from '../../util/apiHelpers';
import { TranslateType } from '../../interfaces';
import SaveMultiButton from '../SaveMultiButton';

interface Props {
  t: TranslateType;
  isSubmitting: boolean;
  formIsDirty: boolean;
  savedToServer: boolean;
  values: Values;
  error: string;
  errors: Object;
  getEntity: () => Article | Concept;
  entityStatus: { current: string };
  createMessage: (o: { translationKey: string; severity: string }) => void;
  showSimpleFooter: boolean;
  setFieldValue: (name: string, value: { current: string }) => void;
  onSaveClick: VoidFunction;
  entityType: string;
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

const EditorFooter: React.FC<Props> = ({
  t,
  isSubmitting,
  formIsDirty,
  savedToServer,
  values,
  getEntity,
  createMessage,
  entityStatus,
  showSimpleFooter,
  setFieldValue,
  errors,
  onSaveClick,
  entityType,
}) => {
  const [possibleStatuses, setStatuses] = useState<PossibleStatuses | any>({});

  const isConceptType = () => {
    return entityType === "Concept"
  };

  const fetchStatuses = async (setStatuses: React.Dispatch<PossibleStatuses>) => {
    const possibleStatuses = isConceptType() ? await conceptApi.fetchStatusStateMachine()
      : await draftApi.fetchStatusStateMachine();
    setStatuses(possibleStatuses);
  };

  useEffect(() => {
    fetchStatuses(setStatuses);
  }, []);

  // Wait for newStatus to be set to trigger since formik doesn't update fields instantly
  const [newStatus, setNewStatus] = useState<string | null>(null);
  useEffect(() => {
    if (newStatus) {
      onSaveClick();
      setNewStatus(null);
    }
  }, [values.status]);

  const saveButton = (
    <SaveMultiButton
      large
      isSaving={isSubmitting}
      formIsDirty={formIsDirty}
      showSaved={savedToServer && !formIsDirty}
      onClick={onSaveClick}
    />
  );

  const onValidateClick = async () => {
    const { id, revision } = values;
    try {
      await draftApi.validateDraft(id, { ...getEntity(), revision });
      createMessage({
        translationKey: 'form.validationOk',
        severity: 'success',
      });
    } catch (error) {
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      } else {
        createMessage(error);
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
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      } else {
        createMessage(error);
      }
    }
  };

  return (
    <Footer>
      <div>
        {values.id && (
          <FooterLinkButton
            bold
            onClick={() =>
              window.open(toPreviewDraft(values.id, values.language))
            }>
            {t('form.preview.button')}
            <Launch />
          </FooterLinkButton>
        )}
        <StyledLine />
        {values.id && (
          <FooterLinkButton bold onClick={() => {if(!isConceptType()) onValidateClick()}}>
            {t('form.validate')}
          </FooterLinkButton>
        )}
      </div>
      <div>
        <FooterStatus
          onSave={updateStatus}
          options={getStatuses()}
          messages={{
            label: '',
            changeStatus: t(
              `form.status.${entityStatus.current.toLowerCase()}`,
            ),
            back: t('editorFooter.back'),
            inputHeader: t('editorFooter.inputHeader'),
            inputHelperText: t('editorFooter.inputHelperText'),
            cancelLabel: t('editorFooter.cancelLabel'),
            saveLabel: t('editorFooter.saveLabel'),
            warningSavedWithoutComment: t(
              'editorFooter.warningSaveWithoutComment',
            ),
            newStatusPrefix: t('editorFooter.newStatusPrefix'),
            statusLabel: t('editorFooter.statusLabel'),
          }}
        />
        {saveButton}
      </div>
    </Footer>
  );
};

export default injectT(EditorFooter);
