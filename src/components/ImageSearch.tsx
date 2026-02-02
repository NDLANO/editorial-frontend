/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ImageSearch as BaseImageSearch, ImageSearchProps } from "@ndla/image-search";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SearchParamsDTO } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import config from "../config";
import { onError, postSearchImages } from "../modules/image/imageApi";

const StyledText = styled(Text, {
  base: {
    marginBlockEnd: "xsmall",
  },
});

interface Props extends Partial<ImageSearchProps> {
  onImageSelect: ImageSearchProps["onImageSelect"];
  searchParams?: SearchParamsDTO;
}

export const ImageSearch = ({ searchParams = {}, locale, ...props }: Props) => {
  const { t, i18n } = useTranslation();
  const translations = useImageSearchTranslations();
  return (
    <BaseImageSearch
      searchImages={(query?: string, page?: number) =>
        postSearchImages({
          query,
          page,
          pageSize: 16,
          language: locale,
          fallback: true,
          inactive: false,
          includeCopyrighted: true,
          license: config.licenseAll,
          ...searchParams,
        })
      }
      noResults={<StyledText>{t("imageSearch.noResultsText")}</StyledText>}
      locale={locale ?? i18n.language}
      translations={translations}
      onError={onError}
      {...props}
    />
  );
};
