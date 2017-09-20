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
import { classes } from './LearningResourceForm';
import LearningResourceLanguage from './LearningResourceLanguage';

const languages = [{key: 'nn', title: 'Nynorsk'}, {key: 'en', title: 'Engelsk'}, {key: 'nb', title: 'Bokmål'}]

const LearningResourceHeader = props => {
  const { t, model, onVariantClick } = props;
  console.log(model)
  const language = languages.find((lang) => lang.key === model.language)
  const supportedLanguages = languages;// languages.filter((lang) => lang.key === model.language || model.supportedLanguages.includes(lang.key))
  if (!model.id) {
    return (
      <div {...classes('header')}>
        <div className="u-4/6@desktop u-push-1/6@desktop">
        {t('learningResourceForm.title.create', language)}
      </div>
      </div>
    );
  }

  return (
    <div {...classes('header')}>
      <div className="u-4/6@desktop u-push-1/6@desktop">
      <span>
        {t('learningResourceForm.title.create', language)}
      </span>
      <span>
        <LearningResourceLanguage language={language} supportedLanguages={supportedLanguages} onVariantClick={onVariantClick}/>
      </span>
    </div>
  </div>
  );
};

LearningResourceHeader.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  onVariantClick: PropTypes.func.isRequired,
};

export default injectT(LearningResourceHeader);
