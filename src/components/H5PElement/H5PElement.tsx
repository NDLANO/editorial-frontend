/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { injectT, tType } from '@ndla/i18n';
import { ErrorMessage } from '@ndla/ui';
import handleError from '../../util/handleError';
import { fetchH5PiframeUrl, editH5PiframeUrl, fetchH5PMetadata } from './h5pApi';

const FlexWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

interface IframeProps {
  iframeHeight: number;
}

const StyledIFrame = styled.iframe<IframeProps>`
  height: 100%;
  min-height: ${props => props.iframeHeight}px;
`;

interface OnSelectObject {
  path?: string;
  title?: string;
}

interface Props {
  h5pUrl?: string;
  height?: number;
  onSelect: (selected: OnSelectObject) => void;
  onClose: () => void;
  locale: string;
  canReturnResources?: boolean;
}

interface State {
  url?: string;
  fetchFailed: boolean;
}

interface MessageEvent extends Event {
  data: {
    embed_id: string;
    oembed_url: string;
    messageType?: string;
    type?: string;
  };
}

class H5PElement extends Component<Props & tType, State> {
  constructor(props: Props & tType) {
    super(props);
    this.state = {
      url: undefined,
      fetchFailed: false,
    };
    this.handleH5PChange = this.handleH5PChange.bind(this);
    this.handleH5PClose = this.handleH5PClose.bind(this);
  }

  /* eslint-disable react/no-did-mount-set-state -- See: https://github.com/yannickcr/eslint-plugin-react/issues/1110 */
  async componentDidMount() {
    const { h5pUrl, locale } = this.props;
    window.addEventListener('message', this.handleH5PChange);
    window.addEventListener('message', this.handleH5PClose);
    try {
      const data = h5pUrl
        ? await editH5PiframeUrl(h5pUrl, locale)
        : await fetchH5PiframeUrl(locale, this.props.canReturnResources);
      this.setState(() => ({ url: data.url }));
    } catch (e) {
      this.setState({ fetchFailed: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleH5PChange);
    window.removeEventListener('message', this.handleH5PClose);
  }

  async handleH5PChange(event: MessageEvent) {
    const { onSelect } = this.props;
    if (event.data.type !== 'h5p') {
      return;
    }

    // Currently, we need to strip oembed part of H5P-url to support NDLA proxy oembed service
    const { oembed_url: oembedUrl } = event.data;
    const url = oembedUrl.match(/url=([^&]*)/)?.[0].replace('url=', '');
    const path = url?.replace(/https?:\/\/h5p.{0,8}.ndla.no/, '');
    try {
      const metadata = await fetchH5PMetadata(event.data.embed_id);
      const title = metadata.h5p.title;
      onSelect({ path, title });
    } catch (e) {
      onSelect({ path });
      handleError(e);
    }
  }

  async handleH5PClose(event: MessageEvent) {
    const { onClose } = this.props;
    if (event.data.messageType !== 'closeEdlibModal') {
      return;
    }
    onClose();
  }

  render() {
    const { url, fetchFailed } = this.state;
    const { height = 950, t } = this.props;
    return (
      <FlexWrapper>
        {fetchFailed && (
          <ErrorMessage
            illustration={{
              url: '/Oops.gif',
              altText: t('errorMessage.title'),
            }}
            messages={{
              title: t('errorMessage.title'),
              description: t('h5pElement.fetchError'),
              back: t('errorMessage.back'),
              goToFrontPage: t('errorMessage.goToFrontPage'),
            }}
          />
        )}
        {url && <StyledIFrame iframeHeight={height} src={url} title="H5P" frameBorder="0" />}
      </FlexWrapper>
    );
  }

  static propTypes = {
    h5pUrl: PropTypes.string,
    height: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    canReturnResources: PropTypes.bool,
  };
}

export default injectT(H5PElement);
