/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import SlateTypes from 'slate-prop-types';
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import FigureButtons from './FigureButtons';
import EditImage from './EditImage';

class SlateImage extends React.Component {
  constructor() {
    super();
    this.state = {
      editModus: false,
    };
    this.setEditModus = this.setEditModus.bind(this);
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
      locale,
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

    const figureClassNames = `c-figure ${['left', 'right'].includes(
      embed.align,
    ) &&
      ['small', 'xsmall'].includes(embed.size) &&
      `u-float-${embed.size}-${embed.align}`} ${['left', 'right'].includes(
      embed.align,
    ) &&
      isSelectedForCopy &&
      (!editModus || !active) &&
      'isSelectedForCopy'}`;

    return (
      <div {...attributes} className={figureClassNames}>
        <FigureButtons
          tooltip={t('form.image.removeImage')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="image"
          locale={locale}
        />
        {editModus && (
          <EditImage embed={embed} setEditModus={this.setEditModus} {...rest} />
        )}
        <Button
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
        </Button>
      </div>
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
