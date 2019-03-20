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
import { Camera, SquareAudio } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { ContentTypeBadge, constants } from '@ndla/ui';
import { Link } from 'react-router-dom';
import FormDeleteLanguageVersion from './components/FormDeleteLanguageVersion';
import FormLanguage from './FormLanguage';
import HowToHelper from '../../components/HowTo/HowToHelper';
import { linkFillButtonCSS } from '../../style';

const { contentTypes } = constants;

const types = {
  standard: {
    form: 'learningResourceForm',
    cssModifier: 'article',
    icon: (
      <ContentTypeBadge
        type={contentTypes.SUBJECT_MATERIAL}
        background
        size="small"
      />
    ),
  },
  'topic-article': {
    form: 'topicArticleForm',
    cssModifier: 'article',
    icon: (
      <ContentTypeBadge type={contentTypes.SUBJECT} background size="small" />
    ),
  },
  image: { form: 'imageForm', cssModifier: 'multimedia', icon: <Camera /> },
  audio: {
    form: 'audioForm',
    cssModifier: 'multimedia',
    icon: <SquareAudio />,
  },
};

const FormHeader = ({ t, model, type, editUrl, statusText, noStatus }) => {
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
      lang.key !== model.language &&
      !model.supportedLanguages.includes(lang.key) &&
      lang.include,
  );

  return (
    <header>
      <div className={headerCSS}>
        <div className={titleCSS}>
          {types[type].icon}
          <h1>{t(`${types[type].form}.title`)}</h1>
        </div>
        {!noStatus && <div className={statusWrapperCSS}>
          <div className={splitterCSS} />
          <p className={statusCSS}>
            <small>{t('form.workflow.statusLabel')}:</small>
            {statusText || t('form.status.new')}
          </p>
          <HowToHelper
            pageId="status"
            tooltip={t('form.workflow.statusInfoTooltip')}
          />
        </div>}
      </div>
      {model.id && (
        <div className={languageWrapperCSS}>
          {model.supportedLanguages.map(lang =>
            model.language === lang ? (
              <span
                className={cx(languageButtonsCSS, 'current')}
                key={`types_${lang}`}>
                {t(`language.${lang}`)}
              </span>
            ) : (
              <Tooltip
                key={`types_${lang}`}
                tooltip={t('language.change', {
                  language: t(`language.${lang}`).toLowerCase(),
                })}>
                <Link
                  className={languageButtonsCSS}
                  to={editUrl(lang)}>
                  {t(`language.${lang}`)}
                </Link>
              </Tooltip>
            ),
          )}
          <div className={splitterCSS} />
          <Link className={linkFillButtonCSS} to={'#'}>
            <FileCompare />{t(`form.previewLanguageArticle.button`)}
          </Link>
          <div className={splitterCSS} />
          <FormLanguage emptyLanguages={emptyLanguages} editUrl={editUrl} />
          <FormDeleteLanguageVersion model={model} />
        </div>
      )}
    </header>
  );
};

FormHeader.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  model: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
};

const splitterCSS = css`
  width: 1px;
  background: ${colors.brand.lighter};
  height: ${spacing.normal};
  margin: 0 ${spacing.xsmall};
`;

const headerCSS = css`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small} 0 ${spacing.xsmall};
  margin: ${spacing.normal} 0 ${spacing.small};
  border-bottom: 2px solid ${colors.brand.light};
`;

const titleCSS = css`
  padding-left: ${spacing.small};
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
  padding-left: ${spacing.small};
  margin: 0 0 ${spacing.normal};
  display: flex;
  align-items: center;
  > *:last-child {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
  }
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
    &:focus,
    &:hover {
      color: #fff;
      background: ${colors.brand.primary};
      transform: translate(1px, 1px);
    }
  }
  &.current {
    color: ${colors.brand.primary};
    background: ${colors.brand.light};
  }
`;

const statusWrapperCSS = css`
  display: flex;
  align-items: center;
`;

const statusCSS = css`
  ${fonts.sizes(18, 1.1)};
  font-weight: ${fonts.weight.semibold};
  text-transform: uppercase;
  margin: 0 ${spacing.small};
  small {
    color: ${colors.text.light};
    padding-right: ${spacing.xsmall};
    ${fonts.sizes(14, 1.1)};
    font-weight: ${fonts.weight.light};
  }
`;

export default injectT(FormHeader);
