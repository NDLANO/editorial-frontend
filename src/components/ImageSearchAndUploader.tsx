/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { ImagePicker } from "./ImagePicker";
import CreateImage from "../containers/ImageUploader/CreateImage";

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
  language?: string;
  closeModal: () => void;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV3DTO) => void;
}

const ImageSearchAndUploader = ({
  onImageSelect,
  language,
  inModal,
  closeModal,
  showCheckbox,
  checkboxAction,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

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
        <ImagePicker
          onImageSelect={onImageSelect}
          locale={language}
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
