import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import FocusTrapReact from 'focus-trap-react';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { spacing, colors, animations, shadows } from '@ndla/core';
import Button from '@ndla/button';
import { FormInput, StyledButtonWrapper } from '@ndla/forms';
import { isEmpty } from '../../../validators';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import { EmbedShape, EditorShape } from '../../../../shapes';
import { getSchemaEmbed } from '../../editorSchema';

const StyledInputWrapper = styled.div`
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: 20;
`;

const Background = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
  ${animations.fadeIn()}
`;

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
`;

class EditImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alt: props.embed.alt,
      caption: props.embed.caption,
      imageUpdates: undefined,
      madeChanges: false,
    }
    this.onUpdatedImageSettings = this.onUpdatedImageSettings.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onAbort = this.onAbort.bind(this);
  }

  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();

    // Use contenteditable as reference to fetch embed size when previewing.
    const placeholderRect = placeholderEl.closest('div[contenteditable="false"]').getBoundingClientRect();
    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${(placeholderRect.left + spacing.spacingUnit) - (placeholderRect.width * (0.333 / 2))}px`;
    embedEl.style.width = `${(placeholderRect.width * 1.333) - (spacing.spacingUnit * 2)}px`;

    const embedRect = embedEl.getBoundingClientRect();

    placeholderEl.style.height = `${embedRect.height + (spacing.spacingUnit * 2)}px`;
  }

  onUpdatedImageSettings(imageUpdates) {
    this.setState({
      imageUpdates: imageUpdates,
      madeChanges: true,
    });
    
  }

  onSave() {
    this.props.onFigureInputMultipleUpdates({
      caption: this.state.caption,
      alt: this.state.alt,
    });

    const { node, editor } = this.props;
    const data = {
      ...getSchemaEmbed(node),
      ...this.state.imageUpdates.transformData,
      align: this.state.imageUpdates.align,
      size: this.state.imageUpdates.size,
    };

    editor.setNodeByKey(node.key, { data });
    this.props.closeEdit(true);
  }

  onAbort() {
    this.setState({
      imageUpdates: undefined,
    });
    this.props.closeEdit(true);
  }

  onEdit(key, value) {
    this.setState({
      [key]: value,
      madeChanges: true,
    });
  }

  render() {
    const { embed, submitted, t, closeEdit } = this.props;

    return (
      <div
        ref={placeholderEl => {
          this.placeholderEl = placeholderEl;
        }}>
        <Background />
        <Portal isOpened>
          <FocusTrapReact
            focusTrapOptions={{
              onDeactivate: () => {
                closeEdit(true)
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}
          >
            <div
            className={editorContentCSS}
            ref={embedEl => {
              this.embedEl = embedEl;
            }}>
              <ImageEditor
                embedTag={embed}
                toggleEditModus={closeEdit}
                onUpdatedImageSettings={this.onUpdatedImageSettings}
                {...this.props}
              />
              <StyledInputWrapper>
                <FormInput
                  name="caption"
                  label={`${t('form.image.caption.label')}:`}
                  value={this.state.caption}
                  onChange={e => this.onEdit('caption', e.target.value)}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.image.caption.placeholder')}
                  white
                />
                <FormInput
                  name="alt"
                  label={`${t('form.image.alt.label')}:`}
                  value={this.state.alt}
                  onChange={e => this.onEdit('alt', e.target.value)}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.image.alt.placeholder')}
                  white
                  warningText={!submitted && isEmpty(this.state.alt) ? t('form.image.alt.noText') : ''}
                />
                <StyledButtonWrapper paddingLeft>
                  <Button disabled={!this.state.madeChanges} onClick={this.onSave}>
                    {t('form.save')}
                  </Button>
                  <Button onClick={this.onAbort}>
                    {t('form.abort')}
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
  closeEdit: PropTypes.func,
  embed: EmbedShape.isRequired,
  onFigureInputMultipleUpdates: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(EditImage);
