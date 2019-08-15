/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { Agreement } from '@ndla/icons/editor';
import { searchClasses } from '../../SearchContainer';
import { toEditAgreement } from '../../../../util/routeHelpers.js';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';

const SearchAgreement = ({ agreement, t }) => {
  const title = convertFieldWithFallback(
    agreement,
    'title',
    t('agreementSearch.noTitle'),
  );

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        <Agreement className="c-icon--large" />
      </div>
      <div {...searchClasses('content')}>
        <div {...searchClasses('header')}>
          <Link {...searchClasses('link')} to={toEditAgreement(agreement.id)}>
            <h2 {...searchClasses('title')}>{title}</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

SearchAgreement.propTypes = {
  agreement: {
    title: PropTypes.string,
  },
};

export default injectT(SearchAgreement);
