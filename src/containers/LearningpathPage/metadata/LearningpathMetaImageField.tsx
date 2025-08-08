/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, LinkMedium } from "@ndla/icons";
import { Button, DialogTrigger, Figure, IconButton, Image, Text } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO, INewImageMetaInformationV2DTO } from "@ndla/types-backend/image-api";
import { ImageSearch } from "../../../components/ImageSearch";
import { MetaImagePicker } from "../../../components/MetaImagePicker";
import MetaInformation from "../../../components/MetaInformation";
import { StyledFigureButtons } from "../../../components/SlateEditor/plugins/embed/FigureButtons";
import { postImage } from "../../../modules/image/imageApi";
import { useImage } from "../../../modules/image/imageQueries";
import { routes } from "../../../util/routeHelpers";
import ImageForm from "../../ImageUploader/components/ImageForm";

interface Props {
  language: string;
}

const StyledButton = styled(Button, {
  base: {
    maxWidth: "fit-content",
  },
});

const StyledFigure = styled(Figure, {
  base: {
    maxWidth: "fit-content",
  },
});

const MetaImageSection = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const MetaImageWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    flexWrap: "wrap",
  },
});

export const LearningpathMetaImageField = ({ language }: Props) => {
  const [image, setImage] = useState<IImageMetaInformationV3DTO | undefined>(undefined);
  const [field, , helpers] = useField("coverPhotoUrl");
  const { t } = useTranslation();
  const imageId = field.value?.split("/").pop() ?? "";

  const imageQuery = useImage({ id: imageId, language }, { enabled: !!imageId });

  useEffect(() => {
    if (imageQuery.data && !image) {
      setImage(imageQuery.data);
    }
  }, [image, imageQuery.data]);

  const onCreateImage = async (
    image: INewImageMetaInformationV2DTO,
    file: string | Blob | undefined,
    close: VoidFunction,
  ) => {
    let apiImage: IImageMetaInformationV3DTO;
    if (file instanceof Blob) {
      apiImage = await postImage(image, file);
    } else {
      throw new Error("Invalid state when creating / updating image");
    }
    close();
    setImage(apiImage);
    helpers.setValue(apiImage.image.imageUrl);
  };

  return (
    <MetaImageSection>
      <Text textStyle="label.medium" fontWeight="bold">
        {t("learningpathForm.metadata.metaImageTitle")}
      </Text>
      <MetaImagePicker
        imageSearch={(close) => (
          <ImageSearch
            onImageSelect={(image) => {
              close();
              helpers.setValue(image.metaUrl);
            }}
            locale={language}
          />
        )}
        imageForm={(close) => (
          <ImageForm
            language={language}
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
        <MetaImageWrapper>
          <StyledFigure>
            <StyledFigureButtons>
              <IconButton
                size="small"
                variant="danger"
                onClick={() => {
                  helpers.setValue(null, true);
                  setImage(undefined);
                }}
                title={t("form.image.removeImage")}
                aria-label={t("form.image.removeImage")}
              >
                <DeleteBinLine />
              </IconButton>
              <SafeLinkIconButton
                to={routes.image.edit(image.id, image.image.language)}
                variant="secondary"
                size="small"
                title={t("form.image.editImage")}
                aria-label={t("form.image.editImage")}
              >
                <LinkMedium />
              </SafeLinkIconButton>
            </StyledFigureButtons>
            <Image src={image.image.imageUrl} alt={image.alttext.alttext} />
          </StyledFigure>
          <MetaInformation
            title={image.title.title}
            copyright={image.copyright.license.license}
            alt={image.alttext.alttext}
            action={undefined}
          />
        </MetaImageWrapper>
      )}
    </MetaImageSection>
  );
};
