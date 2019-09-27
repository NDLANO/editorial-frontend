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
import SaveButton from '../../components/SaveButton';
import ArticlePreviews from './common/ArticlePreviews';
import { Article, PossibleStatuses, PreviewTypes } from './editorTypes';
import * as draftApi from '../../modules/draft/draftApi';
import { toEditArticle } from '../../util/routeHelpers';
import { formatErrorMessage } from '../../util/apiHelpers';

interface Props {
  t: any;
  isSubmitting: boolean;
  formIsDirty: boolean;
  savedToServer: boolean;
  values: any;
  showReset: boolean;
  error: string;
  getArticle: () => Article;
  articleStatus: { current: string };
  createMessage: (o: { translationKey: string; severity: string }) => void;
  handleSubmit: (status: string) => void;
  showSimpleFooter: boolean;
  history: { push: (s: string) => void };
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

const fetchStatuses = async (setStatuses: React.Dispatch<PossibleStatuses>) => {
  const possibleStatuses = await draftApi.fetchStatusStateMachine();
  setStatuses(possibleStatuses);
};

const EditorFooter: React.FC<Props> = ({
  t,
  isSubmitting,
  formIsDirty,
  savedToServer,
  values,
  showReset,
  getArticle,
  createMessage,
  articleStatus,
  handleSubmit,
  showSimpleFooter,
  history,
}) => {
  const [preview, showPreview] = useState<PreviewTypes>('');
  const [possibleStatuses, setStatuses] = useState<PossibleStatuses | any>({});
  useEffect(() => {
    fetchStatuses(setStatuses);
  }, []);
  const saveButton = (
    <SaveButton
      data-testid="saveLearningResourceButton"
      isSaving={isSubmitting}
      defaultText="save"
      formIsDirty={formIsDirty}
      large
      showSaved={savedToServer && !formIsDirty}
    />
  );

  const onValidateClick = async () => {
    const { id, revision } = values;
    try {
      await draftApi.validateDraft(id, { ...getArticle(), revision });
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

  const onSaveAsNew = async () => {
    if (formIsDirty) {
      createMessage({
        translationKey: 'form.mustSaveFirst',
        severity: 'danger',
      });
    } else {
      const article = getArticle();
      const newArticle = await draftApi.createDraft({
        ...article,
        title: `${article.title} (${t('form.copy')})`,
      });
      createMessage({
        translationKey: t('form.saveAsCopySuccess'),
        severity: 'success',
      });
      history.push(
        toEditArticle(newArticle.id, newArticle.articleType, article.language),
      );
    }
  };

  const getStatuses = () =>
    Array.isArray(possibleStatuses[articleStatus.current])
      ? possibleStatuses[articleStatus.current].map((status: string) => ({
          name: t(`form.status.actions.${status}`),
          id: status,
          active: status === articleStatus.current,
        }))
      : [];

  const updateStatus = async (comment: string, status: string) => {
    try {
      handleSubmit(status);
    } catch (error) {
      if (error && error.json && error.json.messages) {
        createMessage(formatErrorMessage(error));
      }
    }
  };

  return (
    <Footer>
      {preview && (
        <ArticlePreviews
          typeOfPreview={preview}
          getArticle={getArticle}
          label={t(`articleType.${values.articleType}`)}
          closePreview={() => showPreview('')}
        />
      )}
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
          <FooterLinkButton bold onClick={() => onValidateClick()}>
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
              `form.status.${articleStatus.current.toLowerCase()}`,
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
