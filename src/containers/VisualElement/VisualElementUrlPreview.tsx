/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input, FieldSplitter, FieldRemoveButton } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';

import UrlAllowList from './UrlAllowList';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { isValidURL, urlDomain, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import { HelpIcon, normalPaddingCSS } from '../../components/HowTo';
import { urlTransformers } from './urlTransformers';
import { VisualElementChangeReturnType } from './VisualElementSearch';
import { ExternalEmbed } from '../../interfaces';

const filterWhiteListedURL = (url: string) => {
  const domain = urlDomain(url);
  const [isWhiteListedURL] = EXTERNAL_WHITELIST_PROVIDERS.filter(filteredProvider =>
    filteredProvider.url.includes(domain),
  );
  return isWhiteListedURL;
};

const StyledButtonWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > * {
    margin-bottom: ${spacing.small};
    margin-right: ${spacing.small};
  }
`;

const StyledPreviewWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.large};
`;

interface Props {
  selectedResourceUrl?: string;
  selectedResourceType?: string;
  resource?: string;
  onUrlSave: (returnType: VisualElementChangeReturnType) => void;
}
const StyledPreviewItem = styled('div')`
  width: 50%;
`;
type URLError = 'invalid' | 'unsupported';

const VisualElementUrlPreview = ({
  selectedResourceUrl,
  selectedResourceType,
  resource,
  onUrlSave,
}: Props) => {
  const [url, setUrl] = useState(selectedResourceUrl);
  const [embedUrl, setEmbedUrl] = useState(selectedResourceUrl);
  const [showPreview, setShowPreview] = useState(selectedResourceUrl !== '');
  const [error, setError] = useState<URLError | undefined>(undefined);
  const { t } = useTranslation();

  const getWarningText = () => {
    if (error === 'invalid') {
      return t('form.content.link.invalid');
    }
    if (error === 'unsupported') {
      return t('form.content.link.unSupported');
    }
    if (url === '') {
      return t('form.content.link.required');
    }
    return null;
  };

  const getSubTitle = () => {
    const isChangedUrl = url !== selectedResourceUrl || selectedResourceUrl === undefined;
    if (isChangedUrl) {
      return null;
    }
    return resource || t('form.content.link.insert');
  };

  const handleClearInput = () => {
    setUrl('');
    setEmbedUrl('');
  };

  const handleSaveUrl = async (url: string, preview = false) => {
    const whiteListedUrl = filterWhiteListedURL(url);
    if (whiteListedUrl) {
      try {
        const data = await fetchExternalOembed(url);
        const src = getIframeSrcFromHtmlString(data.html);

        if (preview) {
          setEmbedUrl(src ?? undefined);
          setShowPreview(true);
        } else {
          onUrlSave({
            value: { resource: 'external', url: src || undefined } as ExternalEmbed,
            type: 'embed',
          });
        }
      } catch (err) {
        if (preview) {
          setEmbedUrl(url);
          setShowPreview(true);
        } else {
          onUrlSave({
            type: 'embed',
            value: {
              resource: 'iframe',
              type: 'iframe',
              url,
              width: '708px',
              height: whiteListedUrl.height || '486px',
            } as ExternalEmbed,
          });
        }
      }
    } else {
      setError('unsupported');
    }
  };

  const handleChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    let url = evt.target.value;
    for (const rule of urlTransformers) {
      if (rule.shouldTransform(url, rule.domains)) {
        url = await rule.transform(url);
        break;
      }
    }
    setUrl(url);
    setError(undefined);
    setShowPreview(false);
    setEmbedUrl('');
    if (url === selectedResourceUrl) {
      setShowPreview(true);
      setEmbedUrl(url);
    }
  };

  const handleBlur = (evt: ChangeEvent<HTMLInputElement>) => {
    const url = evt.target.value;
    if (url !== '' && !isValidURL(url)) {
      setError('invalid');
    }
  };

  const isChangedUrl = url !== selectedResourceUrl || selectedResourceUrl === undefined;

  return (
    <>
      <FieldHeader
        title={
          isChangedUrl
            ? t('form.content.link.newUrlResource')
            : t('form.content.link.changeUrlResource', { type: selectedResourceType })
        }
        subTitle={getSubTitle()}>
        <Modal
          backgroundColor="white"
          activateButton={
            <div>
              <Tooltip tooltip={t('form.content.link.validDomains')}>
                <HelpIcon css={normalPaddingCSS} />
              </Tooltip>
            </div>
          }>
          {(onClose: () => void) => (
            <>
              <ModalHeader>
                <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
              </ModalHeader>
              <ModalBody>
                <h1>{t('form.content.link.validDomains')}</h1>
                <UrlAllowList allowList={EXTERNAL_WHITELIST_PROVIDERS} />
              </ModalBody>
            </>
          )}
        </Modal>
      </FieldHeader>
      <FieldSection>
        <div>
          <FieldSplitter>
            <Input
              focusOnMount
              iconRight={<LinkIcon />}
              container="div"
              warningText={getWarningText()}
              value={url}
              type="text"
              placeholder={t('form.content.link.href')}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FieldSplitter>
        </div>
        <div>
          <FieldRemoveButton onClick={handleClearInput}>
            {t('form.content.link.remove')}
          </FieldRemoveButton>
        </div>
      </FieldSection>
      <StyledButtonWrapper>
        <Button
          disabled={url === selectedResourceUrl || url === ''}
          outline
          onClick={() => handleSaveUrl(url!, true)}>
          {t('form.content.link.preview')}
        </Button>
        <Button
          disabled={url === '' || url === selectedResourceUrl || !!error}
          outline
          onClick={() => handleSaveUrl(url ?? '')}>
          {isChangedUrl ? t('form.content.link.insert') : t('form.content.link.update')}
        </Button>
      </StyledButtonWrapper>
      {showPreview && (
        <StyledPreviewWrapper>
          <StyledPreviewItem>
            <iframe src={embedUrl} title={resource} height="350px" frameBorder="0" />
          </StyledPreviewItem>
        </StyledPreviewWrapper>
      )}
    </>
  );
};

export default VisualElementUrlPreview;
