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
import Button from '@ndla/button'; //checked
import {
  FormHeader,
  FormSections,
  FormInput,
  FormSplitter,
  FormRemoveButton,
} from '@ndla/forms';
import { Link as LinkIcon } from '@ndla/icons/common';
import styled from 'react-emotion';
import { spacing } from '@ndla/core';

import { fetchExternalOembed } from '../../util/apiHelpers';
import {
  isValidURL,
  urlDomain,
  getIframeSrcFromHtmlString,
} from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';

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

  handleChange(evt) {
    const url = evt.target.value;
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
        <FormHeader
          title={
            isChangedUrl
              ? t('form.content.link.newUrlResource')
              : t('form.content.link.changeUrlResource', { type })
          }
          subTitle={this.getSubTitle()}
        />
        <FormSections>
          <div>
            <FormSplitter>
              <FormInput
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
            </FormSplitter>
          </div>
          <div>
            <FormRemoveButton onClick={this.handleClearInput}>
              {t('form.content.link.remove')}
            </FormRemoveButton>
          </div>
        </FormSections>
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
