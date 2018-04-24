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
import { ContentResultShape } from '../../../../shapes';
import getContentTypeFromResourceTypes from '../../../../util/getContentTypeFromResourceTypes';
import { toEditArticle } from '../../../../util/routeHelpers';
import { searchClasses } from '../../SearchContainer';

const SearchContent = ({ content, locale }) => {
  const { contexts } = content;

  let resourceType;
  if (contexts.length > 0 && contexts[0].resourceTypes.length > 0) {
    resourceType = getContentTypeFromResourceTypes(contexts[0].resourceTypes);
  }

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        <img src={content.metaImage || '/placeholder.png'} alt="" />
      </div>
      <div {...searchClasses('content')}>
        <Link
          {...searchClasses('link')}
          to={toEditArticle(
            content.id,
            contexts.length > 0 && contexts[0].learningResourceType
              ? contexts[0].learningResourceType
              : 'standard',
            locale,
          )}>
          <h2 {...searchClasses('title')}>
            {resourceType &&
              resourceType.contentType && (
                <ContentTypeBadge background type={resourceType.contentType} />
              )}{' '}
            {content.title.title}
          </h2>
        </Link>
        <p {...searchClasses('description')}>
          {content.metaDescription.metaDescription}
        </p>
        <div {...searchClasses('breadcrumbs')}>
          {contexts.length > 0 && contexts[0].breadcrumbs ? (
            contexts[0].breadcrumbs.map(breadcrumb => (
              <p key={breadcrumb} {...searchClasses('breadcrumb')}>
                {breadcrumb}
              </p>
            ))
          ) : (
            <p {...searchClasses('breadcrumb')} />
          )}
        </div>
      </div>
    </div>
  );
};

SearchContent.propTypes = {
  content: ContentResultShape,
  locale: PropTypes.string.isRequired,
};

export default SearchContent;
