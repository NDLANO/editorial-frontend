/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string';
import Button from '@ndla/button';
import { FieldHeader, FieldSection, Input, FieldSplitter, FieldRemoveButton } from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';

import UrlAllowList from './UrlAllowList';
import { fetchExternalOembed } from '../../util/apiHelpers';
import {
  isValidURL,
  urlDomain,
  urlAsATag,
  getIframeSrcFromHtmlString,
} from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import { fetchNrkMedia } from './visualElementApi';
import { HelpIcon, normalPaddingCSS } from '../../components/HowTo';

const filterWhiteListedURL = url => {
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

const StyledPreviewItem = styled('div')`
  width: 50%;
`;

export const transformableDomains = [
  {
    domains: ['nrk.no', 'www.nrk.no'],
    shouldTransform: (url, domains) => {
      const aTag = urlAsATag(url);

      if (domains.includes(aTag.hostname)) {
        return true;
      }
      const mediaId = queryString.parse(aTag.search).mediaId;
      if (mediaId) {
        return true;
      }
      return false;
    },
    transform: async url => {
      const aTag = urlAsATag(url);
      const mediaId = queryString.parse(aTag.search).mediaId;
      if (!mediaId) {
        return url;
      }
      try {
        const nrkMedia = await fetchNrkMedia(mediaId);
        if (nrkMedia.psId) {
          return `https://static.nrk.no/ludo/latest/video-embed.html#id=${nrkMedia.psId}`;
        }
        return url;
      } catch {
        return url;
      }
    },
  },
];

class VisualElementUrlPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.selectedResourceUrl,
      embedUrl: props.selectedResourceUrl,
      type: props.selectedResourceType,
      showPreview: props.selectedResourceUrl !== '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSaveUrl = this.handleSaveUrl.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
    this.getWarningText = this.getWarningText.bind(this);
    this.getSubTitle = this.getSubTitle.bind(this);
  }

  getWarningText() {
    const { t } = this.props;
    const { isInvalidURL, isNotSupportedUrl, url } = this.state;
    if (isInvalidURL) {
      return t('form.content.link.invalid');
    }
    if (isNotSupportedUrl) {
      return t('form.content.link.unSupported');
    }
    if (url === '') {
      return t('form.content.link.required');
    }
    return null;
  }

  getSubTitle() {
    const { url } = this.state;
    const { resource, t, selectedResourceUrl } = this.props;
    const isChangedUrl = url !== selectedResourceUrl || selectedResourceUrl === undefined;
    if (isChangedUrl) {
      return null;
    }
    return resource || t('form.content.link.insert');
  }

  handleClearInput() {
    this.setState({ url: '', embedUrl: '' });
  }

  async handleSaveUrl(url, preview = false) {
    const { onUrlSave } = this.props;
    const whiteListedUrl = filterWhiteListedURL(url);
    if (whiteListedUrl) {
      try {
        const data = await fetchExternalOembed(url);
        const src = getIframeSrcFromHtmlString(data.html);

        if (preview) {
          this.setState({ embedUrl: src, showPreview: true });
        } else {
          onUrlSave({ resource: 'external', url: src });
        }
      } catch (err) {
        if (preview) {
          this.setState({ embedUrl: url, showPreview: true });
        } else {
          onUrlSave({
            resource: 'iframe',
            url,
            width: '708px',
            height: whiteListedUrl.height || '486px',
          });
        }
      }
    } else {
      this.setState({ isNotSupportedUrl: true });
    }
  }

  async handleChange(evt) {
    let url = evt.target.value;
    for (const rule of transformableDomains) {
      if (rule.shouldTransform(url, rule.domains)) {
        url = await rule.transform(url);
        break;
      }
    }

    const { selectedResourceUrl } = this.props;
    this.setState({
      url,
      isInvalidURL: false,
      isNotSupportedUrl: false,
      showPreview: false,
      embedUrl: '',
    });
    if (url === selectedResourceUrl) {
      this.setState({ showPreview: true, embedUrl: url });
    }
  }

  handleBlur(evt) {
    const url = evt.target.value;
    if (url !== '' && !isValidURL(url)) {
      this.setState({ isInvalidURL: true });
    }
  }

  render() {
    const { url, embedUrl, showPreview, isInvalidURL, type } = this.state;
    const { resource, t, selectedResourceUrl } = this.props;
    const isChangedUrl = url !== selectedResourceUrl || selectedResourceUrl === undefined;

    return (
      <Fragment>
        <FieldHeader
          title={
            isChangedUrl
              ? t('form.content.link.newUrlResource')
              : t('form.content.link.changeUrlResource', { type })
          }
          subTitle={this.getSubTitle()}>
          <Modal
            backgroundColor="white"
            activateButton={
              <div>
                <Tooltip tooltip={t('form.content.link.validDomains')}>
                  <HelpIcon css={normalPaddingCSS} />
                </Tooltip>
              </div>
            }>
            {onClose => (
              <>
                <ModalHeader>
                  <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
                </ModalHeader>
                <ModalBody>
                  <h1>{t('form.content.link.validDomains')}</h1>
                  <center>
                    <UrlAllowList allowList={EXTERNAL_WHITELIST_PROVIDERS} />
                  </center>
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
                warningText={this.getWarningText()}
                value={url}
                type="text"
                placeholder={t('form.content.link.href')}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              />
            </FieldSplitter>
          </div>
          <div>
            <FieldRemoveButton onClick={this.handleClearInput}>
              {t('form.content.link.remove')}
            </FieldRemoveButton>
          </div>
        </FieldSection>
        <StyledButtonWrapper>
          <Button
            disabled={url === selectedResourceUrl || url === ''}
            outline
            onClick={() => this.handleSaveUrl(url, true)}>
            {t('form.content.link.preview')}
          </Button>
          <Button
            disabled={url === '' || url === selectedResourceUrl || isInvalidURL}
            outline
            onClick={() => this.handleSaveUrl(url)}>
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
      </Fragment>
    );
  }
}

VisualElementUrlPreview.propTypes = {
  selectedResourceUrl: PropTypes.string,
  selectedResourceType: PropTypes.string,
  resource: PropTypes.string,
  onUrlSave: PropTypes.func.isRequired,
};

export default withTranslation()(VisualElementUrlPreview);
