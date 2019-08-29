/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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

interface Props {
  t: any;
  isSubmitting: boolean;
  formIsDirty: boolean;
  savedToServer: boolean;
  values: any;
  showReset: boolean;
  error: string;
  getArticle: VoidFunction;
  articleStatus: string;
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
  showReset,
  error,
  getArticle,
  articleStatus,
}) => {
  const optionsFooterStatus = [
    {
      name: 'Kladd',
      id: '#1',
    },
    {
      name: 'Utkast',
      id: '#2',
      active: true,
    },
    {
      name: 'Tilbrukertest',
      id: '#3',
    },
    {
      name: 'Til kvalitetssikring',
      id: '#4',
    },
    {
      name: 'Kvalitetssikret',
      id: '#5',
    },
  ];

  return (
    <Footer>
      {error && <span className="c-errorMessage">{error}</span>}
      <div>
        <FooterQualityInsurance
          messages={{
            buttonLabel: 'Kvalitetssikring',
            heading: 'Kvalitetssikring:',
          }}>
          <QualityAssurance
            getArticle={getArticle}
            values={values}
            articleStatus={articleStatus}
          />
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
          onSave={(comment: string, statusId: string) =>
            console.log(comment, statusId)
          }
          options={optionsFooterStatus}
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
