/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { TopicArticle, LearningResource, Camera, SquareAudio } from 'ndla-icons/editor';
import { injectT } from 'ndla-i18n';
import { Link } from 'react-router-dom';
import { formClasses } from '../Form';
import FormLanguage from './FormLanguage';
import { toEditArticle } from '../../util/routeHelpers';


const FormHeader = props => {
  const { t, model, type } = props;
  const languages = [
    { key: 'nn', title: t('language.nn') },
    { key: 'en', title: t('language.en') },
    { key: 'nb', title: t('language.nb') },
  ];
  const types = {
    standard: {form: 'learningResourceForm', urlFunction: toEditArticle, icon: <LearningResource />},
    'topic-article': {form: 'topicArticleForm', urlFunction: toEditArticle, icon: <TopicArticle /> },
    'image': {form: 'imageForm', icon: <Camera />},
    'audio': {form: 'audioForm', icon: <SquareAudio />},
  };


  const language = languages.find(lang => lang.key === model.language);
  const emptyLanguages = languages.filter(
    lang =>
      lang.key !== model.language &&
      !model.supportedLanguages.includes(lang.key),
  );

  if (!model.id) {
    return (
      <div {...formClasses('header', 'article')}>
        <div>
          {types[type].icon}
          <span>
            {t(`${types[type].form}.title`, language)}
          </span>
          </div>
      </div>
    );
  }
  return (
    <div {...formClasses('header', 'article')}>
      <div>
        {types[type].icon}
        <span>{t(`${types[type].form}.title`, language)}</span>
        {model.supportedLanguages.map((lang, index) => (
          <span>
            <Link to={toEditArticle(model.id, type, lang)}>
              {lang.toUpperCase()}
            </Link>
            {index === model.supportedLanguages.length - 1 ? '' : '|'}
          </span>
        ))}
      </div>
      <FormLanguage
        language={language}
        emptyLanguages={emptyLanguages}
        supportedLanguages={model.supportedLanguages}
        modelId={model.id}
        articleType={type}
      />
    </div>
  );
};

FormHeader.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  type: PropTypes.string.isRequired,
};

export default injectT(FormHeader);
