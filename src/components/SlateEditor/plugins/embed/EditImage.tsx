/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/core';
import FocusTrapReact from 'focus-trap-react';
import { spacing, shadows } from '@ndla/core';
import FigureInput from './FigureInput';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { Embed, FormikInputEvent, TranslateType } from '../../../../interfaces';

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
`;

const imageEditorWrapperStyle = css`
  background-color: white;
`;

interface Props {
  t: TranslateType;
  embed: Embed;
  saveEmbedUpdates: Function;
  setEditModus: Function;
  submitted: boolean;
}

interface StateProps {
  alt: string;
  caption: string;
  imageUpdates:
    | {
        transformData: {
          'focal-x': string;
          'focal-y': string;
          'upper-left-x': string;
          'upper-left-y': string;
          'lower-right-x': string;
          'lower-right-y': string;
        };
        align: string;
        size: string;
      }
    | undefined;
  madeChanges: boolean;
}

const EditImage: React.FC<Props> = ({
  t,
  embed,
  saveEmbedUpdates,
  setEditModus,
  submitted,
}) => {
  let placeholderElement: any = React.createRef();
  let embedElement: any = React.createRef();
  const [state, setState] = useState<StateProps>({
    alt: embed.alt,
    caption: embed.caption,
    imageUpdates: {
      transformData: {
        'focal-x': embed['focal-x'],
        'focal-y': embed['focal-y'],
        'upper-left-x': embed['upper-left-x'],
        'upper-left-y': embed['upper-left-y'],
        'lower-right-x': embed['lower-right-x'],
        'lower-right-y': embed['lower-right-y'],
      },
      align: embed.align,
      size: embed.size,
    },
    madeChanges: false,
  });

  useEffect(() => {
    const bodyRect = document.body.getBoundingClientRect();
    // Use contenteditable as reference to fetch embed size when previewing.
    const placeholderRect = placeholderElement
      .closest('div[contenteditable="false"]')
      .getBoundingClientRect();

    embedElement.style.position = 'absolute';
    embedElement.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedElement.style.left = `${placeholderRect.left +
      spacing.spacingUnit -
      placeholderRect.width * (0.333 / 2)}px`;
    embedElement.style.width = `${placeholderRect.width * 1.333 -
      spacing.spacingUnit * 2}px`;
  }, []);

  const onUpdatedImageSettings = (imageUpdates2: any) => {
    setState({
      ...state,
      imageUpdates: {
        ...imageUpdates,
        ...imageUpdates2,
      },
      madeChanges: true,
    });
  };

  const onSave = () => {
    saveEmbedUpdates({
      ...state,
      ...imageUpdates?.transformData,
      align: imageUpdates?.align,
      size: imageUpdates?.size,
      caption,
      alt,
    });

    setEditModus(false);
  };

  const onAbort = () => {
    setState({
      ...state,
      imageUpdates: undefined,
    });
    setEditModus(false);
  };

  const onChange = (e: FormikInputEvent) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      madeChanges: true,
    });
  };

  const { caption, madeChanges, alt, imageUpdates } = state;
  return (
    <div
      css={imageEditorWrapperStyle}
      ref={placeholderEl => {
        placeholderElement = placeholderEl;
      }}>
      <Overlay />
      <Portal isOpened>
        <FocusTrapReact
          focusTrapOptions={{
            onDeactivate: () => {
              setEditModus(false);
            },
            clickOutsideDeactivates: true,
            escapeDeactivates: true,
          }}>
          <div
            css={editorContentCSS}
            ref={embedEl => {
              embedElement = embedEl;
            }}>
            <ImageEditor
              embed={embed}
              toggleEditModus={setEditModus}
              onUpdatedImageSettings={onUpdatedImageSettings}
              imageUpdates={imageUpdates}
            />
            <FigureInput
              t={t}
              caption={caption}
              alt={alt}
              submitted={submitted}
              madeChanges={madeChanges}
              onChange={onChange}
              onAbort={onAbort}
              onSave={onSave}
            />
          </div>
        </FocusTrapReact>
      </Portal>
    </div>
  );
};

export default EditImage;
