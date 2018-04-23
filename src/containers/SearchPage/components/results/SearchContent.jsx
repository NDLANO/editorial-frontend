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
import { ContentTypeBadge } from 'ndla-ui';
import getContentTypeFromResourceTypes from '../../../../util/getContentTypeFromResourceTypes';
import { toEditArticle } from '../../../../util/routeHelpers';
import { searchClasses } from '../../SearchContainer';

const SearchContent = ({ content, locale }) => {
  const resourceType = getContentTypeFromResourceTypes(
    content.contexts[0].resourceTypes,
  );

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        <img src={content.metaImage} alt="" />
      </div>
      <div {...searchClasses('content')}>
        <Link
          {...searchClasses('link')}
          to={toEditArticle(
            content.id,
            content.contexts[0].learningResourceType,
            locale,
          )}>
          <h2 {...searchClasses('title')}>
            <ContentTypeBadge background type={resourceType.contentType} />{' '}
            {content.title.title}
          </h2>
        </Link>
        <p {...searchClasses('description')}>
          {content.metaDescription.metaDescription}
        </p>
        <div {...searchClasses('breadcrumbs')}>
          {content.contexts[0].breadcrumbs.map(breadcrumb => (
            <p key={breadcrumb} {...searchClasses('breadcrumb')}>
              {breadcrumb}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

SearchContent.propTypes = {
  content: PropTypes.shape({}),
  locale: PropTypes.string.isRequired,
};

export default SearchContent;
