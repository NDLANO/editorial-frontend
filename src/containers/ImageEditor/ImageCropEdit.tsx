/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import ReactCrop, { Crop, PercentCrop } from "react-image-crop";
import config from "../../config";
import { ImageEmbed } from "../../interfaces";

interface Props {
  embed: ImageEmbed;
  language: string;
  onCropComplete: (crop: PercentCrop) => void;
  transformData?: {
    "focal-x"?: string;
    "focal-y"?: string;
    "upper-left-x"?: string;
    "upper-left-y"?: string;
    "lower-right-x"?: string;
    "lower-right-y"?: string;
  };
  aspect?: number;
}

const ImageCropEdit = ({ embed, language, onCropComplete, transformData, aspect }: Props) => {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}?language=${language}`;
  const [crop, setCrop] = useState<Crop | undefined>(
    transformData &&
      !!transformData["upper-left-x"] &&
      !!transformData["upper-left-y"] &&
      !!transformData["lower-right-x"] &&
      !!transformData["lower-right-y"]
      ? {
          unit: "%",
          x: parseInt(transformData!["upper-left-x"]),
          y: parseInt(transformData!["upper-left-y"]),
          width: parseInt(transformData!["lower-right-x"]) - parseInt(transformData!["upper-left-x"]),
          height: parseInt(transformData!["lower-right-y"]) - parseInt(transformData!["upper-left-y"]),
        }
      : undefined,
  );

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
