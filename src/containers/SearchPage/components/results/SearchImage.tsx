/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { LicenseByline, getLicenseByAbbreviation } from '@ndla/licenses';
import { ImageMeta } from '@ndla/image-search';
import { IImageMetaSummary } from '@ndla/types-image-api';
import { toEditImage } from '../../../../util/routeHelpers';
import { ImageResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';
import { useLicenses } from '../../../../modules/draft/draftQueries';

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
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        <img src={image.previewUrl + '?width=200'} alt={`${image.altText?.alttext}`} />
      </div>
      <div {...searchClasses('content')}>
        <Link to={toEditImage(image.id, image.title.language)}>
          <h1 {...searchClasses('title')}>{image.title.title || t('imageSearch.noTitle')}</h1>
        </Link>
        <p {...searchClasses('description')}>
          {`${t('searchPage.language')}: `}
          {image.supportedLanguages?.map(lang => (
            <span key={lang} {...searchClasses('other-link')}>
              {t(`language.${lang}`)}
            </span>
          ))}
        </p>
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
      </div>
    </div>
  );
};

SearchImage.propTypes = {
  image: ImageResultShape.isRequired,
  locale: PropTypes.string.isRequired,
};

export default SearchImage;
