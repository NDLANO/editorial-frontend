/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { classes } from '../LearningResourcePage/components/LearningResourceForm';
import ArticleLanguage from './ArticleLanguage';

const ArticleHeader = props => {
  const { t, model } = props;
  const languages = [
    { key: 'nn', title: t('language.nn') },
    { key: 'en', title: t('language.en') },
    { key: 'nb', title: t('language.nb') },
  ];

  const types = {
    standard: 'learningResourceForm',
    'topic-article': 'topicArticleForm',
  };
  const language = languages.find(lang => lang.key === model.language);
  const supportedLanguages = languages.filter(
    lang => lang.key !== model.language,
  );
  if (!model.id) {
    return (
      <div {...classes('header')}>
        <div className="u-4/6@desktop u-push-1/6@desktop">
          {t(`${types[model.articleType]}.title.create`, language)}
        </div>
      </div>
    );
  }

  return (
    <div {...classes('header')}>
      <div className="u-4/6@desktop u-push-1/6@desktop">
        <span>{t(`${types[model.articleType]}.title.update`, language)}</span>
        <span>
          <ArticleLanguage
            language={language}
            languages={supportedLanguages}
            modelId={model.id}
            articleType={model.articleType}
          />
        </span>
      </div>
    </div>
  );
};

ArticleHeader.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  articleType: PropTypes.string.isRequired,
};

export default injectT(ArticleHeader);
