/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { IImageMetaInformationV3DTO, IUpdateImageMetaInformationDTO } from "@ndla/types-backend/image-api";
import ImageForm from "./components/ImageForm";
import { TranslateType, useTranslateToNN } from "../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../components/PageSpinner";
import { draftLicensesToImageLicenses } from "../../modules/draft/draftApiUtils";
import { useLicenses } from "../../modules/draft/draftQueries";
import { fetchImage, updateImage } from "../../modules/image/imageApi";
import { createFormData } from "../../util/formDataHelper";
import { useMessages } from "../Messages/MessagesProvider";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

interface Props {
  imageId?: string;
  imageLanguage?: string;
  isNewlyCreated?: boolean;
}

const translateFields: TranslateType[] = [
  {
    field: "title.title",
    type: "text",
  },
  {
    field: "alttext.alttext",
    type: "text",
  },
  {
    field: "caption.caption",
    type: "text",
  },
  {
    field: "tags.tags",
    type: "text",
  },
];

const EditImage = ({ isNewlyCreated }: Props) => {
  const { i18n } = useTranslation();
  const { id: imageId, selectedLanguage: imageLanguage } = useParams<"id" | "selectedLanguage">();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const [loading, setLoading] = useState(true);
  const { applicationError, createMessage } = useMessages();
  const [image, setImage] = useState<IImageMetaInformationV3DTO | undefined>(undefined);
  const { shouldTranslate, translate, translating } = useTranslateToNN();
  const imageLicenses = draftLicensesToImageLicenses(licenses ?? []);

  useEffect(() => {
    (async () => {
      if (imageId) {
        setLoading(true);
        const img = await fetchImage(parseInt(imageId), imageLanguage);
        setImage(img);
        setLoading(false);
      }
    })();
  }, [imageLanguage, imageId]);

  useEffect(() => {
    (async () => {
      if (shouldTranslate && !loading) {
        setLoading(true);
      }
      if (image && !loading && shouldTranslate) {
        await translate(image, translateFields, setImage);
        setLoading(false);
      }
    })();
  }, [shouldTranslate, translate, image, loading]);

  const onUpdate = async (updatedImage: IUpdateImageMetaInformationDTO, image: string | Blob) => {
    const formData = createFormData(image, updatedImage);

    try {
      const res = await updateImage(Number(imageId), updatedImage, formData);
      setImage(res);
    } catch (e) {
      const error = e as any;
      applicationError(error);
      createMessage(error.messages);
    }
  };

  if (loading || translating) {
    return <PageSpinner />;
  }

  if (!imageId || !image?.id) {
    return <NotFoundPage />;
  }

  const isNewLanguage = !!imageLanguage && !image?.supportedLanguages.includes(imageLanguage);

  return (
    <ImageForm
      language={imageLanguage ?? i18n.language}
      image={image}
      onSubmitFunc={onUpdate}
      isNewlyCreated={isNewlyCreated}
      licenses={imageLicenses}
      isNewLanguage={isNewLanguage}
      supportedLanguages={image.supportedLanguages}
    />
  );
};

export default EditImage;
