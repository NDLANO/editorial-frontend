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
import { FormHeader } from 'ndla-forms';
import PreviewDraftLightbox from '../../../components/PreviewDraft/PreviewDraftLightbox';

function FormQualityAssurance({ getArticle, model, onValidateClick, t }) {
  return (
    <div>
      <FormHeader title={t('form.workflow.qualityAssurance')} width={3 / 4} />
      <PreviewDraftLightbox
        label={t('subNavigation.learningResource')}
        typeOfPreview="preview"
        getArticle={getArticle}
      />
      {model.id && (
        <PreviewDraftLightbox
          label={t('subNavigation.learningResource')}
          typeOfPreview="previewProductionArticle"
          getArticle={getArticle}
        />
      )}
      {model.id && (
        <PreviewDraftLightbox
          label={t('subNavigation.learningResource')}
          typeOfPreview="previewLanguageArticle"
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
