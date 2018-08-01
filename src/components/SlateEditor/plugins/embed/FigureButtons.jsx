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
import { injectT } from 'ndla-i18n';
import { Cross, Pencil, Plus } from 'ndla-icons/action';
import { editorClasses } from './SlateFigure';
import { EmbedShape } from '../../../../shapes';
import WarningModal from '../../../WarningModal';

export class FigureButtons extends React.Component {
  constructor() {
    super();
    this.state = { showDeleteConfirmation: false };
    this.toggleDelete = this.toggleDelete.bind(this);
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
  }

  onDeleteConfirm(e) {
    const { onRemoveClick } = this.props;
    this.setState({ showDeleteConfirmation: false });
    onRemoveClick(e);
  }

  toggleDelete() {
    this.setState(prevState => ({
      showDeleteConfirmation: !prevState.showDeleteConfirmation,
    }));
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
          onClick={this.toggleDelete}
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
        {this.state.showDeleteConfirmation && (
          <WarningModal
            confirmDelete
            text={t('form.content.figure.confirmDelete')}
            onContinue={this.onDeleteConfirm}
            onCancel={this.toggleDelete}
          />
        )}
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
