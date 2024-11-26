/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ImageLine } from "@ndla/icons/editor";
import { ImageMeta } from "@ndla/image-search";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { LicenseLink } from "@ndla/ui";
import { SearchContentWrapper } from "./SearchContentWrapper";
import { SearchListItemImage } from "./SearchListItemImage";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { routes } from "../../../../util/routeHelpers";

interface Props {
  image: IImageMetaInformationV3;
  locale: string;
}

const SearchImage = ({ image, locale }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => image.copyright.license.license === l.license);

  return (
    <ListItemRoot context="list" variant="subtle" data-testid="image-search-result">
      <SearchListItemImage
        src={image.image.imageUrl}
        alt={image.alttext.alttext}
        fallbackElement={<ImageLine />}
        sizes="56px"
        fallbackWidth={56}
      />
      <ListItemContent>
        <SearchContentWrapper>
          <ListItemHeading asChild consumeCss>
            <SafeLink to={routes.image.edit(image.id, image.title.language)} unstyled>
              {image.title.title || t("imageSearch.noTitle")}
            </SafeLink>
          </ListItemHeading>
          <ImageMeta
            contentType={image.image.contentType}
            fileSize={image.image.size}
            imageDimensions={image.image.dimensions}
          />
        </SearchContentWrapper>
        {!!license && <LicenseLink license={getLicenseByAbbreviation(license.license, locale)} />}
      </ListItemContent>
    </ListItemRoot>
  );
};

export default SearchImage;
