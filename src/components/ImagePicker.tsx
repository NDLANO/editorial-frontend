/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ImageSearch, ImageSearchProps } from "@ndla/image-search";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ISearchParamsDTO } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { fetchImage, onError, postSearchImages } from "../modules/image/imageApi";

const StyledText = styled(Text, {
  base: {
    marginBlockEnd: "xsmall",
  },
});

type ImageSearchPropsWithOptional = Pick<ImageSearchProps, "onImageSelect"> &
  Partial<Omit<ImageSearchProps, "onImageSelect">>;

interface Props extends ImageSearchPropsWithOptional {
  searchParams?: ISearchParamsDTO;
}

export const ImagePicker = ({ searchParams = {}, locale, ...props }: Props) => {
  const { t, i18n } = useTranslation();
  const translations = useImageSearchTranslations();
  return (
    <ImageSearch
      searchImages={(query?: string, page?: number) =>
        postSearchImages({
          query,
          page,
          pageSize: 16,
          language: locale,
          fallback: true,
          includeCopyrighted: true,
          ...searchParams,
        })
      }
      fetchImage={(id) => fetchImage(id, locale)}
      noResults={<StyledText>{t("imageSearch.noResultsText")}</StyledText>}
      locale={locale ?? i18n.language}
      translations={translations}
      onError={onError}
      {...props}
    />
  );
};
