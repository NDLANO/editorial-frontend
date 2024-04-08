/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { animations, spacing, colors } from "@ndla/core";
import { UploadDropZone, TextAreaV3, Label, FieldErrorMessage } from "@ndla/forms";
import { DeleteForever } from "@ndla/icons/editor";
import { ImageMeta } from "@ndla/image-search";
import { SafeLink } from "@ndla/safelink";
import { FormControl, FormField } from "../../../components/FormField";
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

const TextFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ImageContent = () => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ImageFormikType>();
  const { values, setFieldValue } = formikContext;

  // We use the timestamp to avoid caching of the `imageFile` url in the browser
  const timestamp = new Date().getTime();
  const imgSrc = values.filepath || `${values.imageFile}?width=800&ts=${timestamp}`;
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
      {values.imageFile && (
        <>
          <SafeLink target="_blank" to={values.imageFile.toString()}>
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
      <TextFieldWrapper>
        <FormField name="caption">
          {({ field, meta }) => (
            <FormControl isInvalid={!!meta.error}>
              <Label margin="none" textStyle="label-small">
                {t("form.image.caption.label")}
              </Label>
              <TextAreaV3 placeholder={t("form.image.caption.placeholder")} {...field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FormControl>
          )}
        </FormField>
        <FormField name="alttext">
          {({ field, meta }) => (
            <FormControl isInvalid={!!meta.error}>
              <Label textStyle="label-small" margin="none">
                {t("form.image.alt.label")}
              </Label>
              <TextAreaV3 placeholder={t("form.image.alt.placeholder")} {...field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FormControl>
          )}
        </FormField>
      </TextFieldWrapper>
    </>
  );
};

export default ImageContent;
