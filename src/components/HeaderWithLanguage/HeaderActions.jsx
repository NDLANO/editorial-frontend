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

const HeaderActions = ({
  isNewLanguage,
  editUrl,
  getArticle,
  noStatus,
  values,
  t,
  type,
  translateArticle,
  setTranslating,
}) => {
  const { id, language, supportedLanguages, articleType } = values;

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
  if (id) {
    return (
      <Fragment>
        <HeaderSupportedLanguages
          id={id}
          editUrl={editUrl}
          language={language}
          supportedLanguages={supportedLanguages}
        />
        {isNewLanguage && (
          <HeaderLanguagePill current key={`types_${language}`}>
            <Check />
            {t(`language.${language}`)}
          </HeaderLanguagePill>
        )}
        <StyledSplitter />
        {!noStatus && (
          <Fragment>
            <PreviewDraftLightbox
              label={t(`articleType.${articleType}`)}
              typeOfPreview="previewLanguageArticle"
              getArticle={getArticle}>
              {openPreview => (
                <StyledFilledButton type="button" onClick={openPreview}>
                  <FileCompare />
                  {t(`form.previewLanguageArticle.button`)}
                </StyledFilledButton>
              )}
            </PreviewDraftLightbox>
            <StyledSplitter />
          </Fragment>
        )}
        <HeaderLanguagePicker
          emptyLanguages={emptyLanguages}
          editUrl={editUrl}
        />
        {language === 'nb' && !supportedLanguages.includes('nn') && (
          <Fragment>
            <StyledSplitter />
            <TranslateNbToNn
              translateArticle={translateArticle}
              setTranslating={setTranslating}
              editUrl={editUrl}
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
    id: PropTypes.number,
    language: PropTypes.string,
    articleType: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  editUrl: PropTypes.func.isRequired,
  getArticle: PropTypes.func,
  isNewLanguage: PropTypes.bool,
  type: PropTypes.string,
  translateArticle: PropTypes.func,
  setTranslating: PropTypes.func,
};

export default injectT(HeaderActions);
