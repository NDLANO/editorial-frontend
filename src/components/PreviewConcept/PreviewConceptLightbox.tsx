/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { injectT, tType } from '@ndla/i18n';
import React, { FC, useState } from 'react';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { FileCompare } from '@ndla/icons/action';
import { TranslateType } from '../../interfaces';
import { Concept } from '../SlateEditor/editorTypes';
import { Portal } from '../Portal';
import Lightbox, { closeLightboxButtonStyle, StyledCross } from '../Lightbox';
import { fetchConcept } from '../../modules/concept/conceptApi';
import PreviewConcept from './PreviewConcept';
import { transformConceptFromApiVersion } from '../../util/conceptUtil';
import StyledFilledButton from '../StyledFilledButton';
import { getYoutubeEmbedUrl } from '../../util/videoUtil';
import { fetchImage } from '../../modules/image/imageApi';
import { parseEmbedTag } from '../../util/embedTagHelpers';
import config from '../../config';

interface Props {
  t: TranslateType;
  getConcept: Function;
}

const lightboxContentStyle = css`
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

const PreviewConceptLightbox: FC<Props & tType> = ({ t, getConcept }) => {
  const [firstConcept, setFirstConcept] = useState<Concept | undefined>(
    undefined,
  );
  const [secondConcept, setSecondConcept] = useState<Concept | undefined>(
    undefined,
  );
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
    const visualElement = await getVisualElement(concept.visualElement);
    setFirstConcept({
      ...concept,
      visualElement: visualElement,
    });
    const secondConceptLanguage =
      concept.supportedLanguages &&
      concept.supportedLanguages.find((l: string) => l !== concept.language);
    onChangePreviewLanguage(
      secondConceptLanguage ? secondConceptLanguage : concept.language,
    );
    setShowPreview(true);
  };

  const previewLanguageConcept = async (language: string) => {
    const originalConcept = getConcept();
    return await fetchConcept(originalConcept.id, language);
  };

  const onChangePreviewLanguage = async (language: string) => {
    const secondConcept = await previewLanguageConcept(language);
    const transformed = transformConceptFromApiVersion(secondConcept);
    const secondVisualElement = await getVisualElement(
      transformed.visualElement?.visualElement,
    );
    setPreviewLanguage(language);
    setSecondConcept({
      ...transformed,
      visualElement: secondVisualElement,
    });
  };

  const getVisualElement = async (visualElementEmbed: string) => {
    const embedTag = parseEmbedTag(visualElementEmbed);
    switch (embedTag?.resource) {
      case 'image':
        const image = await fetchImage(embedTag.resource_id);
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
          url: embedTag?.url
            ? embedTag.url
            : `${config.h5pApiUrl}${embedTag?.path}`,
        };
      default:
        return undefined;
    }
  };

  if (!showPreview || !firstConcept || !secondConcept) {
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
        contentCss={lightboxContentStyle}>
        <PreviewConcept
          firstConcept={firstConcept}
          secondConcept={secondConcept}
          onChangePreviewLanguage={onChangePreviewLanguage}
          previewLanguage={previewLanguage}
          t={t}
        />
      </Lightbox>
    </Portal>
  );
};

export default injectT(PreviewConceptLightbox);
