/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import PreviewDraft from './PreviewDraft';
import { classes } from './PreviewDraftLightbox';

const PreviewLanguage = props => {
  const {
    firstArticle,
    secondArticle,
    label,
    contentType,
    onChangePreviewLanguage,
    previewLanguage,
    t,
  } = props;
  return (
    <React.Fragment>
      <div {...classes('article')}>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewLanguageArticle.title', {
            language: t(`language.${firstArticle.language}`).toLowerCase(),
          })}
        </h2>
        <br />
        <PreviewDraft
          article={firstArticle}
          label={label}
          contentType={contentType}
        />
      </div>
      <div {...classes('article')}>
        <h2 className="u-4/6@desktop u-push-1/6@desktop">
          {t('form.previewLanguageArticle.title', {
            language: t(`language.${previewLanguage}`).toLowerCase(),
          })}
        </h2>
        <select
          className="u-4/6@desktop u-push-1/6@desktop"
          onChange={evt => onChangePreviewLanguage(evt.target.value)}
          value={previewLanguage}>
          {firstArticle.supportedLanguages.map(language => (
            <option key={language} value={language}>
              {t(`language.${language}`)}
            </option>
          ))}
        </select>
        <PreviewDraft
          article={secondArticle}
          label={label}
          contentType={contentType}
        />
      </div>
    </React.Fragment>
  );
};

PreviewLanguage.propTypes = {
  firstArticle: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  secondArticle: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    title: PropTypes.string,
    introduction: PropTypes.string,
  }),
  onChangePreviewLanguage: PropTypes.func.isRequired,
  contentType: PropTypes.string,
  label: PropTypes.string.isRequired,
  previewLanguage: PropTypes.string.isRequired,
};

export default injectT(PreviewLanguage);
