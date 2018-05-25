/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import './h5pResizer';
import handleError from '../../util/handleError';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { editorClasses } from '../../components/SlateEditor/plugins/embed/SlateFigure';

export const getIframeSrcFromHtmlString = html => {
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export class DisplayExternal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    try {
      const data = await fetchExternalOembed(this.props.url);
      const src = getIframeSrcFromHtmlString(data.html);
      if (src) {
        this.setState({
          title: data.title,
          src,
          type: data.type,
          provider: data.providerName,
        });
      } else {
        this.setState({ error: true });
      }
    } catch (e) {
      handleError(e);
      this.setState({ error: true });
    }
  }

  render() {
    const { onRemoveClick, url } = this.props;
    const { title, src, error, type, provider } = this.state;

    // TODO: When we need to support more, move this to helper function
    // Checks for h5p in domain name from URL
    const isH5p =
      url
        .match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im)[1]
        .indexOf('h5p') > -1;
    const isYouTube = type === 'video' && provider === 'YouTube';

    const externalIframe =
      !isYouTube && !isH5p ? null : (
        <iframe
          style={
            isYouTube
              ? {
                  minHeight: '436px',
                }
              : undefined
          }
          ref={iframe => {
            this.iframe = iframe;
          }}
          src={src}
          title={title}
          allowFullScreen={isYouTube || undefined}
          frameBorder="0"
        />
      );

    if (error) {
      return (
        <Fragment>
          <Button
            stripped
            onClick={onRemoveClick}
            {...editorClasses('delete-button')}>
            <Cross />
          </Button>
          <EditorErrorMessage
            msg={this.props.t('displayOembed.errorMessage')}
          />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Button
          stripped
          onClick={onRemoveClick}
          {...editorClasses('delete-button')}>
          <Cross />
        </Button>
        {externalIframe || (
          <EditorErrorMessage
            msg={this.props.t('displayOembed.notSupported', { type, provider })}
          />
        )}
      </Fragment>
    );
  }
}

DisplayExternal.propTypes = {
  url: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func,
};

export default injectT(DisplayExternal);
