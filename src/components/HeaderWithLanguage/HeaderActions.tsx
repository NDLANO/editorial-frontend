/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import { Check } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { injectT, tType } from '@ndla/i18n';
import StyledFilledButton from '../StyledFilledButton';
import PreviewDraftLightbox from '../PreviewDraft/PreviewDraftLightbox';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import TranslateNbToNn from './TranslateNbToNn';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import PreviewConceptLightbox from '../PreviewConcept/PreviewConceptLightbox';

interface PreviewLightBoxProps {
  type: string;
  getEntity: Function;
  articleType: string;
  supportedLanguages?: string[];
}

const PreviewLightBox = ({
  type,
  getEntity,
  articleType,
  supportedLanguages = [],
  t,
}: PreviewLightBoxProps & tType) => {
  if (type === 'concept')
    return supportedLanguages.length > 1 ? (
      <PreviewConceptLightbox typeOfPreview="previewLanguageArticle" getConcept={getEntity} />
    ) : null;
  else if (type === 'standard' || type === 'topic-article')
    return (
      <PreviewDraftLightbox
        label={t(`articleType.${articleType}`)}
        typeOfPreview="previewLanguageArticle"
        getArticle={getEntity}>
        {(openPreview: () => void) => (
          <StyledFilledButton type="button" onClick={openPreview}>
            <FileCompare />
            {t(`form.previewLanguageArticle.button`)}
          </StyledFilledButton>
        )}
      </PreviewDraftLightbox>
    );
  else return null;
};

interface Props {
  editUrl: (url: string) => string;
  formIsDirty: boolean;
  getEntity: Function;
  isNewLanguage: boolean;
  isSubmitting: boolean;
  noStatus: boolean;
  setTranslateOnContinue: (translateOnContinue: boolean) => void;
  translateToNN: () => void;
  type: string;
  values: {
    articleType: string;
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
  t,
  type,
  translateToNN,
  values,
}: Props & tType) => {
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
  const translatableTypes = ['concept', 'standard', 'topic-article', 'podcast'];

  if (id) {
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
              getEntity={getEntity}
              articleType={articleType}
              supportedLanguages={supportedLanguages}
              t={t}
            />
            <StyledSplitter />
          </>
        )}
        <HeaderLanguagePicker emptyLanguages={emptyLanguages} editUrl={editUrl} />
        {translatableTypes.includes(type) &&
          language === 'nb' &&
          !supportedLanguages.includes('nn') && (
            <Fragment>
              <StyledSplitter />
              <TranslateNbToNn
                translateToNN={translateToNN}
                editUrl={editUrl}
                formIsDirty={formIsDirty}
                setTranslateOnContinue={setTranslateOnContinue}
              />
            </Fragment>
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

// HeaderActions.propTypes = {
//   editUrl: PropTypes.func.isRequired,
//   formIsDirty: PropTypes.bool,
//   getEntity: PropTypes.func,
//   isNewLanguage: PropTypes.bool,
//   isSubmitting: PropTypes.bool,
//   noStatus: PropTypes.bool,
//   setTranslateOnContinue: PropTypes.func,
//   translateToNN: PropTypes.func,
//   type: PropTypes.string,
//   values: PropTypes.shape({
//     articleType: PropTypes.string,
//     id: PropTypes.number,
//     language: PropTypes.string,
//     supportedLanguages: PropTypes.arrayOf(PropTypes.string),
//   }),
// };

export default injectT(HeaderActions);
