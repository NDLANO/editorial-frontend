/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, DialogTrigger, FieldsetLegend, FieldsetRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ImageMetaInformationV3DTO, NewImageMetaInformationV2DTO } from "@ndla/types-backend/image-api";
import MetaImageField from "./components/MetaImageField";
import { ImageSearch } from "../../components/ImageSearch";
import { MetaImagePicker } from "../../components/MetaImagePicker";
import { postImage, fetchImage } from "../../modules/image/imageApi";
import ImageForm from "../ImageUploader/components/ImageForm";

const StyledButton = styled(Button, {
  base: {
    width: "fit-content",
  },
});

interface Props {
  metaImageId: string;
  name: string;
  onImageLoad?: (width: number, height: number) => void;
  showRemoveButton: boolean;
  showCheckbox: boolean;
  checkboxAction?: (image: ImageMetaInformationV3DTO) => void;
  language?: string;
  podcastFriendly?: boolean;
  disableAltEditing?: boolean;
}

const MetaImageSearch = ({
  name,
  metaImageId,
  showRemoveButton,
  onImageLoad,
  showCheckbox,
  checkboxAction,
  language,
  podcastFriendly,
  disableAltEditing,
}: Props) => {
  const [image, setImage] = useState<ImageMetaInformationV3DTO | undefined>(undefined);

  const { t, i18n } = useTranslation();
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (metaImageId) {
      fetchImage(parseInt(metaImageId), language).then((image) => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [metaImageId, language]);

  const onImageSet = (image: ImageMetaInformationV3DTO) => {
    setImage(image);
    setFieldValue(name, image.id);
    setFieldValue("metaImageAlt", disableAltEditing ? "" : image.alttext.alttext.trim(), true);
  };

  const onImageRemove = () => {
    setImage(undefined);
    setFieldValue(name, null, true);
  };

  const onCreateImage = async (
    image: NewImageMetaInformationV2DTO,
    file: string | Blob | undefined,
    close: VoidFunction,
  ) => {
    let apiImage: ImageMetaInformationV3DTO;
    if (file instanceof Blob) {
      apiImage = await postImage(image, file);
    } else {
      throw new Error("Invalid state when creating / updating image");
    }
    close();
    onImageSet(apiImage);
  };

  return (
    <FieldsetRoot>
      <FieldsetLegend textStyle="label.medium">{t("form.metaImage.add")}</FieldsetLegend>
      <MetaImagePicker
        imageSearch={(close) => (
          <ImageSearch
            onImageSelect={(image) => {
              close();
              onImageSet(image);
            }}
            locale={language}
            showCheckbox={showCheckbox}
            checkboxAction={checkboxAction}
            searchParams={{ podcastFriendly: podcastFriendly }}
          />
        )}
        imageForm={(close) => (
          <ImageForm
            language={i18n.language}
            inDialog
            onSubmitFunc={(image, blob) => onCreateImage(image, blob, close)}
            closeDialog={close}
            translatedFieldsToNN={[]}
          />
        )}
      >
        {!image && (
          <DialogTrigger asChild>
            <StyledButton>{t("form.metaImage.add")}</StyledButton>
          </DialogTrigger>
        )}
      </MetaImagePicker>
      {!!image && (
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
