/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ImageLine } from "@ndla/icons";
import { ImageMeta } from "@ndla/image-search";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { ImageMetaInformationV3DTO } from "@ndla/types-backend/image-api";
import { LicenseLink } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import { routes } from "../../../../util/routeHelpers";
import { SearchContentWrapper } from "./SearchContentWrapper";
import { SearchListItemImage } from "./SearchListItemImage";

interface Props {
  image: ImageMetaInformationV3DTO;
}

const SearchImage = ({ image }: Props) => {
  const { t, i18n } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => image.copyright.license.license === l.license);

  return (
    <ListItemRoot data-testid="image-search-result">
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
            locale={i18n.language}
          />
        </SearchContentWrapper>
        {!!license && <LicenseLink license={getLicenseByAbbreviation(license.license, i18n.language)} />}
      </ListItemContent>
    </ListItemRoot>
  );
};

export default SearchImage;
