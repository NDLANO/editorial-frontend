/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useState } from "react";
import ReactCrop, { Crop, PercentCrop } from "react-image-crop";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { ImageEmbedFormValues } from "../../components/SlateEditor/plugins/image/ImageEmbedForm";
import config from "../../config";

interface Props {
  language: string;
  image: IImageMetaInformationV3DTO;
  onCropComplete: (crop: PercentCrop) => void;
  aspect?: number;
}

const getCrop = (data: ImageEmbedFormValues): Crop | undefined => {
  if (data.upperLeftX && data.upperLeftY && data.lowerRightX && data.lowerRightY) {
    const upperLeftX = parseInt(data.upperLeftX);
    const upperLeftY = parseInt(data.upperLeftY);
    return {
      unit: "%",
      x: upperLeftX,
      y: upperLeftY,
      width: parseInt(data.lowerRightX) - upperLeftX,
      height: parseInt(data.lowerRightY) - upperLeftY,
    };
  }
};

const ImageCropEdit = ({ language, onCropComplete, aspect, image }: Props) => {
  const { values } = useFormikContext<ImageEmbedFormValues>();
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${image.id}?language=${language}`;
  const [crop, setCrop] = useState<Crop | undefined>(getCrop(values));

  const onComplete = (crop: PercentCrop) => {
    if (crop.width === 0 && crop.height === 0) {
      return;
    }
    onCropComplete(crop);
  };

  return (
    <ReactCrop
      style={{ minWidth: "100%" }}
      onComplete={(_, crop) => onComplete(crop)}
      crop={crop}
      aspect={aspect}
      onChange={(_, crop) => setCrop(crop)}
      ruleOfThirds
    >
      <img src={src} alt="" />
    </ReactCrop>
  );
};

export default ImageCropEdit;
