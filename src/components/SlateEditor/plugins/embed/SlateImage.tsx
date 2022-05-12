/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState, MouseEvent } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { RenderElementProps } from 'slate-react';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
//@ts-ignore
import { parseMarkdown } from '@ndla/util';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import FigureButtons from './FigureButtons';
import EditImage from './EditImage';
import { ImageEmbed } from '../../../../interfaces';

const buttonStyle = css`
  min-width: -webkit-fill-available;
  min-width: -moz-available;
  &:focus img {
    box-shadow: rgb(32, 88, 143) 0 0 0 2px;
  }
`;

interface Props {
  active?: boolean;
  attributes: RenderElementProps['attributes'];
  embed: ImageEmbed;
  figureClass?: { className: string };
  isSelectedForCopy?: boolean;
  language: string;
  onRemoveClick: (event: MouseEvent) => void;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  visualElement: boolean;
  children: ReactNode;
}

const StyledDiv = styled.div<{ embed: ImageEmbed }>`
  ${props => (!props.embed.alt ? 'border: 2px solid rgba(209,55,46,0.3);' : '')}
  z-index: 1;
`;

const SlateImage = ({
  active,
  attributes,
  embed,
  figureClass,
  isSelectedForCopy,
  language,
  onRemoveClick,
  saveEmbedUpdates,
  visualElement,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);

  const constructFigureClassName = () => {
    const isFullWidth = embed.align === 'center';
    const size = embed.size && ['small', 'xsmall'].includes(embed.size) ? `-${embed.size}` : '';
    const align = embed.align && ['left', 'right'].includes(embed.align) ? `-${embed.align}` : '';

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

  return (
    <StyledDiv
      {...attributes}
      draggable={!visualElement && !editMode}
      className={constructFigureClassName()}
      embed={embed}>
      <FigureButtons
        tooltip={t('form.image.removeImage')}
        onRemoveClick={onRemoveClick}
        embed={embed}
        figureType="image"
        language={language}
      />
      {editMode && (
        <EditImage embed={embed} saveEmbedUpdates={saveEmbedUpdates} setEditModus={setEditMode} />
      )}
      {!(visualElement && editMode) && (
        <Button
          contentEditable={false}
          css={buttonStyle}
          stripped
          data-label={t('imageEditor.editImage')}
          onClick={evt => {
            evt.preventDefault();
            evt.stopPropagation();
            setEditMode(true);
          }}>
          <figure {...figureClass}>
            <img
              alt={embed.alt}
              sizes="(min-width: 1024px) 180px, (min-width: 768px) 180px, 100vw"
              srcSet={getSrcSets(embed.resource_id, transformData())}
              css={css`
                box-shadow: ${showCopyOutline ? 'rgb(32, 88, 143) 0 0 0 2px' : 'none'};
              `}
            />
            <figcaption className="c-figure__caption" contentEditable={false}>
              <div
                className="c-figure__info"
                css={css`
                  p {
                    margin: 0;
                  }
                `}>
                {embed.caption && parseMarkdown(embed.caption)}
              </div>
            </figcaption>
          </figure>
        </Button>
      )}
      {children}
    </StyledDiv>
  );
};

export default SlateImage;
