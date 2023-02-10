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
import { IUpdatedArticle, IArticle } from '@ndla/types-draft-api';

import { PreviewDraftLightbox } from '../../components';
import PreviewDraftLightboxV2 from '../../components/PreviewDraft/PreviewDraftLightboxV2';
import config from '../../config';

interface Props {
  showFromArticleApi: boolean;
  article: IArticle;
  getArticle: (preview: boolean) => IUpdatedArticle;
  resetVersion: (version: IArticle, language: string, showFromArticleApi: boolean) => Promise<void>;
  version: IArticle;
  current: boolean;
  currentLanguage: string;
}

const VersionActionButtons = ({
  showFromArticleApi,
  current,
  article,
  getArticle,
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
      {!config.useArticleConverter ? (
        <PreviewDraftLightboxV2
          type="version"
          article={version}
          language={currentLanguage}
          wrapperFunctionForButton={btn => (
            <Tooltip tooltip={t('form.previewVersion')}>{btn}</Tooltip>
          )}
          activateButton={
            <StyledAccordionsPanelIconButton type="button" data-testid="previewVersion">
              <Eye />
            </StyledAccordionsPanelIconButton>
          }
        />
      ) : (
        <PreviewDraftLightbox
          articleId={article.id}
          currentArticleLanguage={currentLanguage}
          label={t(`articleType.${article.articleType}`)}
          typeOfPreview={showFromArticleApi ? 'previewProductionArticle' : 'previewVersion'}
          getArticle={getArticle}
          version={version}>
          {(openPreview: VoidFunction) => (
            <Tooltip tooltip={t('form.previewVersion')}>
              <StyledAccordionsPanelIconButton
                type="button"
                data-testid="previewVersion"
                onClick={openPreview}>
                <Eye />
              </StyledAccordionsPanelIconButton>
            </Tooltip>
          )}
        </PreviewDraftLightbox>
      )}

      <Tooltip tooltip={t('form.resetToVersion')}>
        <StyledAccordionsPanelIconButton
          type="button"
          data-testid="resetToVersion"
          onClick={() => resetVersion(version, article.title!.language, showFromArticleApi)}>
          <Restore />
        </StyledAccordionsPanelIconButton>
      </Tooltip>
    </>
  );
};

export default VersionActionButtons;
