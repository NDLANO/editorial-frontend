/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  TopicArticle,
  LearningResource,
  Camera,
  SquareAudio,
} from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { formClasses } from '.';
import FormikLanguage from './FormikLanguage';

const types = {
  standard: {
    form: 'learningResourceForm',
    cssModifier: 'article',
    icon: <LearningResource />,
  },
  'topic-article': {
    form: 'topicArticleForm',
    cssModifier: 'article',
    icon: <TopicArticle />,
  },
  image: { form: 'imageForm', cssModifier: 'multimedia', icon: <Camera /> },
  audio: {
    form: 'audioForm',
    cssModifier: 'multimedia',
    icon: <SquareAudio />,
  },
};

const FormikHeader = props => {
  const { t, values, type, editUrl } = props;
  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: true },
    { key: 'se', title: t('language.se'), include: false },
    { key: 'unknown', title: t('language.unknown'), include: false },
    { key: 'de', title: t('language.de'), include: false },
  ];
  const language = languages.find(lang => lang.key === values.language);
  if (!values.id) {
    return (
      <div {...formClasses('header', types[type].cssModifier)}>
        <div>
          {types[type].icon}
          <span>{t(`${types[type].form}.title`, language)}</span>
        </div>
      </div>
    );
  }

  const emptyLanguages = languages.filter(
    lang =>
      lang.key !== values.language &&
      !values.supportedLanguages.includes(lang.key) &&
      lang.include,
  );
  const otherLanguages = values.supportedLanguages.filter(
    lang => lang !== language.key,
  );

  return (
    <div {...formClasses('header', types[type].cssModifier)}>
      <div>
        {types[type].icon}
        <span>{t(`${types[type].form}.title`, language)}</span>
        {otherLanguages.map((lang, index) => (
          <span key={`types_${lang}`}>
            <Link to={editUrl(lang)}>{lang.toUpperCase()}</Link>
            {index === otherLanguages.length - 1 ? '' : '|'}
          </span>
        ))}
      </div>
      <FormikLanguage emptyLanguages={emptyLanguages} editUrl={editUrl} />
    </div>
  );
};

FormikHeader.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
};

export default injectT(FormikHeader);
