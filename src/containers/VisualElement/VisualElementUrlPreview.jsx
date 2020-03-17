/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import Button from '@ndla/button';
import {
  FieldHeader,
  FieldSection,
  Input,
  FieldSplitter,
  FieldRemoveButton,
} from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

import { fetchExternalOembed } from '../../util/apiHelpers';
import {
  isValidURL,
  urlDomain,
  urlAsATag,
  getIframeSrcFromHtmlString,
} from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import { fetchNrkMedia } from './visualElementApi';

const filterWhiteListedURL = url => {
  const domain = urlDomain(url);
  const [isWhiteListedURL] = EXTERNAL_WHITELIST_PROVIDERS.filter(
    filteredProvider => filteredProvider.url.includes(domain),
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

export const transformUrlIfNeeded = async url => {
  const aTag = urlAsATag(url);
  const nrkDomains = ['nrk.no', 'www.nrk.no'];

  if (!nrkDomains.includes(aTag.hostname)) {
    return url;
  }
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
};

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
    const isChangedUrl =
      url !== selectedResourceUrl || selectedResourceUrl === undefined;
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

    try {
      const data = await fetchExternalOembed(url);
      const src = getIframeSrcFromHtmlString(data.html);

      if (preview) {
        this.setState({ embedUrl: src, showPreview: true });
      } else {
        onUrlSave({ resource: 'external', url: src });
      }
    } catch (err) {
      const whiteListedUrl = filterWhiteListedURL(url);
      if (whiteListedUrl) {
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
      } else {
        this.setState({ isNotSupportedUrl: true });
      }
    }
  }

  async handleChange(evt) {
    const url = await transformUrlIfNeeded(evt.target.value);
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
    const isChangedUrl =
      url !== selectedResourceUrl || selectedResourceUrl === undefined;

    return (
      <Fragment>
        <FieldHeader
          title={
            isChangedUrl
              ? t('form.content.link.newUrlResource')
              : t('form.content.link.changeUrlResource', { type })
          }
          subTitle={this.getSubTitle()}
        />
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
            {isChangedUrl
              ? t('form.content.link.insert')
              : t('form.content.link.update')}
          </Button>
        </StyledButtonWrapper>
        {showPreview && (
          <StyledPreviewWrapper>
            <StyledPreviewItem>
              <iframe
                src={embedUrl}
                title={resource}
                height="350px"
                frameBorder="0"
              />
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

export default injectT(VisualElementUrlPreview);
