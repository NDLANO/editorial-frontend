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
import {
  IUpdatedArticle as UpdatedDraftApiType,
  IArticle as DraftApiType,
} from '@ndla/types-draft-api';

import { PreviewDraftLightbox } from '../../components';

interface Props {
  showFromArticleApi: boolean;
  article: DraftApiType;
  getArticle: (preview: boolean) => UpdatedDraftApiType;
  resetVersion: (
    version: DraftApiType,
    language: string,
    showFromArticleApi: boolean,
  ) => Promise<void>;
  version: DraftApiType;
  current: boolean;
}

const VersionActionButtons = ({
  showFromArticleApi,
  current,
  article,
  getArticle,
  resetVersion,
  version,
}: Props) => {
  const { t } = useTranslation();
  // we only show preview and reset for current versions if they are the ONLY version
  // ie. that they were published before versions were introduced
  if (current && !showFromArticleApi) return null;
  return (
    <>
      <PreviewDraftLightbox
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
