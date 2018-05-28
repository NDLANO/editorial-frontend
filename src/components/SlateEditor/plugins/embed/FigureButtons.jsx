/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'ndla-ui';
import { Cross, Pencil, Plus } from 'ndla-icons/action';
import { editorClasses } from './SlateFigure';
import { EmbedShape } from '../../../../shapes';


const url = {
  audio: '/media/audio-upload',
  image: '/media/image-upload',
}

const FigureButtons = ({onRemoveClick, embed, locale, figureType}) => {
  const isNotCentered = embed.align === 'left' || embed.align === 'right' || embed.size === 'small' || embed.align === 'xsmall'
  return (
    <div {...editorClasses('figure-buttons', isNotCentered ? 'right-adjusted' : '')}>
      <Button
        {...editorClasses('button', 'red')}
        onClick={onRemoveClick}
        stripped>
        <Cross />
      </Button>
      <Link to={`${url[figureType]}/new`} target="_blank">
        <Plus />
      </Link>
      <Link to={`${url[figureType]}/${embed.resource_id}/edit/${locale}`} target="_blank" {...editorClasses('button', 'green')}>
        <Pencil />
      </Link>
    </div>
  )
};

FigureButtons.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  embed: EmbedShape.isRequired,
  figureType: PropTypes.string.isRequired,
};

export default FigureButtons;
