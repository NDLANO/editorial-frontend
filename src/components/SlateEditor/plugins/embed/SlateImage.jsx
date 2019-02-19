/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Figure } from '@ndla/ui';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import styled, { cx } from 'react-emotion';
import { findDOMNode } from 'slate-react';
import SlateTypes from 'slate-prop-types';
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import FigureButtons from './FigureButtons';
import EditImage from './EditImage';

const StyledButtonFigure = styled(Button)`
  position: relative;

  &::before {
    font-size: 26px;
    content: attr(data-label);
    transition: opacity 200ms ease;
    display: flex;
    position: absolute;
    top: 0;
    height: inherit;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    text-shadow: 0 1px 6.5px rgba(0, 0, 0, 0.7);
    z-index: 1;
    bottom: 0;
    left: 0;
    right: 0;
    color: #fff;
    align-items: center;
    justify-content: center;
  }

  &:hover,
  &:focus {
    &::before {
      opacity: 1;
    }
  }
`;

class SlateImage extends React.Component {
  static handleFloatedImages(node, align) {
    const nodeEl = findDOMNode(node); // eslint-disable-line react/no-find-dom-node
    if (align === 'right' || align === 'left') {
      nodeEl.parentNode.style.display = 'inline';
    } else {
      nodeEl.parentNode.style.display = 'block';
    }
  }

  constructor() {
    super();
    this.state = {
      editModus: false,
    };
    this.setEditModus = this.setEditModus.bind(this);
  }

  componentDidMount() {
    const { align } = this.props.embed;
    SlateImage.handleFloatedImages(this.props.node, align);
  }

  componentDidUpdate({ embed: { align: prevAlign } }) {
    const {
      embed: { align },
      node,
    } = this.props;
    if (align !== prevAlign) {
      SlateImage.handleFloatedImages(node, align);
    }
  }

  setEditModus(editModus) {
    this.setState({
      editModus,
    });
  }

  render() {
    const {
      embed,
      figureClass,
      attributes,
      onRemoveClick,
      isSelectedForCopy,
      active,
      t,
      ...rest
    } = this.props;
    const { editModus } = this.state;

    const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;

    const transformData = {
      'focal-x': embed['focal-x'],
      'focal-y': embed['focal-y'],
      'upper-left-x': embed['upper-left-x'],
      'upper-left-y': embed['upper-left-y'],
      'lower-right-x': embed['lower-right-x'],
      'lower-right-y': embed['lower-right-y'],
    };

    const figureClassNames = cx('c-figure', {
      [`u-float-${embed.size}-${embed.align}`]:
        ['left', 'right'].includes(embed.align) &&
        ['small', 'xsmall'].includes(embed.size),
      [`u-float-${embed.align}`]:
        ['left', 'right'].includes(embed.align) &&
        !['small', 'xsmall'].includes(embed.size),
    });

    return (
      <Figure
        {...attributes}
        id={embed.resource_id}
        className={figureClassNames}>
        <FigureButtons
          tooltip={t('form.image.removeImage')}
          onRemoveClick={onRemoveClick}
          embed={embed}
        />
        {editModus && (
          <EditImage embed={embed} setEditModus={this.setEditModus} {...rest} />
        )}
        <StyledButtonFigure
          style={{ opacity: editModus ? 0 : 1 }}
          stripped
          data-label={t('imageEditor.editImage')}
          onClick={() => this.setEditModus(true)}>
          <figure {...figureClass}>
            <img
              src={src}
              alt={embed.alt}
              srcSet={getSrcSets(embed.resource_id, transformData)}
            />
            <figcaption className="c-figure__caption">
              <div className="c-figure__info">{embed.caption}</div>
            </figcaption>
          </figure>
        </StyledButtonFigure>
      </Figure>
    );
  }
}

SlateImage.propTypes = {
  node: SlateTypes.node.isRequired,
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.shape({ className: PropTypes.string }).isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  isSelectedForCopy: PropTypes.bool,
  active: PropTypes.bool,
};

export default injectT(SlateImage);
