/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import { shadows } from '@ndla/core';
import Modal from '@ndla/modal';
import { FormikValues } from 'formik';
import { Portal } from '../../../Portal';
import FigureInput from './FigureInput';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { ImageEmbed } from '../../../../interfaces';

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
`;

const imageEditorWrapperStyle = css`
  background-color: white;
  max-height: 80vh;
`;

const StyledModal = styled(Modal)`
  [data-reach-dialog-content] {
    padding: 0;
  }
`;

interface Props {
  embed: ImageEmbed;
  saveEmbedUpdates: Function;
  setEditModus: Function;
}

interface StateProps {
  alt: string;
  caption?: string;
  imageUpdates:
    | {
        transformData: {
          'focal-x'?: string;
          'focal-y'?: string;
          'upper-left-x'?: string;
          'upper-left-y'?: string;
          'lower-right-x'?: string;
          'lower-right-y'?: string;
        };
        align?: string;
        size?: string;
      }
    | undefined;
  madeChanges: boolean;
}

const EditImage = ({ embed, saveEmbedUpdates, setEditModus }: Props) => {
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
      if (state.imageUpdates?.size?.includes('hide-byline')) {
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

  const onChange = (e: FormikValues) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      madeChanges: true,
    });
  };

  return (
    <Portal isOpened key="imagePortal">
      <StyledModal
        onClose={() => setEditModus(false)}
        isOpen
        controllable
        size="regular"
        backgroundColor="white">
        {() => (
          <>
            <div contentEditable={false} css={imageEditorWrapperStyle}>
              <div css={editorContentCSS}>
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
            </div>
          </>
        )}
      </StyledModal>
    </Portal>
  );
};

export default EditImage;
