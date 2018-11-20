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
import Button from '@ndla/button';
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

const ButtonWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  > * {
    margin-bottom: 13px;
    margin-right: 13px;
  }
`;

const PreviewWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${spacing.large};
`;

const PreviewItem = styled('div')`
  width: 50%;
`;

class VisualElementUrlPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      embedUrl: props.url,
      type: props.type,
      showPreview: props.url !== '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSaveUrl = this.handleSaveUrl.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
  }

  handleClearInput() {
    this.setState({ url: '' });
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
    } catch (e) {
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

  handleChange(e) {
    const url = e.target.value;
    this.setState({
      url,
      isInvalidURL: false,
      isNotSupportedUrl: false,
      showPreview: false,
      embedUrl: '',
    });
    if (url === this.props.url) {
      this.setState({ showPreview: true, embedUrl: url });
    }
  }

  handleBlur(e) {
    const url = e.target.value;
    if (url !== '' && !isValidURL(url)) {
      this.setState({ isInvalidURL: true });
    }
  }

  render() {
    const {
      url,
      embedUrl,
      showPreview,
      isInvalidURL,
      isNotSupportedUrl,
      type,
    } = this.state;
    const { resource, t } = this.props;

    const isChangedUrl = url !== this.props.url || this.props.url === undefined;

    let warningText = null;
    if (isInvalidURL) {
      warningText = t('form.content.link.invalid');
    }
    if (isNotSupportedUrl) {
      warningText = t('form.content.link.unSupported');
    }
    if (url === '') {
      warningText = t('form.content.link.required');
    }

    return (
      <Fragment>
        <FormHeader
          title={
            isChangedUrl
              ? t('form.content.link.newUrlResource')
              : `Rediger ressurs: ${type}`
          }
          subTitle={
            isChangedUrl ? null : resource || t('form.content.link.insert')
          }
        />
        <FormSections>
          <div>
            <FormSplitter>
              <FormInput
                focusOnMount
                iconRight={<LinkIcon />}
                container="div"
                warningText={warningText}
                value={url}
                type="text"
                placeholder={t('form.content.link.href')}
                onChange={e => this.handleChange(e)}
                onBlur={e => this.handleBlur(e)}
              />
            </FormSplitter>
          </div>
          <div>
            <FormRemoveButton onClick={e => this.handleClearInput(e)}>
              {t('form.content.link.remove')}
            </FormRemoveButton>
          </div>
        </FormSections>
        <ButtonWrapper>
          <Button
            disabled={url === this.props.url || url === ''}
            outline
            onClick={() => this.handleSaveUrl(url, true)}>
            {t('form.content.link.preview')}
          </Button>
          <Button
            disabled={url === '' || url === this.props.url || isInvalidURL}
            outline
            onClick={() => this.handleSaveUrl(url)}>
            {isChangedUrl
              ? t('form.content.link.insert')
              : t('form.content.link.update')}
          </Button>
        </ButtonWrapper>
        {showPreview && (
          <PreviewWrapper>
            <PreviewItem>
              <iframe
                src={embedUrl}
                title={resource}
                height="350px"
                frameBorder="0"
              />
            </PreviewItem>
          </PreviewWrapper>
        )}
      </Fragment>
    );
  }
}

VisualElementUrlPreview.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  resource: PropTypes.string,
  onUrlSave: PropTypes.func.isRequired,
};

export default injectT(VisualElementUrlPreview);
