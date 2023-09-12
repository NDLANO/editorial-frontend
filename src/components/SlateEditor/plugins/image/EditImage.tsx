/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { shadows } from '@ndla/core';
import { FormikValues } from 'formik';
import { useCallback, useState } from 'react';
import { ImageEmbedData } from '@ndla/types-embed';
import { IImageMetaInformationV3 } from '@ndla/types-backend/build/image-api';
import ImageEditor from '../../../../containers/ImageEditor/ImageEditor';
import { TransformData } from '../../../../util/imageEditorUtil';
import FigureInput from './FigureInput';

const StyledEditorContent = styled.div`
  box-shadow: ${shadows.levitate1};
`;

const StyledEditorWrapper = styled.div`
  background-color: white;
  max-height: 80vh;
`;

interface Props {
  embed: ImageEmbedData;
  saveEmbedUpdates: (embed: ImageEmbedData) => void;
  setEditModus: (editModus: boolean) => void;
  language: string;
  allowDecorative?: boolean;
  image: IImageMetaInformationV3;
}

export interface ImageUpdates {
  transformData: TransformData;
  align?: string;
  size?: string;
}

interface StateProps {
  alt: string;
  caption?: string;
  isDecorative?: boolean;
  border?: boolean;
  imageUpdates: ImageUpdates | undefined;
  madeChanges: boolean;
}

const EditImage = ({
  embed,
  saveEmbedUpdates,
  setEditModus,
  language,
  allowDecorative,
  image,
}: Props) => {
  const [state, setState] = useState<StateProps>({
    alt: embed.alt,
    caption: embed.caption,
    isDecorative: allowDecorative && !embed.alt.length,
    border: embed.border === 'true',
    imageUpdates: {
      transformData: {
        focalX: embed.focalX,
        focalY: embed.focalY,
        upperLeftX: embed.upperLeftX,
        upperLeftY: embed.upperLeftY,
        lowerRightX: embed.lowerRightX,
        lowerRightY: embed.lowerRightY,
      },
      align: embed.align,
      size: embed.size,
    },
    madeChanges: false,
  });

  const onUpdatedImageSettings = (transformedData: ImageUpdates) => {
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

    const newEmbed: ImageEmbedData = {
      resource: 'image',
      resourceId: embed.resourceId,
      size: state.imageUpdates?.size,
      align: state.imageUpdates?.align,
      alt: state.alt,
      caption: state.caption,
      url: embed.url,
      border: state.border !== undefined ? (state.border ? 'true' : 'false') : undefined,
    };

    if (state.imageUpdates?.transformData.focalX) {
      newEmbed.focalY = state.imageUpdates.transformData.focalY;
      newEmbed.focalX = state.imageUpdates.transformData.focalX;
    }

    if (state.imageUpdates?.transformData.upperLeftX) {
      newEmbed.upperLeftX = state.imageUpdates.transformData.upperLeftX;
      newEmbed.upperLeftY = state.imageUpdates.transformData.upperLeftY;
      newEmbed.lowerRightY = state.imageUpdates.transformData.lowerRightY;
      newEmbed.lowerRightX = state.imageUpdates.transformData.lowerRightX;
    }
    saveEmbedUpdates(newEmbed);
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

  const onBorderChecked = useCallback(() => {
    setState((prev) => ({ ...prev, border: !prev.border, madeChanges: true }));
  }, []);

  return (
    <StyledEditorWrapper contentEditable={false}>
      <StyledEditorContent>
        <ImageEditor
          image={image}
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
          allowDecorative={allowDecorative}
          onBorderChecked={onBorderChecked}
          border={state.border}
        />
      </StyledEditorContent>
    </StyledEditorWrapper>
  );
};

export default EditImage;
