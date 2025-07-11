/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHandlers, useFormikContext } from "formik";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldsetLegend,
  FieldsetRoot,
  MessageBox,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  IImageMetaInformationV3DTO,
  INewImageMetaInformationV2DTO,
  IUpdateImageMetaInformationDTO,
} from "@ndla/types-backend/image-api";
import MetaImageField from "./components/MetaImageField";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { ImageSearch } from "../../components/ImageSearch";
import { draftLicensesToImageLicenses } from "../../modules/draft/draftApiUtils";
import { useLicenses } from "../../modules/draft/draftQueries";
import { postImage, updateImage, fetchImage } from "../../modules/image/imageApi";
import ImageForm from "../ImageUploader/components/ImageForm";

const StyledButton = styled(Button, {
  base: {
    width: "fit-content",
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
  metaImageId: string;
  onChange: FormikHandlers["handleChange"];
  name: string;
  onImageLoad?: (width: number, height: number) => void;
  showRemoveButton: boolean;
  showCheckbox: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
  language?: string;
  podcastFriendly?: boolean;
  disableAltEditing?: boolean;
}

const MetaImageSearch = ({
  name,
  metaImageId,
  showRemoveButton,
  onChange,
  onImageLoad,
  showCheckbox,
  checkboxAction,
  language,
  podcastFriendly,
  disableAltEditing,
}: Props) => {
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [image, setImage] = useState<IImageMetaInformationV3DTO | undefined>(undefined);

  const { t, i18n } = useTranslation();
  const { setFieldValue } = useFormikContext();
  const { data: licenses } = useLicenses({ placeholderData: [] });

  const imageLicenses = draftLicensesToImageLicenses(licenses ?? []);

  useEffect(() => {
    if (metaImageId) {
      fetchImage(parseInt(metaImageId), language).then((image) => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [metaImageId, language]);

  const onChangeFormik = (id: string | null) => {
    onChange({
      target: {
        name,
        value: id,
      },
    });
  };
  const onImageSelectClose = useCallback(() => setShowImageSelect(false), []);

  const onImageSet = (image: IImageMetaInformationV3DTO) => {
    setShowImageSelect(false);
    setImage(image);
    setFieldValue(name, image.id);
    setFieldValue("metaImageAlt", disableAltEditing ? "" : image.alttext.alttext.trim(), true);
  };

  const onImageRemove = () => {
    setShowImageSelect(false);
    setImage(undefined);
    onChangeFormik(null);
  };

  const convertImageMeta = (image: IUpdateImageMetaInformationDTO): INewImageMetaInformationV2DTO => {
    if (
      image.title === undefined ||
      image.copyright === undefined ||
      image.alttext === null ||
      image.tags === undefined ||
      image.caption === undefined
    ) {
      throw new Error("Invalid image metadata, this is probably a form validation bug");
    }

    return {
      ...image,
      title: image.title,
      alttext: image.alttext,
      tags: image.tags,
      caption: image.caption,
      copyright: image.copyright,
    };
  };

  const onImageUpdate = async (image: IUpdateImageMetaInformationDTO, file: string | Blob | undefined, id?: number) => {
    if (!id && file instanceof Blob) {
      const newImage = convertImageMeta(image);
      const createdImage = await postImage(newImage, file);
      onImageSet(createdImage);
    } else if (id) {
      const updatedImage = await updateImage(id, image);
      onImageSet(updatedImage);
    } else {
      throw new Error("Invalid state when creating / updating image");
    }
  };

  return (
    <FieldsetRoot>
      <FieldsetLegend textStyle="label.medium">{t("form.metaImage.add")}</FieldsetLegend>
      <DialogRoot open={showImageSelect} onOpenChange={(details) => setShowImageSelect(details.open)} size="large">
        {!image && (
          <DialogTrigger asChild>
            <StyledButton>{t("form.metaImage.add")}</StyledButton>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.metaImage.add")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <TabsRoot
              defaultValue="image"
              translations={{
                listLabel: t("form.visualElement.image"),
              }}
            >
              <TabsList>
                <TabsTrigger value="image">{t("form.visualElement.image")}</TabsTrigger>
                <TabsTrigger value="uploadImage">{t("form.visualElement.imageUpload")}</TabsTrigger>
                <TabsIndicator />
              </TabsList>
              <StyledTabsContent value="image">
                <ImageSearch
                  onImageSelect={onImageSet}
                  locale={language}
                  showCheckbox={showCheckbox}
                  checkboxAction={checkboxAction}
                  searchParams={{ podcastFriendly: podcastFriendly }}
                />
              </StyledTabsContent>
              <StyledTabsContent value="uploadImage">
                {licenses ? (
                  <ImageForm
                    language={i18n.language}
                    inDialog
                    image={image}
                    onSubmitFunc={onImageUpdate}
                    closeDialog={onImageSelectClose}
                    licenses={imageLicenses}
                    translatedFieldsToNN={[]}
                  />
                ) : (
                  <MessageBox variant="error">
                    <ErrorWarningLine />
                    {t("errorMessage.description")}
                  </MessageBox>
                )}
              </StyledTabsContent>
            </TabsRoot>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      {!showImageSelect && !!image && (
        <MetaImageField
          image={image}
          onImageRemove={onImageRemove}
          showRemoveButton={showRemoveButton}
          onImageLoad={onImageLoad}
          disableAltEditing={disableAltEditing}
        />
      )}
    </FieldsetRoot>
  );
};

export default MetaImageSearch;
