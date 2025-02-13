/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningLine } from "@ndla/icons";
import { ImageSearch } from "@ndla/image-search";
import { MessageBox, TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  IImageMetaInformationV3DTO,
  IUpdateImageMetaInformationDTO,
  ISearchResultV3DTO,
  INewImageMetaInformationV2DTO,
  ISearchParamsDTO,
} from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import ImageForm from "../containers/ImageUploader/components/ImageForm";
import { draftLicensesToImageLicenses } from "../modules/draft/draftApiUtils";
import { useLicenses } from "../modules/draft/draftQueries";

const StyledText = styled(Text, {
  base: {
    marginBlockEnd: "xsmall",
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
  onImageSelect: (image: IImageMetaInformationV3DTO) => void;
  locale: string;
  language?: string;
  closeModal: () => void;
  onError: (err: Error & Response) => void;
  searchImages: (queryObject: ISearchParamsDTO) => Promise<ISearchResultV3DTO>;
  fetchImage: (id: number) => Promise<IImageMetaInformationV3DTO>;
  image?: IImageMetaInformationV3DTO;
  updateImage: (
    imageMetadata: IUpdateImageMetaInformationDTO & INewImageMetaInformationV2DTO,
    file: string | Blob,
    id?: number,
  ) => void;
  inModal?: boolean;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
  podcastFriendly?: boolean;
}

const ImageSearchAndUploader = ({
  image,
  updateImage,
  onImageSelect,
  closeModal,
  locale,
  language,
  fetchImage,
  searchImages,
  onError,
  inModal = false,
  showCheckbox,
  checkboxAction,
  podcastFriendly,
}: Props) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const imageSearchTranslations = useImageSearchTranslations();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const searchImagesWithParameters = (query?: string, page?: number) => {
    return searchImages({
      query,
      page,
      pageSize: 16,
      language: language,
      fallback: true,
      includeCopyrighted: true,
      podcastFriendly: podcastFriendly,
    });
  };
  const imageLicenses = draftLicensesToImageLicenses(licenses ?? []);

  return (
    <TabsRoot
      defaultValue="image"
      value={selectedTab}
      onValueChange={(details) => setSelectedTab(details.value)}
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
          fetchImage={fetchImage}
          searchImages={searchImagesWithParameters}
          locale={locale}
          translations={imageSearchTranslations}
          onImageSelect={onImageSelect}
          noResults={<StyledText>{t("imageSearch.noResultsText")}</StyledText>}
          onError={onError}
          showCheckbox={showCheckbox}
          checkboxAction={checkboxAction}
        />
      </StyledTabsContent>
      <StyledTabsContent value="uploadImage">
        {licenses ? (
          <ImageForm
            language={locale}
            inModal={inModal}
            image={image}
            onSubmitFunc={updateImage}
            closeModal={closeModal}
            licenses={imageLicenses}
            supportedLanguages={image?.supportedLanguages ?? [locale]}
          />
        ) : (
          <MessageBox variant="error">
            <ErrorWarningLine />
            {t("errorMessage.description")}
          </MessageBox>
        )}
      </StyledTabsContent>
    </TabsRoot>
  );
};

export default ImageSearchAndUploader;
