/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { shadows } from '@ndla/core';
import { Modal } from '@ndla/modal';
import { FormikValues } from 'formik';
import { useState } from 'react';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { ImageEmbed } from '../../../../interfaces';
import { TransformData } from '../../../../util/imageEditorUtil';
import FigureInput from './FigureInput';

const StyledEditorContent = styled.div`
  box-shadow: ${shadows.levitate1};
`;

const StyledEditorWrapper = styled.div`
  background-color: white;
  max-height: 80vh;
`;

const StyledModal = styled(Modal)`
  padding: 0;
`;

interface Props {
  embed: ImageEmbed;
  saveEmbedUpdates: Function;
  setEditModus: Function;
  language: string;
}

interface StateProps {
  alt: string;
  caption?: string;
  isDecorative?: boolean;

  imageUpdates:
    | {
        transformData: TransformData;
        align?: string;
        size?: string;
      }
    | undefined;
  madeChanges: boolean;
}

const EditImage = ({ embed, saveEmbedUpdates, setEditModus, language }: Props) => {
  const [state, setState] = useState<StateProps>({
    alt: embed.alt,
    caption: embed.caption,
    isDecorative: embed['is-decorative'] === 'true',
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
      'is-decorative': state.isDecorative?.toString(),
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
  const handleCheck = (isDecorative: boolean) => {
    setState({
      ...state,
      isDecorative: isDecorative,
      alt: '',
      madeChanges: true,
    });
  };

  return (
    <StyledModal onClose={() => setEditModus(false)} isOpen controlled size="normal">
      {() => (
        <StyledEditorWrapper contentEditable={false}>
          <StyledEditorContent>
            <ImageEditor
              embed={embed}
              onUpdatedImageSettings={onUpdatedImageSettings}
              imageUpdates={state.imageUpdates}
              language={language}
            />
            <FigureInput
              caption={state.caption}
              alt={state.alt}
              madeChanges={state.madeChanges}
              onChange={onChange}
              onAbort={onAbort}
              onSave={onSave}
              isDecorative={state.isDecorative}
              handleCheck={handleCheck}
            />
          </StyledEditorContent>
        </StyledEditorWrapper>
      )}
    </StyledModal>
  );
};

export default EditImage;
