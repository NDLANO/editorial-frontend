import React, { useState, useEffect } from 'react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Lightbox, {
  closeLightboxButtonStyle,
  StyledCross,
} from '../../Lightbox';
import { Portal } from '../../Portal';
import PreviewLightboxContent from '../../PreviewDraft/PreviewLightboxContent';
import { fetchPreviews } from '../../PreviewDraft/previewHooks';
import { Article, PreviewTypes } from '../editorTypes';

interface Props {
  typeOfPreview: PreviewTypes;
  closePreview: VoidFunction;
  label: string;
  getArticle: (b: boolean) => Article;
}

const twoArticlesCloseButtonStyle = css`
  position: absolute;
  right: 20px;
`;

const StyledPreviewDraft = styled.div<{ typeOfPreview: PreviewTypes }>`
  z-index: 1001;
  ${props => (props.typeOfPreview === 'preview' ? 'text-align: left;' : '')};
`;

const lightboxContentStyle = (typeOfPreview?: PreviewTypes) =>
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

const closeButtonStyle = (typeOfPreview?: PreviewTypes) => css`
  ${closeLightboxButtonStyle}
  ${typeOfPreview !== 'preview'
    ? twoArticlesCloseButtonStyle
    : null}

  margin-right: 0;
  margin-top: -15px;
`;

const ArticlePreviews: React.FC<Props> = ({
  typeOfPreview,
  closePreview,
  label,
  getArticle,
}) => {
  const [state, setState] = useState({ loading: true });

  const article = getArticle(true);

  const [secondArticleLanguage, setSecondLanguage] = useState(
    article.supportedLanguages.find(l => l !== article.language),
  );

  useEffect(() => {
    fetchPreviews(typeOfPreview, article, setState, secondArticleLanguage);
  }, [secondArticleLanguage]);

  const closeButton = (
    <Button
      css={closeButtonStyle(typeOfPreview)}
      stripped
      onClick={closePreview}>
      <StyledCross />
    </Button>
  );

  return (
    <Portal isOpened>
      <StyledPreviewDraft typeOfPreview={typeOfPreview}>
        <Lightbox
          display
          onClose={closePreview}
          closeButton={closeButton}
          contentCss={lightboxContentStyle(typeOfPreview)}>
          <PreviewLightboxContent
            label={label}
            typeOfPreview={typeOfPreview}
            onChangePreviewLanguage={setSecondLanguage}
            {...state}
          />
        </Lightbox>
      </StyledPreviewDraft>
    </Portal>
  );
};

export default ArticlePreviews;
