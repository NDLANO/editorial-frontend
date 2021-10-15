/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { FooterLinkButton } from '@ndla/editor';
import { FileCompare } from '@ndla/icons/action';
import config from '../../config';
import Lightbox, { closeLightboxButtonStyle, StyledCross } from '../Lightbox';
import { fetchConcept } from '../../modules/concept/conceptApi';
import { fetchImage } from '../../modules/image/imageApi';
import { Portal } from '../Portal';
import PreviewLightboxContent from '../PreviewDraft/PreviewLightboxContent';
import StyledFilledButton from '../StyledFilledButton';
import { parseEmbedTag } from '../../util/embedTagHelpers';
import { getYoutubeEmbedUrl } from '../../util/videoUtil';
import PreviewConcept from './PreviewConcept';
import { ConceptType } from '../../modules/concept/conceptApiInterfaces';
import { transformApiToCleanConcept } from '../../modules/concept/conceptApiUtil';
import { TypeOfPreview, VisualElement } from '../../interfaces';

interface Props {
  getConcept: () => ConceptType;
  typeOfPreview: TypeOfPreview;
}

const lightboxContentStyle = () => css`
  margin: 1rem 0;
  padding: 1rem 0;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  max-width: 1024px;
`;

const closeButtonStyle = css`
  ${closeLightboxButtonStyle};
  margin-right: 0;
  margin-top: -15px;
`;

const PreviewConceptLightbox = ({ getConcept, typeOfPreview }: Props) => {
  const { t } = useTranslation();
  const [firstConcept, setFirstConcept] = useState<ConceptType | undefined>(undefined);
  const [secondConcept, setSecondConcept] = useState<ConceptType | undefined>(undefined);
  const [previewLanguage, setPreviewLanguage] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const onClosePreview = () => {
    setFirstConcept(undefined);
    setSecondConcept(undefined);
    setPreviewLanguage('');
    setShowPreview(false);
  };

  const openPreview = async () => {
    const concept = getConcept();
    const parsed = await getVisualElement(concept.visualElement);
    setFirstConcept(parsed ? { ...concept, parsedVisualElement: parsed } : concept);
    const secondConceptLanguage = concept.supportedLanguages?.find(l => l !== concept.language);
    onChangePreviewLanguage(secondConceptLanguage ?? concept.language);
    setShowPreview(true);
  };

  const onChangePreviewLanguage = async (language: string) => {
    const originalConcept = getConcept();
    const second = await fetchConcept(originalConcept.id, language).then(concept =>
      transformApiToCleanConcept(concept, language),
    );
    const parsed = await getVisualElement(second.visualElement);
    setPreviewLanguage(language);
    setSecondConcept(parsed ? { ...second, parsedVisualElement: parsed } : second);
  };

  const getVisualElement = async (
    visualElementEmbed: string,
  ): Promise<VisualElement | undefined> => {
    const embedTag = parseEmbedTag(visualElementEmbed);
    switch (embedTag?.resource) {
      case 'image':
        const image = await fetchImage(parseInt(embedTag.resource_id));
        return {
          ...embedTag,
          url: image.imageUrl,
        };
      case 'video':
      case 'brightcove':
        return {
          ...embedTag,
          url: `https://players.brightcove.net/${config.brightCoveAccountId}/${config.brightcovePlayerId}_default/index.html?videoId=${embedTag?.videoid}`,
        };
      case 'external':
        return {
          ...embedTag,
          url: embedTag?.url?.includes('youtube')
            ? getYoutubeEmbedUrl(embedTag?.url)
            : embedTag?.url,
        };
      case 'h5p':
        return {
          ...embedTag,
          url: embedTag?.url ? embedTag.url : `${config.h5pApiUrl}${embedTag?.path}`,
        };
      default:
        return undefined;
    }
  };

  if (!showPreview || !firstConcept || !secondConcept) {
    if (typeOfPreview === 'preview') {
      return (
        <FooterLinkButton bold onClick={openPreview}>
          {t('form.preview.button')}
        </FooterLinkButton>
      );
    }
    return (
      <StyledFilledButton type="button" onClick={openPreview}>
        <FileCompare />
        {t(`form.previewLanguageArticle.button`)}
      </StyledFilledButton>
    );
  }

  const closeButton = (
    <Button css={closeButtonStyle} stripped onClick={onClosePreview}>
      <StyledCross />
    </Button>
  );

  return (
    <Portal isOpened>
      <Lightbox
        display
        onClose={onClosePreview}
        closeButton={closeButton}
        contentCss={lightboxContentStyle()}>
        <PreviewLightboxContent
          firstEntity={firstConcept}
          secondEntity={secondConcept}
          onChangePreviewLanguage={onChangePreviewLanguage}
          previewLanguage={previewLanguage}
          typeOfPreview={typeOfPreview}
          contentType="concept"
          label=""
          getEntityPreview={concept => <PreviewConcept concept={concept as ConceptType} />}
        />
      </Lightbox>
    </Portal>
  );
};

export default PreviewConceptLightbox;
