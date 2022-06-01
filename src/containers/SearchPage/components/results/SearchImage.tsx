/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { LicenseByline, getLicenseByAbbreviation } from '@ndla/licenses';
import { ImageMeta } from '@ndla/image-search';
import { IImageMetaSummary } from '@ndla/types-image-api';
import { toEditImage } from '../../../../util/routeHelpers';
import { useLicenses } from '../../../../modules/draft/draftQueries';
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
  image: IImageMetaSummary;
  locale: string;
}

const SearchImage = ({ image, locale }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find(l => image.license === l.license);
  return (
    <StyledSearchResult>
      <StyledSearchImageContainer>
        <img src={image.previewUrl + '?width=200'} alt={`${image.altText?.alttext}`} />
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <Link to={toEditImage(image.id, image.title.language)}>
          <StyledSearchTitle>{image.title.title || t('imageSearch.noTitle')}</StyledSearchTitle>
        </Link>
        <StyledSearchDescription>
          {`${t('searchPage.language')}: `}
          {image.supportedLanguages?.map(lang => (
            <StyledOtherLink key={lang}>{t(`language.${lang}`)}</StyledOtherLink>
          ))}
        </StyledSearchDescription>
        <StyledImageMeta
          contentType={image.contentType}
          fileSize={image.fileSize}
          imageDimensions={image.imageDimensions}
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
