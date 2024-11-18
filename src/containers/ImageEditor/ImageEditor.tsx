/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PercentCrop } from "react-image-crop";
import styled from "@emotion/styled";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { colors, spacing } from "@ndla/core";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copyright,
  Crop,
  FocalPoint,
  ImageSmall,
  ImageXsmall,
  ImageXxSmall,
  PublicDomain,
} from "@ndla/icons/editor";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import ImageTransformEditor from "./ImageTransformEditor";
import { FormField } from "../../components/FormField";
import { ImageEmbedFormValues } from "../../components/SlateEditor/plugins/image/ImageEmbedForm";

const StyledImageEditorMenu = styled.div`
  color: white;
  background-color: black;
  padding: ${spacing.small};
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledImageEditorEditMode = styled.div`
  position: relative;
  background-color: ${colors.brand.grey};
`;

const StyledToggleGroupItem = styled(ToggleGroupItem)`
  all: unset;
  transition: color 200ms ease;
  color: ${colors.brand.grey};
  display: flex;
  align-items: center;
  justify-content: center;
  &:focus-visible,
  &:hover,
  &[data-state="on"] {
    cursor: pointer;
    color: ${colors.white};
  }
  &[disabled] {
    color: ${colors.brand.primary};
    cursor: not-allowed;
  }
