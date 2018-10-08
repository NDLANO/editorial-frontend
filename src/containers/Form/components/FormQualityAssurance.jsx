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
import Button from 'ndla-button';
import { formClasses } from '..';
import PreviewDraftLightbox from '../../../components/PreviewDraft/PreviewDraftLightbox';

function FormQualityAssurance({ getArticle, model, onValidateClick, t }) {
  return (
    <div>
      <span {...formClasses('title')}>
        {t('form.workflow.qualityAssurance')}
      </span>
      <PreviewDraftLightbox
        label={t('subNavigation.learningResource')}
        getArticle={getArticle}
      />
      {model.id && (
        <PreviewDraftLightbox
          label={t('subNavigation.learningResource')}
          compareWithArticle
          getArticle={getArticle}
        />
      )}
      {model.id && (
        <Button outline onClick={onValidateClick}>
          {t('form.validate')}
        </Button>
      )}
    </div>
  );
}

FormQualityAssurance.propTypes = {
  getArticle: PropTypes.func,
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  onValidateClick: PropTypes.func.isRequired,
};

export default injectT(FormQualityAssurance);
