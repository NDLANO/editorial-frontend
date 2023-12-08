/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { ImageMeta } from '@ndla/image-search';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { LicenseByline } from '@ndla/notion';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { useLicenses } from '../../../../modules/draft/draftQueries';
import { toEditImage } from '../../../../util/routeHelpers';
import {
  StyledOtherLink,
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchResult,
  StyledSearchTitle,
} from '../form/StyledSearchComponents';

const StyledImageMeta = styled(ImageMeta)`
  margin-bottom: 5px;
`;

interface Props {
  image: IImageMetaInformationV3;
  locale: string;
}

const SearchImage = ({ image, locale }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => image.copyright.license.license === l.license);

  return (
    <StyledSearchResult data-testid="image-search-result">
      <StyledSearchImageContainer>
        <img src={image.image.imageUrl + '?width=200'} alt={`${image.alttext.alttext}`} />
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <Link to={toEditImage(image.id, image.title.language)}>
          <StyledSearchTitle>{image.title.title || t('imageSearch.noTitle')}</StyledSearchTitle>
        </Link>
        <StyledSearchDescription>
          {`${t('searchPage.language')}: `}
          {image.supportedLanguages?.map((lang) => (
            <StyledOtherLink key={lang}>{t(`languages.${lang}`)}</StyledOtherLink>
          ))}
        </StyledSearchDescription>
        <StyledImageMeta
          contentType={image.image.contentType}
          fileSize={image.image.size}
          imageDimensions={image.image.dimensions}
        />
        {license && (
          <LicenseByline
            licenseRights={getLicenseByAbbreviation(license.license, locale).rights}
            locale={locale}
            color={colors.brand.grey}
          />
        )}
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchImage;