`;

const alignments = [
  { value: "left", children: <AlignLeft /> },
  { value: "center", children: <AlignCenter /> },
  { value: "right", children: <AlignRight /> },
] as const;

const sizes = [
  { value: "xsmall", children: <ImageXxSmall /> },
  { value: "small", children: <ImageXsmall /> },
  { value: "medium", children: <ImageSmall /> },
] as const;

const bylineOptions = [
  { value: "hide", children: <PublicDomain /> },
  { value: "show", children: <Copyright /> },
] as const;

const defaultData: Record<string, Partial<ImageEmbedFormValues>> = {
  focalPoint: {
    focalX: undefined,
    focalY: undefined,
  },
  crop: {
    upperLeftX: undefined,
    upperLeftY: undefined,
    lowerRightX: undefined,
    lowerRightY: undefined,
    focalX: undefined,
    focalY: undefined,
  },
};

interface Props {
  language: string;
  image: IImageMetaInformationV3;
}

const StyledToggleGroup = styled(ToggleGroup)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

type StateProp = "crop" | "focalPoint" | "none";

const ImageEditor = ({ language, image }: Props) => {
  const { t } = useTranslation();
  const { values, setValues, setFieldValue } = useFormikContext<ImageEmbedFormValues>();
  const [editType, setEditType] = useState<StateProp>("none");
  const [aspect, setAspect] = useState<string>("none");

  const aspects = [
    {
      aspect: "0.75",
      label: t("form.image.aspect.3_4"),
    },
    {
      aspect: (4 / 3).toString(),
      label: t("form.image.aspect.4_3"),
    },
    {
      aspect: (16 / 9).toString(),
      label: t("form.image.aspect.16_9"),
    },
    {
      aspect: "1",
      label: t("form.image.aspect.square"),
    },
    {
      aspect: "none",
      label: t("form.image.aspect.none"),
    },
  ];

  const onCancelMode = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setValues({ ...values, ...defaultData[editType] });
      setEditType("none");
    },
    [editType, setValues, values],
  );

  const onFocalPointChange = useCallback(
    (focalPoint: { x: number; y: number }) => {
      setValues({ ...values, focalX: focalPoint.x.toString(), focalY: focalPoint.y.toString() });
    },
    [setValues, values],
  );

  const onCropComplete = useCallback(
    (crop: PercentCrop) => {
      const width = crop.width ?? 0;
      const height = crop.height ?? 0;
      if (width === 0) {
        setEditType("none");
        setValues({ ...values, ...defaultData.crop });
      } else {
        setValues({
          ...values,
          upperLeftX: crop.x.toString(),
          upperLeftY: crop.y.toString(),
          lowerRightX: (crop.x + width).toString(),
          lowerRightY: (crop.y + height).toString(),
          ...defaultData.focalPoint,
        });
      }
    },
    [setValues, values],
  );

  const isModifiable = useMemo(() => {
    if (image) {
      return !(image.copyright.license.license.includes("ND") || image.image.contentType.includes("svg"));
    }
  }, [image]);

  const imageCancelButtonNeeded = useMemo(() => {
    return (editType === "focalPoint" && !!values.focalX) || (editType === "crop" && !!values.upperLeftX);
  }, [editType, values.focalX, values.upperLeftX]);

  return (
    <StyledImageEditorEditMode>
      <StyledImageEditorMenu>
        <FormField name="align">
          {({ field, helpers }) => (
            <StyledToggleGroup
              type="single"
              value={field.value}
              onValueChange={(val) => {
                helpers.setValue(val);
                if (val === "center") {
                  setFieldValue("size", "full");
                }
              }}
            >
              {alignments.map(({ value, children }) => (
                <StyledToggleGroupItem
                  key={value}
                  value={value}
                  disabled={value === "left"}
                  aria-label={t(`form.image.alignment.${value}`)}
                  title={t(`form.image.alignment.${value}`)}
                >
                  {children}
                </StyledToggleGroupItem>
              ))}
            </StyledToggleGroup>
          )}
        </FormField>
      </StyledImageEditorMenu>
      {values.align === "left" || values.align === "right" ? (
        <StyledImageEditorMenu>
          <FormField name="size">
            {({ field, helpers }) => (
              <StyledToggleGroup
                type="single"
                value={field.value}
                onValueChange={(val) => {
                  helpers.setValue(val);
                }}
              >
                {sizes.map(({ value, children }) => (
                  <StyledToggleGroupItem
                    key={value}
                    value={value}
                    aria-label={t(`form.image.sizes.${value}`)}
                    title={t(`form.image.sizes.${value}`)}
                  >
                    {children}
                  </StyledToggleGroupItem>
                ))}
              </StyledToggleGroup>
            )}
          </FormField>
        </StyledImageEditorMenu>
      ) : null}
      <ImageTransformEditor
        language={language}
        editType={editType}
        aspect={aspect === "none" ? undefined : parseFloat(aspect)}
        image={image}
        onCropComplete={onCropComplete}
        onFocalPointChange={onFocalPointChange}
      />
      <StyledImageEditorMenu>
        <StyledToggleGroup type="single" value={editType} onValueChange={(val) => setEditType(val as StateProp)}>
          {isModifiable && (
            <StyledToggleGroupItem
              value="focalPoint"
              aria-label={t("form.image.focalPoint")}
              title={t("form.image.focalPoint")}
            >
              <FocalPoint />
            </StyledToggleGroupItem>
          )}
          {imageCancelButtonNeeded && (
            <StyledToggleGroupItem value="none" onClick={onCancelMode}>
              {t(`imageEditor.remove.${editType}`)}
            </StyledToggleGroupItem>
          )}
          {isModifiable && (
            <StyledToggleGroupItem value="crop" aria-label={t("form.image.crop")} title={t("form.image.crop")}>
              <Crop />
            </StyledToggleGroupItem>
          )}
        </StyledToggleGroup>
      </StyledImageEditorMenu>
      {editType === "crop" && (
        <StyledImageEditorMenu>
          <StyledToggleGroup type="single" value={aspect} onValueChange={setAspect}>
            {aspects.map(({ label, aspect }) => (
              <StyledToggleGroupItem key={label} value={aspect} aria-label={label} title={label}>
                {label}
              </StyledToggleGroupItem>
            ))}
          </StyledToggleGroup>
        </StyledImageEditorMenu>
      )}
    </StyledImageEditorEditMode>
  );
};

export default ImageEditor;
