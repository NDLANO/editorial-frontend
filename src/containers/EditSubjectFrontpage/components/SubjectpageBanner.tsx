/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useField, useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { ImageEmbedData } from "@ndla/types-embed";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import ImageSearchAndUploader from "../../../components/ImageSearchAndUploader";
import MetaInformation from "../../../components/MetaInformation";
import config from "../../../config";
import { fetchImage, onError, postSearchImages } from "../../../modules/image/imageApi";
import { SubjectPageFormikType } from "../../../util/subjectHelpers";

const ImageWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xsmall",
  },
});

interface Props {
  title: string;
  fieldName: "desktopBannerId" | "mobileBannerId";
}

const SubjectpageBanner = ({ title, fieldName }: Props) => {
  const { t, i18n } = useTranslation();
  const { setFieldTouched } = useFormikContext();
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const [FieldInputProps] = useField<ImageEmbedData>(fieldName);
  const { onChange } = FieldInputProps;
  const [showImageSelect, setShowImageSelect] = useState(false);
  const { values } = useFormikContext<SubjectPageFormikType>();

  useEffect(() => {
    (async () => {
      if ((!image && values[fieldName]) || (image && parseInt(image.id) !== values[fieldName])) {
        const fetchedImage = await fetchImage(values[fieldName] as number, values.language);
        setImage(fetchedImage);
      }
    })();
  }, [image, values, fieldName]);

  const onImageChange = (image: IImageMetaInformationV3) => {
    setImage(image);
    updateFormik(parseInt(image.id));
    setShowImageSelect(false);
  };

  const updateFormik = (value?: number) => {
    onChange({ target: { name: fieldName, value: value } });
    setFieldTouched(fieldName, true, false);
  };

  const onImageSelectClose = useCallback(() => {
    setShowImageSelect(false);
  }, []);

  return (
    <>
      <Heading asChild consumeCss textStyle="title.small">
        <h3>{title}</h3>
      </Heading>
      <DialogRoot open={showImageSelect} onOpenChange={(details) => setShowImageSelect(details.open)} size="large">
        {image && (
          <ImageWrapper>
            <img src={`${config.ndlaApiUrl}/image-api/raw/id/${image.id}`} alt={image.alttext.alttext} />
            <MetaInformation
              title={image.caption.caption}
              action={
                <DialogTrigger asChild>
                  <Button>{t("subjectpageForm.changeBanner")}</Button>
                </DialogTrigger>
              }
            />
          </ImageWrapper>
        )}
        {!image && (
          <DialogTrigger asChild>
            <Button>{t("subjectpageForm.addBanner")}</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("subjectpageForm.addBanner")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <ImageSearchAndUploader
              inModal
              locale={i18n.language}
              language={values.language}
              closeModal={onImageSelectClose}
              fetchImage={(id) => fetchImage(id, values.language)}
              searchImages={postSearchImages}
              onError={onError}
              onImageSelect={onImageChange}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default SubjectpageBanner;
