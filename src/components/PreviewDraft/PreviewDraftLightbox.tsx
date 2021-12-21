/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import * as articleApi from '../../modules/article/articleApi';
import * as draftApi from '../../modules/draft/draftApi';
import Lightbox, { closeLightboxButtonStyle, StyledCross } from '../Lightbox';
import PreviewLightboxContent from './PreviewLightboxContent';
import { ActionButton } from '../../containers/FormikForm';
import Spinner from '../Spinner';
import { Portal } from '../Portal';
import PreviewDraft from './PreviewDraft';
import { ArticleConverterApiType } from '../../modules/article/articleApiInterfaces';
import { DraftApiType, UpdatedDraftApiType } from '../../modules/draft/draftApiInterfaces';
import { LocaleType, PartialRecord, TypeOfPreview } from '../../interfaces';
import { createGuard } from '../../util/guards';
import { updatedDraftApiTypeToDraftApiType } from '../../containers/ArticlePage/TopicArticlePage/topicHelpers';

const twoArticlesCloseButtonStyle = css`
  position: absolute;
  right: 20px;
`;

interface StyledProps {
  typeOfPreview: TypeOfPreview;
}

const StyledPreviewDraft = styled.div<StyledProps>`
  ${p => (p.typeOfPreview === 'preview' ? 'text-align: left;' : '')};
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

const closeButtonStyle = (typeOfPreview: TypeOfPreview) => css`
  ${closeLightboxButtonStyle};
  ${typeOfPreview !== 'preview' ? twoArticlesCloseButtonStyle : null};
  margin-right: 0;
  margin-top: -15px;
`;

const customSpinnerStyle = css`
  display: inline-block;
  margin-right: ${spacing.xsmall};
`;

const isDraftApiType = createGuard<DraftApiType>('title', { type: 'object' });

// Transform article if title is a string. If not it's probably an api compatible article
const toApiVersion = (
  article: DraftApiType | UpdatedDraftApiType,
): DraftApiType & { language?: string } => {
  return isDraftApiType(article)
    ? article
    : { ...updatedDraftApiTypeToDraftApiType(article), language: article.language };
};

interface Props {
  children?: (openPreview: () => Promise<void>) => ReactElement;
  getArticle: (preview: boolean) => UpdatedDraftApiType | DraftApiType;
  label: string;
  typeOfPreview: TypeOfPreview;
  version?: DraftApiType;
}

const PreviewDraftLightbox = ({ getArticle, typeOfPreview, version, label, children }: Props) => {
  const [firstArticle, setFirstArticle] = useState<ArticleConverterApiType | undefined>(undefined);
  const [secondArticle, setSecondArticle] = useState<ArticleConverterApiType | undefined>(
    undefined,
  );
  const [previewLanguage, setPreviewLanguage] = useState<string | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onClosePreview = () => {
    setFirstArticle(undefined);
    setSecondArticle(undefined);
    setPreviewLanguage(undefined);
    setShowPreview(false);
    setLoading(false);
  };

  const onChangePreviewLanguage = async (language: string) => {
    const secondArticle = await previewLanguageArticle(language);
    setPreviewLanguage(language);
    setSecondArticle(secondArticle);
  };

  const openPreview = async () => {
    const article = toApiVersion(getArticle(true));

    const secondArticleLanguage =
      article.supportedLanguages?.find(l => l !== article.language) ?? article.language;

    const types: PartialRecord<TypeOfPreview, () => Promise<ArticleConverterApiType>> = {
      previewLanguageArticle: () => previewLanguageArticle(secondArticleLanguage!),
      previewVersion: () => previewVersion(article.language!),
      previewProductionArticle: previewProductionArticle,
    };
    setLoading(true);
    const firstArticle = await articleApi.getPreviewArticle(article, article.language!);

    const secondArticle = await types[typeOfPreview]?.();
    setFirstArticle(firstArticle);
    setSecondArticle(secondArticle);
    setShowPreview(true);
    setPreviewLanguage(secondArticleLanguage);
    setLoading(false);
  };

  const previewVersion = async (language: string) => {
    // version is not null if typeOfPreview === 'previewVersion'.
    const article = await articleApi.getPreviewArticle(version!, language);
    return article;
  };

  const previewProductionArticle = async () => {
    const { id, language } = getArticle(true) as UpdatedDraftApiType;
    const article = await articleApi.getArticleFromArticleConverter(id!, language!);
    return article;
  };

  const previewLanguageArticle = async (language: string) => {
    const originalArticle = toApiVersion(getArticle(true));
    const draftOtherLanguage = await draftApi.fetchDraft(originalArticle.id, language);
    const article = await articleApi.getPreviewArticle(draftOtherLanguage, language);
    return article;
  };

  if (!showPreview) {
    if (children) {
      return children(openPreview);
    }
    return (
      <ActionButton onClick={openPreview} disabled={loading} link data-testid={typeOfPreview}>
        {loading && <Spinner appearance="small" css={customSpinnerStyle} />}
        {t(`form.${typeOfPreview}.button`)}
      </ActionButton>
    );
  }

  const closeButton = (
    <Button
      css={closeButtonStyle(typeOfPreview)}
      stripped
      data-testid="closePreview"
      onClick={onClosePreview}>
      <StyledCross />
    </Button>
  );

  return (
    <Portal isOpened>
      <StyledPreviewDraft typeOfPreview={typeOfPreview}>
        <Lightbox
          display
          onClose={onClosePreview}
          closeButton={closeButton}
          contentCss={lightboxContentStyle(typeOfPreview)}>
          <PreviewLightboxContent
            firstEntity={firstArticle!}
            secondEntity={secondArticle!}
            label={label}
            typeOfPreview={typeOfPreview}
            onChangePreviewLanguage={onChangePreviewLanguage}
            previewLanguage={previewLanguage!}
            getEntityPreview={(article, label, contentType) => (
              <PreviewDraft
                article={article as ArticleConverterApiType}
                label={label}
                contentType={contentType}
                language={previewLanguage! as LocaleType}
              />
            )}
          />
        </Lightbox>
      </StyledPreviewDraft>
    </Portal>
  );
};

export default PreviewDraftLightbox;
