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
import Types from 'slate-prop-types';
import { Cross, Pencil } from 'ndla-icons/action';
import './h5pResizer';
import Lightbox from '../Lightbox';
import VisualElementSearch from '../../containers/VisualElement/VisualElementSearch';
import handleError from '../../util/handleError';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { editorClasses } from '../SlateEditor/plugins/embed/SlateFigure';

export const getIframeSrcFromHtmlString = html => {
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export class DisplayExternal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editH5pMode: false,
    };
    this.onEditEmbed = this.onEditEmbed.bind(this);
    this.toggleEditH5p = this.toggleEditH5p.bind(this);
    this.getPropsFromEmbed = this.getPropsFromEmbed.bind(this);
  }

  componentDidMount() {
    this.getPropsFromEmbed(this.props.url);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.getPropsFromEmbed(this.props.url);
    }
  }

  onEditEmbed(properties) {
    const { editor, node } = this.props;

    if (properties.url !== this.props.url) {
      const next = editor.value.change().setNodeByKey(node.key, {
        data: {
          ...properties,
        },
      });
      editor.onChange(next);

      this.toggleEditH5p();
    }
  }

  async getPropsFromEmbed(url) {
    try {
      const data = await fetchExternalOembed(url);
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

  toggleEditH5p() {
    const { changeVisualElement } = this.props;
    if (changeVisualElement) {
      changeVisualElement('h5p');
    } else
      this.setState(prevState => ({ editH5pMode: !prevState.editH5pMode }));
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
        <div {...editorClasses('figure-buttons', '')}>
          <Button
            stripped
            onClick={onRemoveClick}
            {...editorClasses('button', 'red')}>
            <Cross />
          </Button>
          {isH5p && (
            <Button
              stripped
              onClick={this.toggleEditH5p}
              {...editorClasses('button', 'green')}>
              <Pencil />
            </Button>
          )}
        </div>
        {externalIframe || (
          <EditorErrorMessage
            msg={this.props.t('displayOembed.notSupported', { type, provider })}
          />
        )}
        {this.state.editH5pMode && (
          <Lightbox display fullscreen big onClose={this.toggleEditH5p}>
            <VisualElementSearch
              selectedResource="h5p"
              selectedResourceUrl={src}
              handleVisualElementChange={this.onEditEmbed}
            />
          </Lightbox>
        )}
      </Fragment>
    );
  }
}

DisplayExternal.propTypes = {
  url: PropTypes.string.isRequired,
  onRemoveClick: PropTypes.func,
  changeVisualElement: PropTypes.func,
  editor: EditorShape,
  node: Types.node,
};

export default injectT(DisplayExternal);
