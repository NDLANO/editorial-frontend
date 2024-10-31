/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { ImageSearch } from "@ndla/image-search";
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import {
  IImageMetaInformationV3,
  IUpdateImageMetaInformation,
  ISearchResultV3,
  INewImageMetaInformationV2,
  ISearchParams,
} from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import EditorErrorMessage from "./SlateEditor/EditorErrorMessage";
import ImageForm from "../containers/ImageUploader/components/ImageForm";
import { draftLicensesToImageLicenses } from "../modules/draft/draftApiUtils";
import { useLicenses } from "../modules/draft/draftQueries";

const StyledTitleDiv = styled.div`
  margin-bottom: ${spacing.small};
`;

const StyledTabsContent = styled(TabsContent)`
  & > * {
    width: 100%;
  }
`;

interface Props {
  onImageSelect: (image: IImageMetaInformationV3) => void;
  locale: string;
  language?: string;
  closeModal: () => void;
  onError: (err: Error & Response) => void;
  searchImages: (queryObject: ISearchParams) => Promise<ISearchResultV3>;
  fetchImage: (id: number) => Promise<IImageMetaInformationV3>;
  image?: IImageMetaInformationV3;
  updateImage: (
    imageMetadata: IUpdateImageMetaInformation & INewImageMetaInformationV2,
    file: string | Blob,
    id?: number,
  ) => void;
  inModal?: boolean;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3) => void;
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
          noResults={
            <>
              <StyledTitleDiv>{t("imageSearch.noResultsText")}</StyledTitleDiv>
              <ButtonV2 type="submit" variant="outline" onClick={() => setSelectedTab("imageUpload")}>
                {t("imageSearch.noResultsButtonText")}
              </ButtonV2>
            </>
          }
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
          <EditorErrorMessage msg={t("errorMessage.description")} />
        )}
      </StyledTabsContent>
    </TabsRoot>
  );
};

export default ImageSearchAndUploader;
