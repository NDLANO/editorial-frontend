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
import { ImageEditFormValues } from "../../components/SlateEditor/plugins/embed/EditImage";
import config from "../../config";

interface Props {
  language: string;
  onCropComplete: (crop: PercentCrop) => void;
  aspect?: number;
}

const getCrop = (data: ImageEditFormValues): Crop | undefined => {
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

const ImageCropEdit = ({ language, onCropComplete, aspect }: Props) => {
  const { values } = useFormikContext<ImageEditFormValues>();
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${values.resourceId}?language=${language}`;
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
