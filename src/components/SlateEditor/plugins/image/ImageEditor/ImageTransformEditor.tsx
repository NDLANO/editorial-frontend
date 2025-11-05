/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { PercentCrop } from "react-image-crop";
import { styled } from "@ndla/styled-system/jsx";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import ImageCropEdit from "./ImageCropEdit";
import ImageFocalPointEdit from "./ImageFocalPointEdit";
import { getSrcSets } from "../imageEditorUtil";
import { ImageEmbedFormValues } from "../types";

const StyledImg = styled("img", {
  base: {
    minWidth: ["-webkit-fill-available", "-moz-available"],
  },
});

interface Props {
  language: string;
  editType?: string;
  onFocalPointChange: (focalPoint: { x: number; y: number }) => void;
  onCropComplete: (crop: PercentCrop) => void;
  aspect?: number;
  image: ImageMetaInformationV3DTO;
}

const ImageTransformEditor = ({ language, editType, image, onFocalPointChange, onCropComplete, aspect }: Props) => {
  const { values } = useFormikContext<ImageEmbedFormValues>();
  switch (editType) {
    case "focalPoint":
      return <ImageFocalPointEdit language={language} onFocalPointChange={onFocalPointChange} image={image} />;
    case "crop":
      return <ImageCropEdit language={language} onCropComplete={onCropComplete} aspect={aspect} image={image} />;
    default:
      return (
        <figure>
          <StyledImg alt={values.alt} srcSet={getSrcSets(image.id, values, language)} />
        </figure>
      );
  }
};

export default ImageTransformEditor;
