import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import FocusTrapReact from 'focus-trap-react';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { spacing, colors, shadows } from '@ndla/core';
import Button from '@ndla/button';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import { isEmpty } from '../../../validators';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import { EmbedShape, EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../editorSchema';
import Overlay from '../../../Overlay';

const StyledInputWrapper = styled.div`
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: 20;
`;

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
`;

const imageEditorWrapperStyle = css`
  background-color: white;
`;

class EditImage extends Component {
  constructor(props) {
    super(props);
    const { embed } = this.props;
    this.state = {
      alt: props.embed.alt,
      caption: props.embed.caption,
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
        ...this.state.imageUpdates,
        ...imageUpdates,
      },
      madeChanges: true,
    }));
  }

  onSave() {
    const {
      node,
      editor,
      onFigureInputMultipleUpdates,
      setEditModus,
    } = this.props;
    const { caption, alt, imageUpdates } = this.state;

    onFigureInputMultipleUpdates({
      caption: caption,
      alt: alt,
    });

    const data = {
      ...getSchemaEmbed(node),
      ...imageUpdates.transformData,
      align: imageUpdates.align,
      size: imageUpdates.size,
    };
    console.log(data);

    editor.setNodeByKey(node.key, { data });

    setEditModus(false);
  }

  onAbort() {
    this.setState({
      imageUpdates: undefined,
    });
    this.props.setEditModus(false);
  }

  onEdit(key, value) {
    this.setState({
      [key]: value,
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
              <StyledInputWrapper>
                <Input
                  name="caption"
                  label={`${t('form.image.caption.label')}:`}
                  value={caption}
                  onChange={e => this.onEdit('caption', e.target.value)}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.image.caption.placeholder')}
                  white
                />
                <Input
                  name="alt"
                  label={`${t('form.image.alt.label')}:`}
                  value={alt}
                  onChange={e => this.onEdit('alt', e.target.value)}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.image.alt.placeholder')}
                  white
                  warningText={
                    !submitted && isEmpty(alt) ? t('form.image.alt.noText') : ''
                  }
                />
                <StyledButtonWrapper paddingLeft>
                  <Button onClick={this.onAbort} outline>
                    {t('form.abort')}
                  </Button>
                  <Button disabled={!madeChanges} onClick={this.onSave}>
                    {t('form.image.save')}
                  </Button>
                </StyledButtonWrapper>
              </StyledInputWrapper>
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
  onFigureInputMultipleUpdates: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(EditImage);
