/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageSearch } from "@ndla/image-search";
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO, ISearchParamsDTO, ISearchResultV3DTO } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import CreateImage from "../containers/ImageUploader/CreateImage";

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
  inModal?: boolean;
  locale: string;
  language?: string;
  closeModal: () => void;
  onError: (err: any) => void;
  searchImages: (query: ISearchParamsDTO) => Promise<ISearchResultV3DTO>;
  fetchImage: (id: number) => Promise<IImageMetaInformationV3DTO>;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
}

const ImageSearchAndUploader = ({
  onImageSelect,
  locale,
  language,
  inModal,
  closeModal,
  onError,
  searchImages,
  fetchImage,
  showCheckbox,
  checkboxAction,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const imageSearchTranslations = useImageSearchTranslations();

  const searchImagesWithParameters = (query?: string, page?: number) => {
    return searchImages({
      query,
      page,
      pageSize: 16,
      language: language,
      fallback: true,
      includeCopyrighted: true,
    });
  };

  return (
    <TabsRoot
      defaultValue="image"
      value={selectedTab}
      onValueChange={(details) => setSelectedTab(details.value)}
      translations={{ listLabel: t("form.visualElement.image") }}
    >
      <TabsList>
        <TabsTrigger value="image">{t("form.visualElement.image")}</TabsTrigger>
        <TabsTrigger value="upload">{t("form.visualElement.imageUpload")}</TabsTrigger>
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
      <StyledTabsContent value="upload">
        <CreateImage inModal={inModal} editingArticle closeModal={closeModal} onImageCreated={onImageSelect} />
      </StyledTabsContent>
    </TabsRoot>
  );
};

export default ImageSearchAndUploader;
