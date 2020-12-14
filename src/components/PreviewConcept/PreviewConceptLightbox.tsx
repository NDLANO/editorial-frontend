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
import Lightbox, {
  closeLightboxButtonStyle,
  StyledCross,
} from '../Lightbox';
import { fetchConcept } from '../../modules/concept/conceptApi';
import PreviewConcept from './PreviewConcept';
import { transformConceptFromApiVersion } from '../../util/conceptUtil';
import StyledFilledButton from '../StyledFilledButton';

interface Props {
  t: TranslateType;
  getConcept: Function;
  label?: string;
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

const emptyConcept = {
  id: 0,
  title: '',
  tags: [],
  content: '',
  metaImage: {
    id: 0,
    alt: '',
  },
  metaDescription: '',
  articleType: '',
  copyright: {
    agreementId: 0,
    license: {
      license: '',
    },
    creators: [],
    processors: [],
    rightsholders: [],
  },
  notes: [],
  language: '',
  published: '',
  supportedLanguages: [],
  articleId: 0,
  created: '',
  source: '',
  subjectIds: [],
};

const PreviewConceptLightbox: FC<Props & tType> = ({ t, getConcept }) => {
  const [firstConcept, setFirstConcept] = useState<Concept>(emptyConcept);
  const [secondConcept, setSecondConcept] = useState<Concept>(emptyConcept);
  const [previewLanguage, setPreviewLanguage] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const onClosePreview = () => {
    setFirstConcept(emptyConcept);
    setSecondConcept(emptyConcept);
    setPreviewLanguage('');
    setShowPreview(false);
  };

  const openPreview = async () => {
    const concept = getConcept();
    const secondConceptLanguage =
      concept.supportedLanguages &&
      concept.supportedLanguages.find((l: string) => l !== concept.language);
    const secondConcept = await previewLanguageConcept(secondConceptLanguage);
    setFirstConcept(concept);
    setPreviewLanguage(
      secondConceptLanguage ? secondConceptLanguage : concept.language,
    );
    setSecondConcept(transformConceptFromApiVersion(secondConcept));
    setShowPreview(true);
  };

  const previewLanguageConcept = async (language: string) => {
    const originalConcept = getConcept();
    return await fetchConcept(originalConcept.id, language);
  };

  const onChangePreviewLanguage = async (language: string) => {
    const secondConcept = await previewLanguageConcept(language);
    setPreviewLanguage(language);
    setSecondConcept(transformConceptFromApiVersion(secondConcept));
  };

  if (!showPreview) {
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
