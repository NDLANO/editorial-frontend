/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Link } from 'react-router-dom';
import { resourceToLinkProps } from '../../../../util/resourceHelpers';
import { ContentResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

const supported = ['en', 'nb', 'nn'];

const SearchContentLanguage = ({ language, content, contentType, t }) => {
  if (!supported.includes(language) || content.title.language === language) {
    return null;
  }
  const linkProps = resourceToLinkProps(content, contentType, language);

  const link =
    linkProps && linkProps.href ? (
      <a {...searchClasses('link')} {...linkProps}>
        {t(`language.${language}`)}
      </a>
    ) : (
      <Link {...searchClasses('link')} to={linkProps.to}>
        {t(`language.${language}`)}
      </Link>
    );
  return <span {...searchClasses('other-link')}>{link}</span>;
};

SearchContentLanguage.propTypes = {
  content: ContentResultShape,
  language: PropTypes.string.isRequired,
  contentType: PropTypes.string,
};

export default injectT(SearchContentLanguage);
