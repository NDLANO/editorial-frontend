/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { animations, spacing, colors } from "@ndla/core";
import { UploadDropZone, TextArea } from "@ndla/forms";
import { DeleteForever } from "@ndla/icons/editor";
import { ImageMeta } from "@ndla/image-search";
import SafeLink from "@ndla/safelink";
import FormikField from "../../../components/FormikField";
import { TitleField } from "../../FormikForm";
import { ImageFormikType } from "../imageTransformers";

const StyledImage = styled.img`
  margin: ${spacing.normal} 0;
  border: 1px solid ${colors.brand.greyLight};
  ${animations.fadeInBottom()}
`;

const StyledDeleteButtonContainer = styled.div`
  position: absolute;
  right: -${spacing.large};
  transform: translateY(${spacing.normal});
  display: flex;
  flex-direction: row;
`;

const ImageContent = () => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ImageFormikType>();
  const { values, errors, setFieldValue } = formikContext;

  // We use the timestamp to avoid caching of the `imageFile` url in the browser
  const timestamp = new Date().getTime();
  const imgSrc = values.filepath || `${values.imageFile}?width=600&ts=${timestamp}`;
  return (
    <>
      <TitleField hideToolbar />
      {!values.imageFile && (
        <UploadDropZone
          name="imageFile"
          allowedFiles={["image/gif", "image/png", "image/jpeg", "image/jpg", "image/svg+xml"]}
          onAddedFiles={(_, evt) => {
            const target = evt.target;
            setFieldValue("filepath", target.files?.[0] ? URL.createObjectURL(target.files[0]) : undefined);
            Promise.resolve(
              createImageBitmap(target.files?.[0] as Blob).then((image) => {
                setFieldValue("imageDimensions", image);
              }),
            );
            setFieldValue("imageFile", target.files?.[0]);
            setFieldValue("contentType", target.files?.[0]?.type);
            setFieldValue("fileSize", target.files?.[0]?.size);
          }}
          ariaLabel={t("form.image.dragdrop.ariaLabel")}
        >
          <strong>{t("form.image.dragdrop.main")}</strong>
          {t("form.image.dragdrop.sub")}
        </UploadDropZone>
      )}
      {values.imageFile && (
        <StyledDeleteButtonContainer>
          <IconButtonV2
            aria-label={t("form.image.removeImage")}
            variant="ghost"
            colorTheme="danger"
            onClick={() => setFieldValue("imageFile", undefined)}
            title={t("form.image.removeImage")}
          >
            <DeleteForever />
          </IconButtonV2>
        </StyledDeleteButtonContainer>
      )}
      {values.imageFile && typeof values.imageFile === "string" && (
        <>
          <SafeLink target="_blank" to={values.imageFile}>
            <StyledImage src={imgSrc} alt="" />
          </SafeLink>
          <ImageMeta
            contentType={values.contentType ?? ""}
            fileSize={values.fileSize ?? 0}
            imageDimensions={values.imageDimensions}
          />
        </>
      )}
      <FormikField name="imageFile.size" showError={true}>
        {(_) => <></>}
      </FormikField>
      <FormikField name="caption" showError={false}>
        {({ field }: FieldProps) => (
          <TextArea
            placeholder={t("form.image.caption.placeholder")}
            label={t("form.image.caption.label")}
            type="text"
            warningText={errors["caption"]}
            {...field}
          />
        )}
      </FormikField>
      <FormikField name="alttext" showError={false}>
        {({ field }: FieldProps) => (
          <TextArea
            placeholder={t("form.image.alt.placeholder")}
            label={t("form.image.alt.label")}
            type="text"
            warningText={errors["alttext"]}
            {...field}
          />
        )}
      </FormikField>
    </>
  );
};

export default ImageContent;
