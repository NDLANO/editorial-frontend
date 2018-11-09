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
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Cross, Pencil, Plus } from '@ndla/icons/action';
import { editorClasses } from './SlateFigure';
import { EmbedShape } from '../../../../shapes';

export class FigureButtons extends React.Component {
  constructor() {
    super();
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
  }

  onDeleteConfirm(e) {
    const { onRemoveClick } = this.props;
    onRemoveClick(e);
  }

  render() {
    const { embed, locale, figureType, t } = this.props;
    const url = {
      audio: {
        path: '/media/audio-upload',
        newTitle: t('form.addNewAudio'),
        editTitle: t('form.editAudio'),
      },
      image: {
        path: '/media/image-upload',
        newTitle: t('form.addNewImage'),
        editTitle: t('form.editImage'),
      },
    };

    const isNotCentered =
      embed.align === 'left' ||
      embed.align === 'right' ||
      embed.size === 'small' ||
      embed.size === 'xsmall';
    return (
      <div
        {...editorClasses(
          'figure-buttons',
          isNotCentered ? 'right-adjusted' : '',
        )}>
        <Button
          {...editorClasses('button', 'red')}
          onClick={this.onDeleteConfirm}
          stripped>
          <Cross />
        </Button>
        <Link
          to={`${url[figureType].path}/new`}
          target="_blank"
          title={url[figureType].newTitle}>
          <Plus />
        </Link>
        <Link
          to={`${url[figureType].path}/${embed.resource_id}/edit/${locale}`}
          target="_blank"
          {...editorClasses('button', 'green')}
          title={url[figureType].editTitle}>
          <Pencil />
        </Link>
      </div>
    );
  }
}

FigureButtons.propTypes = {
  onRemoveClick: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  embed: EmbedShape.isRequired,
  figureType: PropTypes.string.isRequired,
};

export default injectT(FigureButtons);
