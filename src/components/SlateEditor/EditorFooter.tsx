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
import {
  Footer,
  FooterQualityInsurance,
  FooterStatus,
  FooterLinkButton,
} from '@ndla/editor';
import { colors, spacing, fonts } from '@ndla/core';
import SaveButton from '../../components/SaveButton';
import QualityAssurance from './common/QualityAssurance';
import ArticlePreviews from './common/ArticlePreviews';
import { Article, PossibleStatuses, PreviewTypes } from './editorTypes';
import * as draftApi from '../../modules/draft/draftApi';
import * as articleStatuses from '../../util/constants/ArticleStatus';
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
  updateArticleStatus: (v: string, i: string) => void;
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
  error,
  getArticle,
  createMessage,
  articleStatus,
  updateArticleStatus,
}) => {
  const [preview, showPreview] = useState<PreviewTypes>('');
  const [possibleStatuses, setStatuses] = useState<PossibleStatuses | any>({});
  useEffect(() => {
    fetchStatuses(setStatuses);
  }, []);

  let statuses = [
    {
      name: t(`form.status.actions.${articleStatus.current}`),
      active: true,
      id: articleStatus.current,
    },
  ];
  if (Array.isArray(possibleStatuses[articleStatus.current])) {
    statuses = [
      ...statuses,
      ...possibleStatuses[articleStatus.current].map((status: string) => ({
        name: t(`form.status.actions.${status}`),
        id: status,
      })),
    ];
  }

  const updateStatus = async (comment: string, status: string) => {
    const { revision } = values;
    if (formIsDirty) {
      createMessage({
        translationKey: 'form.mustSaveFirst',
        severity: 'danger',
      });
    } else {
      try {
        if (
          status === articleStatuses.PUBLISHED ||
          status === articleStatuses.QUEUED_FOR_PUBLISHING
        ) {
          await draftApi.validateDraft(values.id, {
            ...getArticle(),
            revision,
          });
        }
        await updateArticleStatus(values.id, status);
      } catch (error) {
        if (error && error.json && error.json.messages) {
          createMessage(formatErrorMessage(error));
        }
      }
    }
  };

  return (
    <Footer>
      {error && <span className="c-errorMessage">{error}</span>}
      {preview && (
        <ArticlePreviews
          typeOfPreview={preview}
          getArticle={getArticle}
          label={t(`articleType.${values.articleType}`)}
          closePreview={() => showPreview('')}
        />
      )}
      <div>
        <FooterQualityInsurance
          messages={{
            buttonLabel: 'Kvalitetssikring',
            heading: 'Kvalitetssikring:',
          }}>
          {(closePopup: VoidFunction) => (
            <QualityAssurance
              showPreview={(p: PreviewTypes) => {
                showPreview(p);
                closePopup();
              }}
              getArticle={getArticle}
              values={values}
              articleStatus={articleStatus}
              createMessage={createMessage}
            />
          )}
        </FooterQualityInsurance>
        <StyledLine />
        {values.id && (
          <FooterLinkButton data-testid="resetToProd" onClick={showReset}>
            {t('form.resetToProd.button')}
          </FooterLinkButton>
        )}
      </div>
      <div>
        <FooterStatus
          onSave={updateStatus}
          options={statuses}
          messages={{
            label: '',
            changeStatus: 'Endre status',
            back: 'Gå tilbake',
            inputHeader: 'Din merknad',
            inputHelperText: 'Kort merknad påkrevd ved statusendring',
            cancelLabel: 'Avbryt',
            saveLabel: 'Endre status og large utkast',
            warningSavedWithoutComment: 'Merknad mangler',
            newStatusPrefix: 'Ny status:',
            statusLabel: 'Status:',
          }}
        />
        <SaveButton
          data-testid="saveLearningResourceButton"
          isSaving={isSubmitting}
          defaultText="saveDraft"
          formIsDirty={formIsDirty}
          large
          showSaved={savedToServer && !formIsDirty}>
          {t('form.save')}
        </SaveButton>
      </div>
    </Footer>
  );
};

export default injectT(EditorFooter);
