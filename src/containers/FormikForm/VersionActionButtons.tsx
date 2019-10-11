import React from 'react';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { Eye, Restore } from '@ndla/icons/editor';
import { StyledAccordionsPanelIconButton } from '@ndla/accordion';

import { PreviewDraftLightbox } from '../../components';
import { ArticleType, TranslateType } from '../../interfaces';

interface Props {
  showFromArticleApi: boolean;
  article: ArticleType;
  getArticle: VoidFunction;
  resetVersion: (version: ArticleType) => void;
  version: ArticleType;
  t: TranslateType;
  current: boolean;
}

const VersionActionButtons: React.FC<Props> = ({
  showFromArticleApi,
  current,
  article,
  getArticle,
  resetVersion,
  version,
  t,
}) => {
  // we only show preview and reset for current versions if they are the ONLY version
  // ie. that they were published before versions were introduced
  if (current && !showFromArticleApi) return null;
  return (
    <>
      <PreviewDraftLightbox
        label={t(`articleType.${article.articleType}`)}
        typeOfPreview={
          showFromArticleApi ? 'previewProductionArticle' : 'previewVersion'
        }
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

      <Tooltip tooltip={t('form.resetToVersion')}>
        <StyledAccordionsPanelIconButton
          type="button"
          data-testid="resetToVersion"
          onClick={() => resetVersion(version)}>
          <Restore />
        </StyledAccordionsPanelIconButton>
      </Tooltip>
    </>
  );
};

export default injectT(VersionActionButtons);
