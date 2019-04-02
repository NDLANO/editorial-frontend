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
import { HistoryShape } from '../../../shapes';
import FormActionButton from './FormActionButton';

const FormQualityAssurance = ({
  getArticle,
  model,
  onValidateClick,
  history,
  t,
}) => (
  <div>
    <FieldHeader title={t('form.workflow.qualityAssurance')} />
    {model.id && (
      <FormActionButton
        outline
        onClick={() => window.open(toPreviewDraft(model.id, model.language))}>
        {t('form.previewNewWindow')}
      </FormActionButton>
    )}
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

FormQualityAssurance.propTypes = {
  getArticle: PropTypes.func,
  model: PropTypes.shape({
    id: PropTypes.number,
  }),
  onValidateClick: PropTypes.func.isRequired,
  history: HistoryShape,
};

export default injectT(FormQualityAssurance);
