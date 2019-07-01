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
import { toPreviewDraft } from '../../../util/routeHelpers';
import FormikActionButton from './FormikActionButton';
import { isDraftPublished } from '../../../util/articleUtil';

const FormikQualityAssurance = ({
  getArticle,
  values,
  onValidateClick,
  articleStatus,
  t,
}) => (
  <div>
    <FieldHeader title={t('form.workflow.qualityAssurance')} />
    {values.id && (
      <FormikActionButton
        outline
        onClick={() => window.open(toPreviewDraft(values.id, values.language))}>
        {t('form.previewNewWindow')}
      </FormikActionButton>
    )}
    <PreviewDraftLightbox
      label={t('subNavigation.learningResource')}
      typeOfPreview="preview"
      getArticle={getArticle}
    />
    {values.id && isDraftPublished(articleStatus) && (
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
    language: PropTypes.string,
  }),
  onValidateClick: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default injectT(FormikQualityAssurance);
