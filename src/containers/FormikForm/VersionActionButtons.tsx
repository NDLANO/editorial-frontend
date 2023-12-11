/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Eye, Restore } from '@ndla/icons/editor';
import { IArticle } from '@ndla/types-backend/draft-api';

import PreviewDraftLightboxV2 from '../../components/PreviewDraft/PreviewDraftLightboxV2';

interface Props {
  showFromArticleApi: boolean;
  article: IArticle;
  resetVersion: (version: IArticle, language: string, showFromArticleApi: boolean) => Promise<void>;
  version: IArticle;
  current: boolean;
  currentLanguage: string;
}

const StyledActionButton = styled.button`
  all: unset;
  color: ${colors.brand.primary};
  height: ${spacing.normal};
  width: ${spacing.normal};
  transition: background 200ms ease;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: ${spacing.normal};
    height: ${spacing.normal};
    cursor: pointer;
  }
  &:hover,
  &:focus {
    background: ${colors.brand.tertiary};
  }
`;

const VersionActionButtons = ({
  showFromArticleApi,
  current,
  article,
  resetVersion,
  version,
  currentLanguage,
}: Props) => {
  const { t } = useTranslation();
  // we only show preview and reset for current versions if they are the ONLY version
  // ie. that they were published before versions were introduced
  if (current && !showFromArticleApi) return null;
  return (
    <>
      <PreviewDraftLightboxV2
        type="version"
        article={version}
        language={currentLanguage}
        activateButton={
          <StyledActionButton
            type="button"
            title={t('form.previewVersion')}
            aria-label={t('form.previewVersion')}
            data-testid="previewVersion"
          >
            <Eye />
          </StyledActionButton>
        }
      />
      <StyledActionButton
        aria-label={t('form.resetToVersion')}
        title={t('form.resetToVersion')}
        type="button"
        data-testid="resetToVersion"
        onClick={() => resetVersion(version, article.title!.language, showFromArticleApi)}
      >
        <Restore />
      </StyledActionButton>
    </>
  );
};

export default VersionActionButtons;
