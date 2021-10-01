/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Check } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import StyledFilledButton from '../StyledFilledButton';
import PreviewDraftLightbox from '../PreviewDraft/PreviewDraftLightbox';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import TranslateNbToNn from './TranslateNbToNn';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import PreviewConceptLightbox from '../PreviewConcept/PreviewConceptLightbox';
import { ConceptApiType } from '../../modules/concept/conceptApiInterfaces';
import { UpdatedDraftApiType } from '../../modules/draft/draftApiInterfaces';

interface PreviewLightBoxProps {
  type: string;
  getEntity: () => ConceptApiType | UpdatedDraftApiType;
  articleType?: string;
  supportedLanguages?: string[];
}

const isConceptReturnType = (
  getEntity: () => ConceptApiType | UpdatedDraftApiType,
): getEntity is () => ConceptApiType => {
  return (getEntity() as ConceptApiType).subjectIds !== undefined;
};

const isDraftReturnType = (
  getEntity: () => ConceptApiType | UpdatedDraftApiType,
): getEntity is () => UpdatedDraftApiType => {
  return !isConceptReturnType(getEntity);
};

const PreviewLightBox = ({
  type,
  getEntity,
  articleType,
  supportedLanguages = [],
}: PreviewLightBoxProps) => {
  const { t } = useTranslation();
  if (type === 'concept' && isConceptReturnType(getEntity) && supportedLanguages.length > 1) {
    return <PreviewConceptLightbox typeOfPreview="previewLanguageArticle" getConcept={getEntity} />;
  } else if (isDraftReturnType(getEntity) && (type === 'standard' || type === 'topic-article')) {
    return (
      <PreviewDraftLightbox
        label={t(`articleType.${articleType!}`)}
        typeOfPreview="previewLanguageArticle"
        getArticle={_ => getEntity()}>
        {(openPreview: () => void) => (
          <StyledFilledButton type="button" onClick={openPreview}>
            <FileCompare />
            {t(`form.previewLanguageArticle.button`)}
          </StyledFilledButton>
        )}
      </PreviewDraftLightbox>
    );
  } else return null;
};

interface Props {
  editUrl?: (url: string) => string;
  formIsDirty: boolean;
  getEntity?: () => ConceptApiType | UpdatedDraftApiType;
  isNewLanguage: boolean;
  isSubmitting?: boolean;
  noStatus: boolean;
  setTranslateOnContinue?: (translateOnContinue: boolean) => void;
  translateToNN?: () => void;
  type: string;
  values: {
    articleType?: string;
    id?: number;
    language: string;
    supportedLanguages: string[];
  };
}

const HeaderActions = ({
  editUrl,
  formIsDirty,
  getEntity,
  isNewLanguage,
  isSubmitting,
  noStatus,
  setTranslateOnContinue,
  type,
  translateToNN,
  values,
}: Props) => {
  const { t } = useTranslation();
  const { articleType, id, language, supportedLanguages = [] } = values;

  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: true },
    { key: 'se', title: t('language.se'), include: false },
    { key: 'unknown', title: t('language.unknown'), include: false },
    { key: 'de', title: t('language.de'), include: false },
  ];
  const emptyLanguages = languages.filter(
    lang => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include,
  );
  const translatableTypes = ['audio', 'concept', 'standard', 'topic-article', 'podcast'];
  if (id && editUrl) {
    return (
      <>
        <HeaderSupportedLanguages
          id={id}
          editUrl={editUrl}
          language={language}
          supportedLanguages={supportedLanguages}
          isSubmitting={isSubmitting}
        />
        {isNewLanguage && (
          <HeaderLanguagePill current key={`types_${language}`}>
            <Check />
            {t(`language.${language}`)}
          </HeaderLanguagePill>
        )}
        <StyledSplitter />
        {!noStatus && getEntity && (
          <>
            <PreviewLightBox
              type={type}
              getEntity={getEntity!}
              articleType={articleType}
              supportedLanguages={supportedLanguages}
            />
            <StyledSplitter />
          </>
        )}
        <HeaderLanguagePicker emptyLanguages={emptyLanguages} editUrl={editUrl} />
        {translatableTypes.includes(type) &&
          language === 'nb' &&
          !!translateToNN &&
          !supportedLanguages.includes('nn') && (
            <>
              <StyledSplitter />
              <TranslateNbToNn
                translateToNN={translateToNN}
                editUrl={editUrl}
                formIsDirty={formIsDirty}
                setTranslateOnContinue={setTranslateOnContinue}
              />
            </>
          )}
        <DeleteLanguageVersion values={values} type={type} />
      </>
    );
  }
  return (
    <HeaderLanguagePill current>
      <Check />
      {t(`language.${language}`)}
    </HeaderLanguagePill>
  );
};

export default HeaderActions;
