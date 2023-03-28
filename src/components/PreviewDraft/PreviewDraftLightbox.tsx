/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { IArticle, IUpdatedArticle } from '@ndla/types-backend/draft-api';
import { ErrorMessage, OneColumn } from '@ndla/ui';
import uniq from 'lodash/uniq';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updatedDraftApiTypeToDraftApiType } from '../../containers/ArticlePage/articleTransformers';
import { LocaleType, PartialRecord, TypeOfPreview } from '../../interfaces';
import {
  getArticleFromArticleConverter,
  getPreviewArticle,
} from '../../modules/article/articleApi';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import { fetchDraft } from '../../modules/draft/draftApi';
import { createGuard } from '../../util/guards';
import Lightbox, { StyledButton, StyledCross } from '../Lightbox';
import { Portal } from '../Portal';
import Spinner from '../Spinner';
import PreviewDraft from './PreviewDraft';
import PreviewLightboxContent from './PreviewLightboxContent';

const twoArticlesCloseButtonStyle = css`
  position: absolute;
  right: 20px;
`;

interface StyledProps {
  typeOfPreview: TypeOfPreview;
}

const StyledPreviewDraft = styled.div<StyledProps>`
  ${(p) => (p.typeOfPreview === 'preview' ? 'text-align: left;' : '')};
`;

const lightboxContentStyle = (typeOfPreview: TypeOfPreview) =>
  typeOfPreview !== 'preview'
    ? css`
        padding: 1rem 0;
        width: 98%;
        margin: 0 auto;
        max-width: 100%;
        display: flex;
      `
    : css`
        margin: 1rem 0;
        padding: 1rem 0;
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        max-width: 1024px;
      `;

const StyledCloseButton = styled(StyledButton)<{ previewType: TypeOfPreview }>`
  ${(props) => props.previewType !== 'preview' && twoArticlesCloseButtonStyle};
  margin-right: 0;
  margin-top: -15px;
`;

const StyledSpinner = styled(Spinner)`
  display: inline-block;
  margin-right: ${spacing.xsmall};
`;

const isDraftApiType = createGuard<IArticle>('title', { type: 'object' });

// Transform article if title is a string. If not it's probably an api compatible article
const toApiVersion = (article: IArticle | IUpdatedArticle, id: number): IArticle => {
  return isDraftApiType(article) ? article : updatedDraftApiTypeToDraftApiType(article, id);
};

interface Props {
  children?: (openPreview: () => Promise<void>) => ReactElement;
  getArticle: (preview: boolean) => IUpdatedArticle | IArticle;
  label: string;
  typeOfPreview: TypeOfPreview;
  version?: IArticle;
  supportedLanguages?: string[];
  articleId?: number;
  currentArticleLanguage?: string;
}

const PreviewDraftLightbox = ({
  getArticle,
  typeOfPreview,
  version,
  label,
  children,
  supportedLanguages = [],
  articleId,
  currentArticleLanguage,
}: Props) => {
  const [firstArticle, setFirstArticle] = useState<ArticleConverterApiType | undefined>(undefined);
  const [secondArticle, setSecondArticle] = useState<ArticleConverterApiType | undefined>(
    undefined,
  );
  const [previewLanguage, setPreviewLanguage] = useState<string | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMissingValues, setIsMissingValues] = useState(false);
  const { t } = useTranslation();

  const onClosePreview = () => {
    setFirstArticle(undefined);
    setSecondArticle(undefined);
    setPreviewLanguage(undefined);
    setShowPreview(false);
    setLoading(false);
  };

  const onChangePreviewLanguage = async (language: string) => {
    if (!articleId) return setIsMissingValues(true);
    const secondArticle = await previewLanguageArticle(articleId, language);
    setPreviewLanguage(language);
    setSecondArticle(secondArticle);
  };

  const openPreview = async () => {
    if (!articleId || !currentArticleLanguage) return setIsMissingValues(true);
    const article = toApiVersion(getArticle(true), articleId);

    const allSupportedLanguages = uniq(supportedLanguages.concat(article.supportedLanguages ?? []));

    const secondArticleLanguage =
      allSupportedLanguages?.find((l) => l !== currentArticleLanguage) ?? currentArticleLanguage;

    const types: PartialRecord<TypeOfPreview, () => Promise<ArticleConverterApiType>> = {
      previewLanguageArticle: () => previewLanguageArticle(articleId, secondArticleLanguage),
      previewVersion: () => previewVersion(currentArticleLanguage),
      previewProductionArticle: () => previewProductionArticle(articleId, currentArticleLanguage),
    };
    setLoading(true);
    const firstArticle = await getPreviewArticle(article, currentArticleLanguage);

    const secondArticle = await types[typeOfPreview]?.();
    setFirstArticle(firstArticle);
    setSecondArticle(secondArticle);
    setShowPreview(true);
    setPreviewLanguage(secondArticleLanguage);
    setLoading(false);
  };

  const previewVersion = async (language: string) => {
    // version is not null if typeOfPreview === 'previewVersion'.
    return getPreviewArticle(version!, language);
  };

  const previewProductionArticle = async (id: number, language: string) => {
    return getArticleFromArticleConverter(id, language);
  };

  const previewLanguageArticle = async (id: number, language: string) => {
    const draftOtherLanguage = await fetchDraft(id, language);
    return getPreviewArticle(draftOtherLanguage, language);
  };

  if (!showPreview) {
    if (children) {
      return children(openPreview);
    }
    return (
      <ButtonV2 onClick={openPreview} disabled={loading} variant="link" data-testid={typeOfPreview}>
        {loading && <StyledSpinner appearance="small" />}
        {t(`form.${typeOfPreview}.button`)}
      </ButtonV2>
    );
  }

  const closeButton = (
    <StyledCloseButton
      previewType={typeOfPreview}
      variant="stripped"
      data-testid="closePreview"
      onClick={onClosePreview}
    >
      <StyledCross />
    </StyledCloseButton>
  );

  return (
    <Portal isOpened>
      <StyledPreviewDraft typeOfPreview={typeOfPreview}>
        {isMissingValues ? (
          <ErrorMessage messages={{ title: 'Id or Language is missing from Formik Values' }} />
        ) : (
          <Lightbox
            display
            onClose={onClosePreview}
            closeButton={closeButton}
            contentCss={lightboxContentStyle(typeOfPreview)}
          >
            <PreviewLightboxContent
              firstEntity={firstArticle!}
              secondEntity={secondArticle!}
              label={label}
              typeOfPreview={typeOfPreview}
              onChangePreviewLanguage={onChangePreviewLanguage}
              previewLanguage={previewLanguage!}
              getEntityPreview={(article, label, contentType) => (
                <OneColumn>
                  <PreviewDraft
                    article={article as ArticleConverterApiType}
                    label={label}
                    contentType={contentType}
                    language={previewLanguage! as LocaleType}
                  />
                </OneColumn>
              )}
            />
          </Lightbox>
        )}
      </StyledPreviewDraft>
    </Portal>
  );
};

export default PreviewDraftLightbox;
