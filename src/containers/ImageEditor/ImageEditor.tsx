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
import { AlignCenter, AlignLeft, AlignRight, CropLine, FocusMode } from "@ndla/icons";
import { Button, IconButton, ToggleGroupItem, ToggleGroupRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import ImageTransformEditor from "./ImageTransformEditor";
import { FormField } from "../../components/FormField";
import { ImageEmbedFormValues } from "../../components/SlateEditor/plugins/image/ImageEmbedForm";

const StyledImageEditorMenu = styled("div", {
  base: {
    padding: "xsmall",
    display: "flex",
    justifyContent: "space-between",
    // TODO: should update this color once design is ready
    backgroundColor: "text.default",
  },
});

const StyledImageEditorEditMode = styled("div", {
  base: {
    // TODO: should update this color once design is ready
    backgroundColor: "text.default",
  },
});

const StyledToggleGroupRoot = styled(ToggleGroupRoot, {
  base: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
});

const alignments = [
  { value: "left", children: <AlignLeft /> },
  { value: "center", children: <AlignCenter /> },
  { value: "right", children: <AlignRight /> },
] as const;

const sizes = [
  { value: "xsmall", name: "xs" },
  { value: "small", name: "s" },
  { value: "medium", name: "m" },
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
  image: IImageMetaInformationV3DTO;
}

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
      setAspect("none");
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
            <StyledToggleGroupRoot
              value={[field.value]}
              onValueChange={(details) => {
                const val = details.value[0] ?? "";
                helpers.setValue(val);
                if (val !== "right" && val !== "left") {
                  setFieldValue("size", "full");
                }
              }}
            >
              {alignments.map(({ value, children }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  disabled={value === "left"}
                  aria-label={t(`form.image.alignment.${value}`)}
                  title={t(`form.image.alignment.${value}`)}
                  asChild
                >
                  <IconButton variant="secondary" size="small">
                    {children}
                  </IconButton>
                </ToggleGroupItem>
              ))}
            </StyledToggleGroupRoot>
          )}
        </FormField>
      </StyledImageEditorMenu>
      {values.align === "left" || values.align === "right" ? (
        <StyledImageEditorMenu>
          <FormField name="size">
            {({ field, helpers }) => (
              <StyledToggleGroupRoot
                value={[field.value]}
                onValueChange={(details) => {
                  helpers.setValue(details.value[0]);
                }}
              >
                {sizes.map(({ value, name }) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    aria-label={t(`form.image.sizes.${value}`)}
                    title={t(`form.image.sizes.${value}`)}
                    asChild
                  >
                    <IconButton variant="secondary" size="small">
                      {name}
                    </IconButton>
                  </ToggleGroupItem>
                ))}
              </StyledToggleGroupRoot>
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
        <StyledToggleGroupRoot
          value={[editType]}
          onValueChange={(details) => setEditType(details.value[0] as StateProp)}
        >
          {!!isModifiable && (
            <ToggleGroupItem
              value="focalPoint"
              aria-label={t("form.image.focalPoint")}
              title={t("form.image.focalPoint")}
              asChild
            >
              <IconButton size="small" variant="secondary">
                <FocusMode />
              </IconButton>
            </ToggleGroupItem>
          )}
          {!!imageCancelButtonNeeded && (
            <Button variant="danger" size="small" onClick={onCancelMode}>
              {t(`imageEditor.remove.${editType}`)}
            </Button>
          )}
          {!!isModifiable && (
            <ToggleGroupItem value="crop" aria-label={t("form.image.crop")} title={t("form.image.crop")} asChild>
              <IconButton variant="secondary" size="small">
                <CropLine />
              </IconButton>
            </ToggleGroupItem>
          )}
        </StyledToggleGroupRoot>
      </StyledImageEditorMenu>
      {editType === "crop" && (
        <StyledImageEditorMenu>
          <StyledToggleGroupRoot value={[aspect]} onValueChange={(details) => setAspect(details.value[0])}>
            {aspects.map(({ label, aspect }) => (
              <ToggleGroupItem key={label} value={aspect} aria-label={label} title={label} asChild>
                <Button variant="secondary" size="small">
                  {label}
                </Button>
              </ToggleGroupItem>
            ))}
          </StyledToggleGroupRoot>
        </StyledImageEditorMenu>
      )}
    </StyledImageEditorEditMode>
  );
};

export default ImageEditor;
