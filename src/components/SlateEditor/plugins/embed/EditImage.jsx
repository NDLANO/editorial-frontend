import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import FocusTrapReact from 'focus-trap-react';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { spacing, shadows } from '@ndla/core';
import FigureInput from './FigureInput';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import { EmbedShape, EditorShape } from '../../../../shapes';
import Overlay from '../../../Overlay';

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
`;

const imageEditorWrapperStyle = css`
  background-color: white;
`;

class EditImage extends Component {
  constructor(props) {
    super(props);
    const { embed } = props;
    this.state = {
      alt: embed.alt,
      caption: embed.caption,
      imageUpdates: {
        transformData: {
          'focal-x': embed['focal-x'],
          'focal-y': embed['focal-y'],
          'upper-left-x': embed['upper-left-x'],
          'upper-left-y': embed['upper-left-y'],
          'lower-right-x': embed['lower-right-x'],
          'lower-right-y': embed['lower-right-y'],
        },
        align: embed.align,
        size: embed.size,
      },
      madeChanges: false,
    };
    this.onUpdatedImageSettings = this.onUpdatedImageSettings.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAbort = this.onAbort.bind(this);
  }

  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();

    // Use contenteditable as reference to fetch embed size when previewing.
    const placeholderRect = placeholderEl
      .closest('div[contenteditable="false"]')
      .getBoundingClientRect();

    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${placeholderRect.left +
      spacing.spacingUnit -
      placeholderRect.width * (0.333 / 2)}px`;
    embedEl.style.width = `${placeholderRect.width * 1.333 -
      spacing.spacingUnit * 2}px`;
  }

  onUpdatedImageSettings(imageUpdates) {
    this.setState(prevState => ({
      imageUpdates: {
        ...prevState.imageUpdates,
        ...imageUpdates,
      },
      madeChanges: true,
    }));
  }

  onSave() {
    const { saveEmbedUpdates, setEditModus } = this.props;
    const { caption, alt, imageUpdates } = this.state;

    saveEmbedUpdates({
      ...imageUpdates.transformData,
      align: imageUpdates.align,
      size: imageUpdates.size,
      caption,
      alt,
    });

    setEditModus(false);
  }

  onAbort() {
    this.setState({
      imageUpdates: undefined,
    });
    this.props.setEditModus(false);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      madeChanges: true,
    });
  }

  render() {
    const { embed, submitted, t, setEditModus } = this.props;
    const { caption, madeChanges, alt, imageUpdates } = this.state;
    return (
      <div
        css={imageEditorWrapperStyle}
        ref={placeholderEl => {
          this.placeholderEl = placeholderEl;
        }}>
        <Overlay />
        <Portal isOpened>
          <FocusTrapReact
            focusTrapOptions={{
              onDeactivate: () => {
                setEditModus(false);
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}>
            <div
              css={editorContentCSS}
              ref={embedEl => {
                this.embedEl = embedEl;
              }}>
              <ImageEditor
                embedTag={embed}
                toggleEditModus={setEditModus}
                onUpdatedImageSettings={this.onUpdatedImageSettings}
                imageUpdates={imageUpdates}
                {...this.props}
              />
              <FigureInput
                t={t}
                caption={caption}
                alt={alt}
                submitted={submitted}
                madeChanges={madeChanges}
                onChange={this.onChange}
                onAbort={this.onAbort}
                onSave={this.onSave}
              />
            </div>
          </FocusTrapReact>
        </Portal>
      </div>
    );
  }
}

EditImage.propTypes = {
  setEditModus: PropTypes.func,
  embed: EmbedShape.isRequired,
  saveEmbedUpdates: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(EditImage);
