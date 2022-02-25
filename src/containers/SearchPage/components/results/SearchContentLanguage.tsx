/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IMultiSearchSummary } from '@ndla/types-search-api';
import { resourceToLinkProps } from '../../../../util/resourceHelpers';
import { ContentResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

const supported = ['en', 'nb', 'nn'];

interface Props {
  content: IMultiSearchSummary;
  language: string;
  contentType?: string;
}

const SearchContentLanguage = ({ language, content, contentType }: Props) => {
  const { t } = useTranslation();
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
      <Link {...searchClasses('link')} to={linkProps.to ?? ''}>
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

export default SearchContentLanguage;
