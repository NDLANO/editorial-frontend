/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import { LicenseByline, getLicenseByAbbreviation } from '@ndla/licenses';
import { colors } from '@ndla/core';
import { toEditImage } from '../../../../util/routeHelpers';
import { ImageResultShape, LicensesArrayOf } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';
import { ContentResultType, License } from '../../../../interfaces';

interface Props {
  image: ContentResultType;
  locale: string;
  licenses: [License];
}

const SearchImage = ({ image, locale, licenses, t }: Props & tType) => {
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
  licenses: LicensesArrayOf,
};

export default injectT(SearchImage);
