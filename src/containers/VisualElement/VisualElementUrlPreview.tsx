/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input, CheckboxItem, FieldRemoveButton } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { DeleteForever } from '@ndla/icons/lib/editor';
import { Link } from 'react-router-dom';

import UrlAllowList from './UrlAllowList';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { isValidURL, urlDomain, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS, DRAFT_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';
import { HelpIcon, normalPaddingCSS } from '../../components/HowTo';
import { urlTransformers } from './urlTransformers';
import { VisualElementChangeReturnType } from './VisualElementSearch';
import { ExternalEmbed } from '../../interfaces';
import ImageSearchAndUploader from '../../components/ImageSearchAndUploader';
import { fetchImage, searchImages } from '../../modules/image/imageApi';
import { onError } from '../../util/resolveJsonOrRejectWithError';
import IconButton from '../../components/IconButton';

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

const UpdateButton = styled(Button)`
  margin-left: auto;
  margin-top: ${spacing.small};
`;

const ImageInputWrapper = styled.div`
  position: relative;
`;

const ImageButtons = styled.div`
  position: absolute;
  display: flex;
  gap: ${spacing.xsmall};
  flex-direction: column;
  right: -${spacing.medium};
  top: 0;
`;

const ImageWrapper = styled.div`
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
  onUrlSave: (returnType: VisualElementChangeReturnType) => void;
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
  const [image, setImage] = useState<IImageMetaInformationV2>();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [description, setDescription] = useState(embed?.caption || '');
  const [showFullscreen, setShowFullscreen] = useState(
    !!(embed?.imageid || embed?.caption || embed?.title),
  );
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
            type: 'embed',
            value: {
              ...data,
              resource: 'iframe',
              url,
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
          focusOnMount
          iconRight={<LinkIcon />}
          container="div"
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
          <Button
            disabled={url === selectedResourceUrl || url === ''}
            outline
            onClick={() => handleSaveUrl(true)}>
            {t('form.content.link.preview')}
          </Button>
          <Button disabled={!canSave()} outline onClick={() => handleSaveUrl()}>
            {urlChanged ? t('form.content.link.insert') : t('form.content.link.update')}
          </Button>
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
                <img src={image?.imageUrl} alt={image?.alttext.alttext} />
                <ImageButtons>
                  <Tooltip tooltip={t('form.metaImage.remove')} align="top">
                    <IconButton
                      color="red"
                      type="button"
                      onClick={() => setImage(undefined)}
                      tabIndex={-1}
                      data-cy="remove-element">
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                  <Tooltip tooltip={t('imageEditor.editImage')} align="top">
                    <IconButton
                      as={Link}
                      to={`/media/image-upload/${image.id}/edit/${language}`}
                      target="_blank"
                      title={t('form.editOriginalImage')}
                      tabIndex={-1}>
                      <LinkIcon />
                    </IconButton>
                  </Tooltip>
                </ImageButtons>
              </ImageWrapper>
            ) : (
              <Button onClick={() => setImageModalOpen(true)}>{t('form.metaImage.add')}</Button>
            )}
          </ImageInputWrapper>
          <ContentInputWrapper>
            <h3>{t('form.name.title')}</h3>
            <Input
              container="div"
              value={title}
              type="text"
              placeholder={t('form.name.title')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            <h3>{t('form.name.description')}</h3>
            <Input
              container="div"
              value={description}
              autoExpand
              type="text"
              placeholder={t('form.name.description')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />
            <UpdateButton disabled={!canSave()} outline onClick={() => handleSaveUrl()}>
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
