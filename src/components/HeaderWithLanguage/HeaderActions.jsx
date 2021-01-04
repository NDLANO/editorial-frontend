/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Check } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import StyledFilledButton from '../StyledFilledButton';
import PreviewDraftLightbox from '../PreviewDraft/PreviewDraftLightbox';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import TranslateNbToNn from './TranslateNbToNn';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import PreviewConceptLightbox from '../PreviewConcept/PreviewConceptLightbox';

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
  translateArticle,
  values,
}) => {
  const { articleType, id, language, supportedLanguages } = values;

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
    lang =>
      lang.key !== language &&
      !supportedLanguages.includes(lang.key) &&
      lang.include,
  );
  const translatableTypes = ['concept', 'standard', 'topic-article'];
  const PreviewLightbox =
    type === 'concept' ? (
      supportedLanguages.length > 1 && (
        <PreviewConceptLightbox
          typeOfPreview="previewLanguageArticle"
          getConcept={getEntity}
        />
      )
    ) : (
      <PreviewDraftLightbox
        label={t(`articleType.${articleType}`)}
        typeOfPreview="previewLanguageArticle"
        getArticle={getEntity}>
        {openPreview => (
          <StyledFilledButton type="button" onClick={openPreview}>
            <FileCompare />
            {t(`form.previewLanguageArticle.button`)}
          </StyledFilledButton>
        )}
      </PreviewDraftLightbox>
    );

  if (id) {
    return (
      <Fragment>
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
          <Fragment>
            {PreviewLightbox}
            <StyledSplitter />
          </Fragment>
        )}
        <HeaderLanguagePicker
          emptyLanguages={emptyLanguages}
          editUrl={editUrl}
        />
        {translatableTypes.includes(type) &&
          language === 'nb' &&
          !supportedLanguages.includes('nn') && (
            <Fragment>
              <StyledSplitter />
              <TranslateNbToNn
                translateArticle={translateArticle}
                editUrl={editUrl}
                formIsDirty={formIsDirty}
                setTranslateOnContinue={setTranslateOnContinue}
              />
            </Fragment>
          )}
        <DeleteLanguageVersion values={values} type={type} />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div>
        <HeaderLanguagePill current>
          <Check />
          {t(`language.${language}`)}
        </HeaderLanguagePill>
      </div>
      <div />
    </Fragment>
  );
};

HeaderActions.propTypes = {
  noStatus: PropTypes.bool,
  values: PropTypes.shape({
    articleType: PropTypes.string,
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  editUrl: PropTypes.func.isRequired,
  getEntity: PropTypes.func,
  isNewLanguage: PropTypes.bool,
  type: PropTypes.string,
  translateArticle: PropTypes.func,
  setTranslateOnContinue: PropTypes.func,
  isSubmitting: PropTypes.bool,
  formIsDirty: PropTypes.bool,
};

export default injectT(HeaderActions);
