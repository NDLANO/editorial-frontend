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
    background: rgba(0, 0, 0, 0.5);
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
    this.toggleEditModus = this.toggleEditModus.bind(this);
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

  toggleEditModus(close) {
    this.setState(prevState => ({
      editModus: close === true ? false : !prevState.editModus,
    }));
  }

  render() {
    const {
      embed,
      figureClass,
      attributes,
      onRemoveClick,
      locale,
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

    const embedSize = editModus ? {
      align: '',
      size: 'fullbredde',
    } : {
      align: embed.align,
      size: embed.size,
    };

    const figureClassNames = cx('c-figure', {
      [`u-float-${embedSize.size}-${embedSize.align}`]:
        ['left', 'right'].includes(embedSize.align) &&
        ['small', 'xsmall'].includes(embedSize.size),
      [`u-float-${embedSize.align}`]:
        ['left', 'right'].includes(embedSize.align) &&
        !['small', 'xsmall'].includes(embedSize.size),
    });

    return (
      <Figure
        {...attributes}
        id={embed.resource_id}
        className={figureClassNames}>
        <FigureButtons
          locale={locale}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="image"
        />
        {editModus ? (
          <EditImage embed={embed} closeEdit={this.toggleEditModus} {...rest} />
        ) : (
          <StyledButtonFigure
            stripped
            data-label={t('imageEditor.editImage')}
            onClick={this.toggleEditModus}>
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
        )}
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
  locale: PropTypes.string.isRequired,
};

export default injectT(SlateImage);
