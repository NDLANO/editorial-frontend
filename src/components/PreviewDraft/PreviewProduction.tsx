/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import PreviewDraft from './PreviewDraft';
import StyledPreviewTwoArticles from './StyledPreviewTwoArticles';

interface Props {
  firstEntity: ArticleConverterApiType;
  secondEntity: ArticleConverterApiType;
  contentType?: string;
  label: string;
  previewLanguage: string;
}

const PreviewProduction = ({
  firstEntity,
  secondEntity,
  label,
  previewLanguage,
  contentType,
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.current')}
        </h2>
        <PreviewDraft
          article={firstEntity}
          label={label}
          contentType={contentType}
          language={previewLanguage}
        />
      </StyledPreviewTwoArticles>
      <StyledPreviewTwoArticles>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewProductionArticle.version', { revision: secondEntity.revision })}
        </h2>
        <PreviewDraft
          article={secondEntity}
          label={label}
          contentType={contentType}
          language={previewLanguage}
        />
      </StyledPreviewTwoArticles>
    </>
  );
};

export default PreviewProduction;
