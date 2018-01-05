/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { injectT } from 'ndla-i18n';
import { Button, Figure } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import { findDOMNode } from 'slate-react';
import SlateTypes from 'slate-prop-types';
import SlateInputField from './SlateInputField';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { EmbedShape } from '../../../../shapes';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import { editorClasses } from './SlateFigure';

class SlateImage extends React.Component {
  static handleFloatedImages(node, align) {
    const nodeEl = findDOMNode(node); // eslint-disable-line
    if (align === 'right' || align === 'left') {
      nodeEl.parentNode.style.display = 'inline';
    } else {
      nodeEl.parentNode.style.display = 'inline-block';
    }
  }

  constructor() {
    super();
    this.state = {
      editModus: false,
    };
    this.toggleEditModus = this.toggleEditModus.bind(this);
  }

  componentDidMount() {
    const { align } = this.props.embed;
    SlateImage.handleFloatedImages(this.props.node, align);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.embed.align !== nextProps.embed.align) {
      SlateImage.handleFloatedImages(nextProps.node, nextProps.embed.align);
    }
  }

  toggleEditModus() {
    this.setState(prevState => ({
      editModus: !prevState.editModus,
    }));
  }

  render() {
    const {
      embed,
      figureClass,
      attributes,
      onFigureInputChange,
      submitted,
      onRemoveClick,
      t,
    } = this.props;
    const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${
      embed.resource_id
    }`;
    const transformData = {
      'focal-x': embed['focal-x'],
      'focal-y': embed['focal-y'],
      'upper-left-x': embed['upper-left-x'],
      'upper-left-y': embed['upper-left-y'],
      'lower-right-x': embed['lower-right-x'],
      'lower-right-y': embed['lower-right-y'],
    };

    const figureClassNames = classnames('c-figure', {
      'article_figure--float-right': embed.align === 'right',
      'article_figure--float-left': embed.align === 'left',
    });

    return (
      <Figure {...attributes} className={figureClassNames}>
        <Button onClick={onRemoveClick} stripped {...editorClasses('delete-button')}>
          <Cross />
        </Button>
        {this.state.editModus ? (
          <ImageEditor
            embedTag={embed}
            toggleEditModus={this.toggleEditModus}
            {...this.props}
          />
        ) : (
          <Button stripped onClick={this.toggleEditModus}>
            <figure {...figureClass}>
              <img
                src={src}
                alt={embed.alt}
                srcSet={getSrcSets(embed.resource_id, transformData)}
              />
            </figure>
          </Button>
        )}
        <SlateInputField
          name="caption"
          label={t('form.image.caption.label')}
          type="text"
          value={embed.caption}
          required
          onChange={onFigureInputChange}
          placeholder={t('form.image.caption.placeholder')}
          submitted={submitted}
        />
        <SlateInputField
          name="alt"
          label={t('form.image.alt.label')}
          type="text"
          required
          value={embed.alt}
          onChange={onFigureInputChange}
          placeholder={t('form.image.alt.placeholder')}
          submitted={submitted}
        />
      </Figure>
    );
  }
}

SlateImage.propTypes = {
  node: SlateTypes.node.isRequired,
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.object.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
};

export default injectT(SlateImage);
