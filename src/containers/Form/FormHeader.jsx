/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from 'react-emotion';
import { colors, fonts, spacing } from '@ndla/core';
import {
  Camera,
  SquareAudio,
} from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import {
  ContentTypeBadge,
  constants,
} from '@ndla/ui';
import { Link } from 'react-router-dom';
import PreviewDraftLightbox from '../../components/PreviewDraft/PreviewDraftLightbox';
import FormLanguage from './FormLanguage';

const { contentTypes } = constants;

const types = {
  standard: {
    form: 'learningResourceForm',
    cssModifier: 'article',
    icon: <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="large" />,
  },
  'topic-article': {
    form: 'topicArticleForm',
    cssModifier: 'article',
    icon: <ContentTypeBadge type={contentTypes.SUBJECT} background size="large" />,
  },
  image: { form: 'imageForm', cssModifier: 'multimedia', icon: <Camera /> },
  audio: {
    form: 'audioForm',
    cssModifier: 'multimedia',
    icon: <SquareAudio />,
  },
};

const FormHeader = props => {
  const { t, model, type, editUrl, getArticle } = props;
  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: true },
    { key: 'se', title: t('language.se'), include: false },
    { key: 'unknown', title: t('language.unknown'), include: false },
    { key: 'de', title: t('language.de'), include: false },
  ];
  const language = languages.find(lang => lang.key === model.language);

  const { status } = model;
  console.log('current', status.current);
  const statusText = status.current ? t(`form.status.${status.current.toLowerCase()}`) : t('form.status.new');

  const emptyLanguages = languages.filter(
    lang =>
      lang.key !== model.language &&
      !model.supportedLanguages.includes(lang.key) &&
      lang.include,
  );
  const otherLanguages = model.supportedLanguages.filter(
    lang => lang !== language.key,
  );

  console.log('???', props);
  console.log(types);
  console.log(otherLanguages);

  return (
    <header>
      <div className={headerCSS}>
        <div className={titleCSS}>
          {types[type].icon}
          <h1>{t(`${types[type].form}.title`)}</h1>
        </div>
        <div>
          {statusText}
        </div>
      </div>
      {model.id && (
        <div className={languageWrapperCSS}>
          {model.supportedLanguages.map(lang => (
            model.language === lang ? 
            <span className={cx(languageButtonsCSS, 'current')} key={`types_${lang}`}>{t(`language.${lang}`)}</span> :
            <Link className={languageButtonsCSS} key={`types_${lang}`} to={editUrl(lang)}>{t(`language.${lang}`)}</Link>
          ))}
          <PreviewDraftLightbox
            label={t('subNavigation.learningResource')}
            typeOfPreview="previewLanguageArticle"
            getArticle={getArticle}
          />
          <FormLanguage emptyLanguages={emptyLanguages} editUrl={editUrl} />
        </div>
      )}
    </header>
  );
};

FormHeader.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
};

const headerCSS = css`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small} 0;
  margin: 0 0 ${spacing.small};
  border-bottom: 2px solid ${colors.brand.tertiary};
`;

const titleCSS = css`
  padding-left: ${spacing.normal};
  display: flex;
  align-items: center;
  h1 {
    ${fonts.sizes(26, 1.1)};
    font-weight: ${fonts.weight.semibold};
    margin: ${spacing.small} ${spacing.normal} ${spacing.small} ${spacing.small};
    color: ${colors.text.primary};
  }
`;

const languageWrapperCSS = css`
  padding-left: ${spacing.normal};
  margin: 0 0 ${spacing.small};
`;

const languageButtonsCSS = css`
  background: ${colors.brand.lighter};
  color: ${colors.brand.tertiary};
  box-shadow: none;
  border-radius: ${spacing.xsmall};
  padding: ${spacing.xsmall} ${spacing.small};
  ${fonts.sizes(16, 1.1)};
  font-weight: ${fonts.weight.semibold};
  margin-right: ${spacing.xsmall};
  transition: all 200ms ease;
  &:not(.current) {
    &:focus, &:hover {
      color: #fff;
      background: ${colors.brand.primary};
      transform: translate(10px, 10px);
    }
  }
  &.current {
    color: ${colors.brand.primary};
    background: ${colors.brand.light};
  }
`;

export default injectT(FormHeader);
