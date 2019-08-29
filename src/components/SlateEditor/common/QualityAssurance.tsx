import React from 'react';
import { injectT } from '@ndla/i18n';
import { FooterLinkButton } from '@ndla/editor';
import PreviewDraftLightbox from '../../PreviewDraft/PreviewDraftLightbox';
import { toPreviewDraft } from '../../../util/routeHelpers';
import { isDraftPublished } from '../../../util/articleUtil';
import * as draftApi from '../../modules/draft/draftApi';
import { formatErrorMessage } from '../../../util/apiHelpers';
import { Values } from '../editorTypes';
interface Props {
  values: Values;
}

const onValidateClick = async ({
  values: { id, revision },
  createMessage,
  getArticle,
}) => {
  try {
    await draftApi.validateDraft(id, { ...getArticle(), revision });
    createMessage({
      translationKey: 'form.validationOk',
      severity: 'success',
    });
  } catch (error) {
    if (error && error.json && error.json.messages) {
      createMessage(formatErrorMessage(error));
    } else {
      createMessage(error);
    }
  }
};

const QualityAssurance: React.FC<Props> = ({
  values,
  getArticle,
  articleStatus,
  t,
  createMessage,
}) => (
  <>
    {values.id && (
      <FooterLinkButton
        bold
        onClick={() => window.open(toPreviewDraft(values.id, values.language))}>
        {t('form.previewNewWindow')}
      </FooterLinkButton>
    )}
    <PreviewDraftLightbox
      label={t(`articleType.${values.articleType}`)}
      typeOfPreview="preview"
      getArticle={getArticle}>
      {(showPreview: VoidFunction) => (
        <FooterLinkButton bold onClick={showPreview}>
          {t(`form.preview.button`)}
        </FooterLinkButton>
      )}
    </PreviewDraftLightbox>
    {values.id && isDraftPublished(articleStatus) && (
      <PreviewDraftLightbox
        label={t(`articleType.${values.articleType}`)}
        typeOfPreview="previewProductionArticle"
        getArticle={getArticle}>
        {(showPreview: VoidFunction) => (
          <FooterLinkButton bold onClick={showPreview}>
            {t(`form.previewProductionArticle.button`)}
          </FooterLinkButton>
        )}
      </PreviewDraftLightbox>
    )}
    {values.id && (
      <PreviewDraftLightbox
        label={t(`articleType.${values.articleType}`)}
        typeOfPreview="previewLanguageArticle"
        getArticle={getArticle}>
        {(showPreview: VoidFunction) => (
          <FooterLinkButton bold onClick={showPreview}>
            {t(`form.previewLanguageArticle.button`)}
          </FooterLinkButton>
        )}
      </PreviewDraftLightbox>
    )}
    {values.id && (
      <FooterLinkButton
        bold
        onClick={() => onValidateClick(values, createMessage, getArticle)}>
        {t('form.validate')}
      </FooterLinkButton>
    )}
  </>
);

export default injectT(QualityAssurance);
