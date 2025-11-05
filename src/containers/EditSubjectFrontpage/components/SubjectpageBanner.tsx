/**
 * Copyright (c) 2025-present, NDLA.
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
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { ImageEmbedData } from "@ndla/types-embed";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { ImageSearch } from "../../../components/ImageSearch";
import MetaInformation from "../../../components/MetaInformation";
import config from "../../../config";
import { fetchImage } from "../../../modules/image/imageApi";
import { SubjectPageFormikType } from "../../../util/subjectHelpers";
import CreateImage from "../../ImageUploader/CreateImage";

const ImageWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xsmall",
  },
});

const StyledTabsContent = styled(TabsContent, {
  base: {
    "& > *": {
      width: "100%",
    },
  },
});

interface Props {
  title: string;
  fieldName: "desktopBannerId" | "mobileBannerId";
}

const SubjectpageBanner = ({ title, fieldName }: Props) => {
  const { t } = useTranslation();
  const { setFieldTouched } = useFormikContext();
  const [image, setImage] = useState<ImageMetaInformationV3DTO | undefined>(undefined);
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

  const onImageChange = (image: ImageMetaInformationV3DTO) => {
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
    <div>
      <Heading asChild consumeCss textStyle="title.small">
        <h3>{title}</h3>
      </Heading>
      <DialogRoot open={showImageSelect} onOpenChange={(details) => setShowImageSelect(details.open)} size="large">
        {!!image && (
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
            <TabsRoot defaultValue="image" translations={{ listLabel: t("form.visualElement.image") }}>
              <TabsList>
                <TabsTrigger value="image">{t("form.visualElement.image")}</TabsTrigger>
                <TabsTrigger value="upload">{t("form.visualElement.imageUpload")}</TabsTrigger>
                <TabsIndicator />
              </TabsList>
              <StyledTabsContent value="image">
                <ImageSearch onImageSelect={onImageChange} locale={values.language} />
              </StyledTabsContent>
              <StyledTabsContent value="upload">
                <CreateImage
                  inDialog={true}
                  editingArticle
                  closeDialog={onImageSelectClose}
                  onImageCreated={onImageChange}
                />
              </StyledTabsContent>
            </TabsRoot>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </div>
  );
};

export default SubjectpageBanner;
