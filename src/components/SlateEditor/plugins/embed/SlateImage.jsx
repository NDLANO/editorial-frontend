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
import { injectT } from '@ndla/i18n';
import { Figure } from '@ndla/ui';
import Button from '@ndla/button';
import { findDOMNode } from 'slate-react';
import SlateTypes from 'slate-prop-types';
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import FigureButtons from './FigureButtons';
import EditImage from './EditImage';

class SlateImage extends React.Component {
  static handleFloatedImages(node, align) {
    const nodeEl = findDOMNode(node); // eslint-disable-line react/no-find-dom-node
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

  componentDidUpdate({ embed: { align: prevAlign } }) {
    const {
      embed: { align },
      node,
    } = this.props;
    if (align !== prevAlign) {
      SlateImage.handleFloatedImages(node, align);
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
      onRemoveClick,
      locale,
      t,
      ...rest
    } = this.props;

    const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;

    const transformData = {
      'focal-x': embed['focal-x'],
      'focal-y': embed['focal-y'],
      'upper-left-x': embed['upper-left-x'],
      'upper-left-y': embed['upper-left-y'],
      'lower-right-x': embed['lower-right-x'],
      'lower-right-y': embed['lower-right-y'],
    };

    const figureClassNames = classnames('c-figure', {
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
          locale={locale}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="image"
        />
        {this.state.editModus ? (
          <EditImage
            embed={embed}
            t={t}
            closeEdit={this.toggleEditModus}
            {...rest}
          />
        ) : (
          <Button
            stripped
            onClick={this.toggleEditModus}
            style={{ textAlign: 'left' }}>
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
          </Button>
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
  locale: PropTypes.string.isRequired,
};

export default injectT(SlateImage);
