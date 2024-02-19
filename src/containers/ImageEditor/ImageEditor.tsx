/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PercentCrop } from "react-image-crop";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, stackOrder } from "@ndla/core";
import { Crop, FocalPoint } from "@ndla/icons/editor";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import ImageAlignButton from "./ImageAlignButton";
import ImageEditorButton from "./ImageEditorButton";
import ImageSizeButton from "./ImageSizeButton";
import ImageTransformEditor from "./ImageTransformEditor";
import ShowBylineButton from "./ShowBylineButton";
import { ImageEmbed } from "../../interfaces";
import { fetchImage } from "../../modules/image/imageApi";

const StyledImageEditorMenu = styled("div")`
  color: white;
  background-color: black;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const StyledImageEditorEditMode = styled("div")`
  position: relative;
  z-index: ${stackOrder.popover};
  background-color: ${colors.brand.grey};
`;

const alignments = ["left", "center", "right"];

const sizes = ["xsmall", "small", "medium"];

const bylineOptions = ["hide", "show"];

const defaultData = {
  focalPoint: {
    "focal-x": undefined,
    "focal-y": undefined,
  },
  crop: {
    "upper-left-x": undefined,
    "upper-left-y": undefined,
    "lower-right-x": undefined,
    "lower-right-y": undefined,
    "focal-x": undefined,
    "focal-y": undefined,
  },
};

interface Props {
  embed: ImageEmbed;
  onUpdatedImageSettings: Function;
  imageUpdates:
    | {
        transformData: {
          "focal-x"?: string;
          "focal-y"?: string;
          "upper-left-x"?: string;
          "upper-left-y"?: string;
          "lower-right-x"?: string;
          "lower-right-y"?: string;
        };
        align?: string;
        size?: string;
      }
    | undefined;
  language: string;
}

type StateProp = "crop" | "focalPoint" | undefined;

const ImageEditor = ({ embed, onUpdatedImageSettings, imageUpdates, language }: Props) => {
  const { t } = useTranslation();
  const [editType, setEditType] = useState<StateProp>(undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);

  useEffect(() => {
    const getImage = async () => {
      const img = await fetchImage(embed.resource_id, language);
      setImage(img);
    };
    getImage();
  }, [embed, language]);

  const onFocalPointChange = (focalPoint: { x: number; y: number }) => {
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates?.transformData,
        "focal-x": focalPoint.x.toString(),
        "focal-y": focalPoint.y.toString(),
      },
    });
  };

  const onCropComplete = (crop: PercentCrop) => {
    const width = crop.width ?? 0;
    const height = crop.height ?? 0;
    if (width === 0) {
      setEditType(undefined);
      onUpdatedImageSettings({ transformData: defaultData.crop });
    } else {
      onUpdatedImageSettings({
        transformData: {
          "upper-left-x": crop.x.toString(),
          "upper-left-y": crop.y.toString(),
          "lower-right-x": (crop.x + width).toString(),
          "lower-right-y": (crop.y + height).toString(),
          ...defaultData.focalPoint,
        },
      });
    }
  };

  const onFieldChange = (evt: MouseEvent<HTMLButtonElement>, field: string, value: string) => {
    evt.stopPropagation();
    onUpdatedImageSettings({ [field]: value });
  };

  const onEditorTypeSet = (evt: MouseEvent<HTMLButtonElement>, type: StateProp) => {
    setEditType(type);
  };

  const onAspectSet = (evt: MouseEvent<HTMLButtonElement>, type: number | undefined) => {
    setAspect(type);
  };

  const onRemoveData = (evt: MouseEvent<HTMLButtonElement>, field: StateProp) => {
    evt.stopPropagation();
    setEditType(undefined);
    onUpdatedImageSettings({
      transformData: {
        ...imageUpdates?.transformData,
        ...defaultData[field as NonNullable<StateProp>],
      },
    });
  };

  const isModifiable = () => {
    if (image) {
      return !(image.copyright.license.license.includes("ND") || image.image.contentType.includes("svg"));
    }
  };

  const aspects = [
    {
      aspect: 3 / 4,
      label: t("form.image.aspect.3_4"),
    },
    {
      aspect: 4 / 3,
      label: t("form.image.aspect.4_3"),
    },
    {
      aspect: 16 / 9,
      label: t("form.image.aspect.16_9"),
    },
    {
      aspect: 1,
      label: t("form.image.aspect.square"),
    },
    {
      aspect: undefined,
      label: t("form.image.aspect.none"),
    },
  ];

  const imageCancelButtonNeeded =
    (editType === "focalPoint" && imageUpdates?.transformData["focal-x"]) ||
    (editType === "crop" && imageUpdates?.transformData["upper-left-x"]);

  return (
    <div>
      <StyledImageEditorEditMode>
        <div>
          <StyledImageEditorMenu>
            {alignments.map((alignment) => (
              <ImageAlignButton
                key={`align_${alignment}`}
                alignType={alignment}
                onFieldChange={onFieldChange}
                currentAlign={imageUpdates?.align}
                disabled={alignment === "left"}
              />
            ))}
          </StyledImageEditorMenu>
          {imageUpdates?.align === "left" || imageUpdates?.align === "right" ? (
            <StyledImageEditorMenu>
              {sizes.map((size) => (
                <ImageSizeButton
                  key={`size_${size}`}
                  size={size}
                  onFieldChange={onFieldChange}
                  currentSize={imageUpdates?.size}
                />
              ))}
            </StyledImageEditorMenu>
          ) : (
            ""
          )}
          {imageUpdates?.size?.startsWith("full") || imageUpdates?.size?.startsWith("medium") ? (
            <StyledImageEditorMenu>
              {bylineOptions.map((option) => (
                <ShowBylineButton
                  key={option}
                  show={option === "show"}
                  currentSize={imageUpdates.size}
                  onFieldChange={onFieldChange}
                />
              ))}
            </StyledImageEditorMenu>
          ) : (
            ""
          )}
        </div>
        <ImageTransformEditor
          onFocalPointChange={onFocalPointChange}
          onCropComplete={onCropComplete}
          embed={embed}
          transformData={imageUpdates?.transformData}
          editType={editType}
          aspect={aspect}
          language={language}
        />
        <StyledImageEditorMenu>
          {isModifiable() && (
            <ImageEditorButton
              aria-label={t("form.image.focalPoint")}
              tabIndex={-1}
              isActive={embed["focal-x"] !== undefined}
              onClick={(evt: MouseEvent<HTMLButtonElement>) => onEditorTypeSet(evt, "focalPoint")}
              title={t("form.image.focalPoint")}
            >
              <FocalPoint />
            </ImageEditorButton>
          )}
          {imageCancelButtonNeeded && (
            <ButtonV2
              aria-label={t(`imageEditor.remove.${editType}`)}
              onClick={(evt: MouseEvent<HTMLButtonElement>) => onRemoveData(evt, editType)}
              variant="stripped"
              title={t(`imageEditor.remove.${editType}`)}
            >
              {t(`imageEditor.remove.${editType}`)}
            </ButtonV2>
          )}
          {isModifiable() && (
            <ImageEditorButton
              aria-label={t("form.image.crop")}
              isActive={embed["upper-left-x"] !== undefined}
              onClick={(evt: MouseEvent<HTMLButtonElement>) => onEditorTypeSet(evt, "crop")}
              tabIndex={-1}
              title={t("form.image.crop")}
            >
              <Crop />
            </ImageEditorButton>
          )}
        </StyledImageEditorMenu>
        {editType === "crop" && (
          <StyledImageEditorMenu>
            {aspects.map(({ aspect: aspectValue, label }) => (
              <ImageEditorButton
                aria-label={label}
                key={label}
                onClick={(evt: MouseEvent<HTMLButtonElement>) => onAspectSet(evt, aspectValue)}
                tabIndex={-1}
                title={label}
              >
                {label}
              </ImageEditorButton>
            ))}
          </StyledImageEditorMenu>
        )}
      </StyledImageEditorEditMode>
    </div>
  );
};

export default ImageEditor;
