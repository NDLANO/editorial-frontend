/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useState } from 'react';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { injectT, tType } from '@ndla/i18n';
import { FooterLinkButton } from '@ndla/editor';
import { FileCompare } from '@ndla/icons/action';
import config from '../../config';
import Lightbox, { closeLightboxButtonStyle, StyledCross } from '../Lightbox';
import { fetchConcept } from '../../modules/concept/conceptApi';
import { fetchImage } from '../../modules/image/imageApi';
import { Portal } from '../Portal';
import PreviewLightboxContent from '../PreviewDraft/PreviewLightboxContent';
import { ConceptPreviewType, VisualElement } from '../../interfaces';
import StyledFilledButton from '../StyledFilledButton';
import { parseEmbedTag } from '../../util/embedTagHelpers';
import { getYoutubeEmbedUrl } from '../../util/videoUtil';
import PreviewConcept from './PreviewConcept';

interface Props {
  getConcept: Function;
  typeOfPreview: string;
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

export const getVisualElement = async (element: VisualElement | string) => {
  const visualElement = typeof element === 'string' ? parseEmbedTag(element) : element;

  switch (visualElement?.resource) {
    case 'image':
      const image = await fetchImage(parseInt(visualElement.resource_id));
      return {
        ...visualElement,
        url: image.imageUrl,
      };
    case 'video':
    case 'brightcove':
      return {
        ...visualElement,
        url: `https://players.brightcove.net/${config.brightCoveAccountId}/${config.brightcovePlayerId}_default/index.html?videoId=${visualElement?.videoid}`,
      };
    case 'external':
      return {
        ...visualElement,
        url: visualElement?.url?.includes('youtube')
          ? getYoutubeEmbedUrl(visualElement?.url)
          : visualElement?.url,
      };
    case 'h5p':
      return {
        ...visualElement,
        url: visualElement?.url ? visualElement.url : `${config.h5pApiUrl}${visualElement?.path}`,
      };
    default:
      return undefined;
  }
};

const PreviewConceptLightbox: FC<Props & tType> = ({ t, getConcept, typeOfPreview }) => {
  const [firstConcept, setFirstConcept] = useState<ConceptPreviewType | undefined>(undefined);
  const [secondConcept, setSecondConcept] = useState<ConceptPreviewType | undefined>(undefined);
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
    const firstVisualElement =
      concept.visualElement && (await getVisualElement(concept.visualElement));
    setFirstConcept({ ...concept, visualElementResources: firstVisualElement });
    const secondConceptLanguage =
      concept.supportedLanguages &&
      concept.supportedLanguages.find((l: string) => l !== concept.language);
    onChangePreviewLanguage(secondConceptLanguage ? secondConceptLanguage : concept.language);
    setShowPreview(true);
  };

  const onChangePreviewLanguage = async (language: string) => {
    const originalConcept = getConcept();
    const secondConcept = await fetchConcept(originalConcept.id, language);
    console.log(secondConcept);
    const secondVisualElement =
      secondConcept.visualElement && (await getVisualElement(secondConcept.visualElement));
    setPreviewLanguage(language);
    setSecondConcept({
      ...secondConcept,
      visualElementResources: secondVisualElement,
    });
  };

// Argument of type '{ visualElementResources: any; id: number; revision: number; title?: 
// { title: string; language: string; } | undefined; 
// content?: { content: string; language: string; } | undefined; 
// copyright?: Copyright | undefined; ... 10 more ...; 
// visualElement?: { ...; } | undefined; }' 
// is not assignable to parameter of type 'SetStateAction<ConceptPreviewType | undefined>'.
// Type '{ visualElementResources: any; id: number; revision: number; title?: { title: string; language: string; } | undefined; content?: { content: string; language: string; } | undefined; copyright?: Copyright | undefined; ... 10 more ...; visualElement?: { ...; } | undefined; }' is missing the following properties from type 'ConceptPreviewType': metaImageId, parsedVisualElement, languagets(2345)

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
          getEntityPreview={(concept: ConceptPreviewType) => <PreviewConcept concept={concept} />}
        />
      </Lightbox>
    </Portal>
  );
};

export default injectT(PreviewConceptLightbox);
