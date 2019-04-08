/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { FieldHeader } from '@ndla/forms';
import PreviewDraftLightbox from '../../../components/PreviewDraft/PreviewDraftLightbox';

const FormikQualityAssurance = ({ getArticle, values, onValidateClick, t }) => (
  <div>
    <FieldHeader title={t('form.workflow.qualityAssurance')} />
    <PreviewDraftLightbox
      label={t('subNavigation.learningResource')}
      typeOfPreview="preview"
      getArticle={getArticle}
    />
    {values.id && (
      <PreviewDraftLightbox
        label={t('subNavigation.learningResource')}
        typeOfPreview="previewProductionArticle"
        getArticle={getArticle}
      />
    )}
    {values.id && (
      <PreviewDraftLightbox
        label={t('subNavigation.learningResource')}
        typeOfPreview="previewLanguageArticle"
        getArticle={getArticle}
      />
    )}
    {values.id && (
      <Button outline onClick={onValidateClick}>
        {t('form.validate')}
      </Button>
    )}
  </div>
);

FormikQualityAssurance.propTypes = {
  getArticle: PropTypes.func,
  values: PropTypes.shape({
    id: PropTypes.number,
  }),
  onValidateClick: PropTypes.func.isRequired,
};

export default injectT(FormikQualityAssurance);
