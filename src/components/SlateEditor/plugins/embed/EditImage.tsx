/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import FocusTrapReact from 'focus-trap-react';
import { spacingUnit, shadows } from '@ndla/core';
import { injectT, tType } from '@ndla/i18n';
import FigureInput from './FigureInput';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { Embed, FormikInputEvent } from '../../../../interfaces';

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
`;

const imageEditorWrapperStyle = css`
  background-color: white;
`;

interface Props {
  embed: Embed;
  saveEmbedUpdates: Function;
  setEditModus: Function;
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

const EditImage = ({ t, embed, saveEmbedUpdates, setEditModus }: Props & tType) => {
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
      spacingUnit -
      placeholderRect.width * (0.333 / 2)}px`;
    embedElement.style.width = `${placeholderRect.width * 1.333 - spacingUnit * 2}px`;
  }, [embedElement, placeholderElement]);

  const onUpdatedImageSettings = (transformedData: NonNullable<StateProps['imageUpdates']>) => {
    setState({
      ...state,
      imageUpdates: {
        ...state.imageUpdates,
        ...transformedData,
      },
      madeChanges: true,
    });
  };

  const onSave = () => {
    let updatedSize = state.imageUpdates?.size;

    if (state.imageUpdates?.align === 'center') {
      updatedSize = 'full';
      if (state.imageUpdates?.size.includes('hide-byline')) {
        updatedSize += '-hide-byline';
      }
    }

    saveEmbedUpdates({
      ...state,
      ...state.imageUpdates?.transformData,
      align: state.imageUpdates?.align,
      size: updatedSize,
      caption: state.caption,
      alt: state.alt,
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
              onUpdatedImageSettings={onUpdatedImageSettings}
              imageUpdates={state.imageUpdates}
            />
            <FigureInput
              caption={state.caption}
              alt={state.alt}
              madeChanges={state.madeChanges}
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

export default injectT(EditImage);
