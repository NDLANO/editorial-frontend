import React from 'react';
import { injectT } from '@ndla/i18n';
import { FooterLinkButton } from '@ndla/editor';
import PreviewDraftLightbox from '../../PreviewDraft/PreviewDraftLightbox';
import { toPreviewDraft } from '../../../util/routeHelpers';
import { isDraftPublished } from '../../../util/articleUtil';
import * as draftApi from '../../../modules/draft/draftApi';
import { formatErrorMessage } from '../../../util/apiHelpers';
import { Values } from '../editorTypes';
interface Props {
  values: Values;
  createMessage: (o: { translationKey: string; severity: string }) => void;
  getArticle: () => any;
}

interface AllProps extends Props {
  articleStatus: string;
  t: any;
  showPreview: (s: string) => void;
}

const onValidateClick = async ({
  values: { id, revision },
  createMessage,
  getArticle,
}: Props) => {
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

const QualityAssurance: React.FC<AllProps> = ({
  values,
  showPreview,
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
    <FooterLinkButton bold onClick={() => showPreview('preview')}>
      {t(`form.preview.button`)}
    </FooterLinkButton>
    {values.id && isDraftPublished(articleStatus) && (
      <FooterLinkButton
        bold
        onClick={() => showPreview('previewProductionArticle')}>
        {t(`form.previewProductionArticle.button`)}
      </FooterLinkButton>
    )}
    {values.id && (
      <FooterLinkButton
        bold
        onClick={() => showPreview('previewLanguageArticle')}>
        {t(`form.previewLanguageArticle.button`)}
      </FooterLinkButton>
    )}
    {values.id && (
      <FooterLinkButton
        bold
        onClick={() => onValidateClick({ values, createMessage, getArticle })}>
        {t('form.validate')}
      </FooterLinkButton>
    )}
  </>
);

export default injectT(QualityAssurance);
