/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { injectT } from '@ndla/i18n';
import { connect } from 'react-redux';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import config from '../../../../config';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import FigureButtons from './FigureButtons';
import { getLocale } from '../../../../modules/locale/locale';
import { Embed, SlateEditor, TranslateType } from '../../../../interfaces';

const buttonStyle = css`
  min-width: -webkit-fill-available;
  min-width: -moz-available;
`;

interface Props {
  t: TranslateType;
  active: boolean;
  attributes: {
    'data-key': String;
    'data-slate-object': String;
  };
  editor: SlateEditor;
  embed: Embed;
  figureClass: { className: string };
  isSelectedForCopy: boolean;
  language: string;
  locale: string;
  node: {
    key: string;
  };
  onRemoveClick: Function;
  renderEditComponent: Function;
  visualElement: boolean;
}

const SlateImage: React.FC<Props> = ({
  t,
  active,
  attributes,
  editor,
  embed,
  figureClass,
  isSelectedForCopy,
  language,
  locale,
  node,
  onRemoveClick,
  renderEditComponent,
  visualElement,
}) => {
  const [editMode, setEditMode] = useState(false);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);

  const constructFigureClassName = () => {
    const isFullWidth = embed.size === 'fullwidth';
    const size = ['small', 'xsmall'].includes(embed.size)
      ? `-${embed.size}`
      : '';
    const align = ['left', 'right'].includes(embed.align)
      ? `-${embed.align}`
      : '';

    return `c-figure ${!isFullWidth ? `u-float${size}${align}` : ''}`;
  };

  const transformData = () => {
    return {
      'focal-x': embed['focal-x'],
      'focal-y': embed['focal-y'],
      'upper-left-x': embed['upper-left-x'],
      'upper-left-y': embed['upper-left-y'],
      'lower-right-x': embed['lower-right-x'],
      'lower-right-y': embed['lower-right-y'],
    };
  };

  const props = {
    t,
    active,
    attributes,
    editor,
    embed,
    figureClass,
    isSelectedForCopy,
    language,
    locale,
    node,
    onRemoveClick,
    renderEditComponent,
    visualElement,
  };

  return (
    <div
      {...attributes}
      draggable={!visualElement && !editMode}
      className={constructFigureClassName()}
      css={!embed.alt && { border: '2px solid rgba(209,55,46,0.3);' }}>
      <FigureButtons
        tooltip={t('form.image.removeImage')}
        onRemoveClick={onRemoveClick}
        embed={embed}
        t={t}
        figureType="image"
        language={language}
      />
      {editMode &&
        renderEditComponent({
          embed,
          setEditModus: setEditMode,
          ...props,
        })}
      {!(visualElement && editMode) && (
        <Button
          css={buttonStyle}
          stripped
          data-label={t('imageEditor.editImage')}
          onClick={() => setEditMode(true)}>
          <figure {...figureClass}>
            <img
              src={`${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`}
              alt={embed.alt}
              srcSet={getSrcSets(embed.resource_id, transformData())}
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
};

const mapStateToProps = (state: any) => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(SlateImage));
