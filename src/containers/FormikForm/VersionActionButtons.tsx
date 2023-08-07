/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { Eye, Restore } from '@ndla/icons/editor';
import { StyledAccordionsPanelIconButton } from '@ndla/accordion';
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
          <StyledAccordionsPanelIconButton
            type="button"
            title={t('form.previewVersion')}
            aria-label={t('form.previewVersion')}
            data-testid="previewVersion"
          >
            <Eye />
          </StyledAccordionsPanelIconButton>
        }
      />

      <Tooltip tooltip={t('form.resetToVersion')}>
        <StyledAccordionsPanelIconButton
          type="button"
          data-testid="resetToVersion"
          onClick={() => resetVersion(version, article.title!.language, showFromArticleApi)}
        >
          <Restore />
        </StyledAccordionsPanelIconButton>
      </Tooltip>
    </>
  );
};

export default VersionActionButtons;
