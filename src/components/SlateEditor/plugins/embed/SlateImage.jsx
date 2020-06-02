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
import { connect } from 'react-redux';
import Button from '@ndla/button';
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import FigureButtons from './FigureButtons';
import { getLocale } from '../../../../modules/locale/locale';

class SlateImage extends React.Component {
  constructor() {
    super();
    this.state = {
      editModus: false,
    };
    this.setEditModus = this.setEditModus.bind(this);
    this.constructFigureClassName = this.constructFigureClassName.bind(this);
  }

  setEditModus(editModus) {
    this.setState({
      editModus,
    });
  }

  constructFigureClassName() {
    const { embed } = this.props;
    const isFullWidth = embed.size === 'fullwidth';

    const size = ['small', 'xsmall'].includes(embed.size)
      ? `-${embed.size}`
      : '';

    const align = ['left', 'right'].includes(embed.align)
      ? `-${embed.align}`
      : '';

    const figureClassNames = `c-figure ${
      !isFullWidth ? `u-float${size}${align}` : ''
    }`;

    return figureClassNames;
  }

  render() {
    const {
      embed,
      figureClass,
      attributes,
      onRemoveClick,
      isSelectedForCopy,
      active,
      language,
      renderEditComponent,
      visualElement,
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

    const figureClassNames = this.constructFigureClassName();

    const showCopyOutline = isSelectedForCopy && (!editModus || !active);

    return (
      <div
        {...attributes}
        draggable={!visualElement && !editModus}
        className={figureClassNames}
        css={!embed.alt && { border: '2px solid rgba(209,55,46,0.3);' }}>
        <FigureButtons
          tooltip={t('form.image.removeImage')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          t={t}
          figureType="image"
          language={language}
        />
        {editModus &&
          renderEditComponent({
            embed,
            setEditModus: this.setEditModus,
            ...rest,
          })}
        {!(visualElement && editModus) && (
          <Button
            stripped
            data-label={t('imageEditor.editImage')}
            onClick={() => this.setEditModus(true)}>
            <figure {...figureClass}>
              <img
                src={src}
                alt={embed.alt}
                style={{ minWidth: '716px' }}
                srcSet={getSrcSets(embed.resource_id, transformData)}
                css={
                  showCopyOutline && {
                    boxShadow: 'rgb(32, 88, 143) 0 0 0 2px;',
                  }
                }
              />
              <figcaption className="c-figure__caption">
                <div className="c-figure__info">{embed.caption}</div>
              </figcaption>
            </figure>
          </Button>
        )}
      </div>
    );
  }
}

SlateImage.propTypes = {
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.shape({ className: PropTypes.string }),
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
  isSelectedForCopy: PropTypes.bool,
  active: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  visualElement: PropTypes.bool,
  renderEditComponent: PropTypes.func,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(SlateImage));
