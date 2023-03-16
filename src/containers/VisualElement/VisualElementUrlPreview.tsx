/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import {
  FieldHeader,
  FieldSection,
  Input,
  CheckboxItem,
  FieldRemoveButton,
  TextArea,
} from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { SafeLinkIconButton } from '@ndla/safelink';
import { IImageMetaInformationV3 } from '@ndla/types-image-api';
import { DeleteForever } from '@ndla/icons/editor';

import UrlAllowList from './UrlAllowList';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { isValidURL, urlDomain, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS, DRAFT_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';
import { HelpIcon, normalPaddingCSS } from '../../components/HowTo';
import { urlTransformers } from './urlTransformers';
import { Embed, ExternalEmbed } from '../../interfaces';
import ImageSearchAndUploader from '../../components/ImageSearchAndUploader';
import { fetchImage, searchImages } from '../../modules/image/imageApi';
import { onError } from '../../util/resolveJsonOrRejectWithError';
import { TYPE_EMBED_EXTERNAL } from '../../components/SlateEditor/plugins/embed/types';

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

const RemoveButtonWrapper = styled.div`
  margin-left: auto;
`;

const CheckboxWrapper = styled.div`
  display: flex;
`;

const FullscreenFormWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${spacing.medium};
  flex-direction: row;
  gap: ${spacing.large};
`;

const ContentInputWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const UpdateButton = styled(ButtonV2)`
  margin-left: auto;
  margin-top: ${spacing.small};
`;

const ImageInputWrapper = styled.div`
  position: relative;
`;

const ImageWrapper = styled.div`
  display: flex;
  max-width: 200px;
  max-height: 160px;
  > img {
    max-height: 100%;
  }
`;

interface Props {
  selectedResourceUrl?: string;
  selectedResourceType?: string;
  articleLanguage?: string;
  resource?: string;
  onUrlSave: (returnType: Embed) => void;
  embed?: ExternalEmbed;
}
const StyledPreviewItem = styled('div')`
  width: 50%;
`;
type URLError = 'invalid' | 'unsupported';

const VisualElementUrlPreview = ({
  selectedResourceUrl,
  selectedResourceType,
  articleLanguage,
  resource,
  onUrlSave,
  embed,
}: Props) => {
  const { userPermissions } = useSession();
  const [url, setUrl] = useState(selectedResourceUrl);
  const [title, setTitle] = useState(embed?.title || '');
  const [image, setImage] = useState<IImageMetaInformationV3>();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [description, setDescription] = useState(embed?.caption || '');
  const [showFullscreen, setShowFullscreen] = useState(embed?.type === 'fullscreen');
  const [embedUrl, setEmbedUrl] = useState(selectedResourceUrl);
  const [showPreview, setShowPreview] = useState(selectedResourceUrl !== '');
  const [error, setError] = useState<URLError | undefined>(undefined);
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const getUrlWarningText = () => {
    if (error === 'invalid') {
      return t('form.content.link.invalid');
    }
    if (error === 'unsupported') {
      return t('form.content.link.unSupported');
    }
    if (url === '') {
      return t('form.content.link.required');
    }
  };

  const getSubTitle = () => {
    const isChangedUrl = url !== selectedResourceUrl || selectedResourceUrl === undefined;
    if (isChangedUrl) {
      return undefined;
    }
    return resource || t('form.content.link.insert');
  };

  const handleClearInput = () => {
    setUrl('');
    setEmbedUrl('');
  };

  const handleSaveUrl = async (preview = false) => {
    const whiteListedUrl = filterWhiteListedURL(url || '');
    if (whiteListedUrl) {
      try {
        const data = await fetchExternalOembed(url || '');
        const src = getIframeSrcFromHtmlString(data.html);

        if (preview) {
          setEmbedUrl(src ?? undefined);
          setShowPreview(true);
        } else {
          const data = showFullscreen
            ? {
                title,
                caption: description,
                imageid: image?.id,
                type: 'fullscreen',
              }
            : {
                type: 'iframe',
              };
          onUrlSave({
            ...data,
            resource: 'iframe',
            url: src || '',
          });
        }
      } catch (err) {
        if (preview) {
          setEmbedUrl(url);
          setShowPreview(true);
        } else {
          const data = showFullscreen
            ? {
                title,
                caption: description,
                imageid: image?.id,
                type: 'fullscreen',
              }
            : {
                width: '708px',
                height: whiteListedUrl.height || '486px',
                type: 'iframe',
              };
          onUrlSave({
            ...data,
            resource: 'iframe',
            url: url || '',
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

  const urlChanged = url !== selectedResourceUrl || selectedResourceUrl === undefined;
  const titleChanged = title !== embed?.title;
  const descriptionChanged = embed?.caption !== description;
  const imageChanged = embed?.imageid !== image?.id;
  const typeChanged = showFullscreen
    ? embed?.type === 'iframe' || !embed?.type
    : embed?.type === 'fullscreen';

  const canSave = () => {
    if (url === '' || !!error) {
      return false;
    }

    if (showFullscreen) {
      if (!image?.id) {
        return false;
      }
      if (titleChanged || descriptionChanged || imageChanged) {
        return true;
      }
    }

    if (urlChanged || typeChanged) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (embed?.imageid) {
      fetchImage(embed.imageid, articleLanguage).then(image => {
        setImage(image);
      });
    }
  }, [embed?.imageid, articleLanguage]);

  return (
    <>
      <FieldHeader
        title={
          urlChanged
            ? t('form.content.link.newUrlResource')
            : t('form.content.link.changeUrlResource', { type: selectedResourceType })
        }
        subTitle={getSubTitle()}>
        <Modal
          label={t('form.content.link.validDomains')}
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
        <Input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          iconRight={<LinkIcon />}
          warningText={getUrlWarningText()}
          value={url}
          type="text"
          placeholder={t('form.content.link.href')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <RemoveButtonWrapper>
          <FieldRemoveButton onClick={handleClearInput}>
            {t('form.content.link.remove')}
          </FieldRemoveButton>
        </RemoveButtonWrapper>
      </FieldSection>
      {!showFullscreen && (
        <StyledButtonWrapper>
          <ButtonV2
            disabled={url === selectedResourceUrl || url === ''}
            variant="outline"
            onClick={() => handleSaveUrl(true)}>
            {t('form.content.link.preview')}
          </ButtonV2>
          <ButtonV2 disabled={!canSave()} variant="outline" onClick={() => handleSaveUrl()}>
            {urlChanged ? t('form.content.link.insert') : t('form.content.link.update')}
          </ButtonV2>
        </StyledButtonWrapper>
      )}
      {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <CheckboxWrapper>
          <CheckboxItem
            checked={showFullscreen}
            onChange={() => setShowFullscreen(prev => !prev)}
            label={t('form.content.link.fullscreen')}
          />
        </CheckboxWrapper>
      )}
      {showFullscreen ? (
        <FullscreenFormWrapper>
          <ImageInputWrapper>
            {image ? (
              <ImageWrapper>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img src={image?.image.imageUrl} alt={image?.alttext.alttext} />
                <div>
                  <Tooltip tooltip={t('form.metaImage.remove')}>
                    <IconButtonV2
                      aria-label={t('form.metaImage.remove')}
                      variant="ghost"
                      colorTheme="danger"
                      onClick={() => setImage(undefined)}
                      data-cy="remove-element">
                      <DeleteForever />
                    </IconButtonV2>
                  </Tooltip>
                  <Tooltip tooltip={t('imageEditor.editImage')}>
                    <SafeLinkIconButton
                      variant="ghost"
                      colorTheme="light"
                      to={`/media/image-upload/${image.id}/edit/${language}`}
                      target="_blank"
                      aria-label={t('form.editOriginalImage')}>
                      <LinkIcon />
                    </SafeLinkIconButton>
                  </Tooltip>
                </div>
              </ImageWrapper>
            ) : (
              <ButtonV2 onClick={() => setImageModalOpen(true)}>{t('form.metaImage.add')}</ButtonV2>
            )}
          </ImageInputWrapper>
          <ContentInputWrapper>
            <h3>{t('form.name.title')}</h3>
            <Input
              value={title}
              type="text"
              placeholder={t('form.name.title')}
              onChange={e => setTitle(e.currentTarget.value)}
            />
            <h3>{t('form.name.description')}</h3>
            <TextArea
              value={description}
              type="text"
              placeholder={t('form.name.description')}
              onChange={e => setDescription(e.currentTarget.value)}
            />
            <UpdateButton disabled={!canSave()} variant="outline" onClick={() => handleSaveUrl()}>
              {urlChanged ? t('form.content.link.insert') : t('form.content.link.update')}
            </UpdateButton>
          </ContentInputWrapper>
        </FullscreenFormWrapper>
      ) : (
        showPreview && (
          <StyledPreviewWrapper>
            <StyledPreviewItem>
              <iframe src={embedUrl} title={resource} height="350px" frameBorder="0" />
            </StyledPreviewItem>
          </StyledPreviewWrapper>
        )
      )}
      <Modal
        controllable
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        size="large"
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <>
            <ModalHeader>
              <ModalCloseButton
                title={t('dialog.close')}
                onClick={() => setImageModalOpen(false)}
              />
            </ModalHeader>
            <ModalBody>
              <ImageSearchAndUploader
                inModal={true}
                locale={language}
                language={language}
                closeModal={() => {}}
                fetchImage={id => fetchImage(id, articleLanguage)}
                searchImages={searchImages}
                onError={onError}
                onImageSelect={image => {
                  setImage(image);
                  setImageModalOpen(false);
                }}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    </>
  );
};

export default VisualElementUrlPreview;
