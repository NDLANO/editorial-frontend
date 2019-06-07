import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import FocusTrapReact from 'focus-trap-react';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { shadows } from '@ndla/core';
import { connect } from 'formik';
import Overlay from '../Overlay';
import { EmbedShape, EditorShape } from '../../shapes';
import FigureInput from '../SlateEditor/plugins/embed/FigureInput';
import { getSrcSets } from '../../util/imageEditorUtil';
import config from '../../config';

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
  position: relative;
`;

const imageEditorWrapperStyle = css`
  background-color: white;
`;

class EditVisualElementImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: props.embed.caption,
      alt: props.embed.alt,
      madeChanges: false,
    };
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAbort = this.onAbort.bind(this);
  }

  onSave() {
    const {
      setEditModus,
      formik: { handleChange },
    } = this.props;
    const { caption, alt } = this.state;

    handleChange({ target: { name: 'visualElement.alt', value: alt } });
    handleChange({ target: { name: 'visualElement.caption', value: caption } });
    setEditModus(false);
  }

  onAbort() {
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
    const { caption, madeChanges, alt } = this.state;
    return (
      <div css={imageEditorWrapperStyle}>
        <Overlay />
        <FocusTrapReact
          focusTrapOptions={{
            onDeactivate: () => {
              setEditModus(false);
            },
            clickOutsideDeactivates: true,
            escapeDeactivates: true,
          }}>
          <div css={editorContentCSS}>
            <figure>
              <img
                src={`${config.ndlaApiUrl}/image-api/raw/id/${
                  embed.resource_id
                }`}
                alt={embed.alt}
                srcSet={getSrcSets(embed.resource_id, {})}
              />
            </figure>
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
      </div>
    );
  }
}

EditVisualElementImage.propTypes = {
  setEditModus: PropTypes.func,
  embed: EmbedShape.isRequired,
  saveEmbedUpdates: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  node: Types.node.isRequired,
  editor: EditorShape,
  formik: PropTypes.shape({
    handleChange: PropTypes.func,
  }).isRequired,
};

export default injectT(connect(EditVisualElementImage));
