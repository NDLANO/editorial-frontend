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
import { ContentTypeBadge } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { ContentResultShape } from '../../../../shapes';
import {
  getContentTypeFromResourceTypes,
  resourceToLinkProps,
} from '../../../../util/resourceHelpers';
import { isLearningpath } from '../../../../util/routeHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../../../../constants';
import { searchClasses } from '../../SearchContainer';
import SearchContentLanguage from './SearchContentLanguage';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import HeaderStatusInformation from '../../../../components/HeaderWithLanguage/HeaderStatusInformation';

const SearchContent = ({ content, locale, t }) => {
  const { contexts, metaImage } = content;
  const { url, alt } = metaImage || {};
  let resourceType = {};
  if (
    contexts &&
    contexts.length > 0 &&
    contexts[0].resourceTypes &&
    contexts[0].resourceTypes.length > 0
  ) {
    resourceType = getContentTypeFromResourceTypes(contexts[0].resourceTypes);
  } else {
    if (isLearningpath(content.url)) {
      resourceType = getContentTypeFromResourceTypes([
        { id: RESOURCE_TYPE_LEARNING_PATH },
      ]);
    }
  }
  const contentTitle = (
    <h2 {...searchClasses('title')}>
      {resourceType?.contentType && (
        <ContentTypeBadge background type={resourceType.contentType} />
      )}{' '}
      {content.title.title}
    </h2>
  );

  const linkProps = resourceToLinkProps(
    content,
    resourceType.contentType,
    locale,
  );

  const statusType = resource => {
    const status = content.status?.current.toLowerCase();
    const isLearningpath = resource.contentType === 'learning-path';
    return t(
      `form.status.${
        isLearningpath ? 'learningpath_statuses.' + status : status
      }`,
    );
  };

  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        <img src={url || '/placeholder.png'} alt={alt} />
      </div>
      <div {...searchClasses('content')}>
        <div {...searchClasses('header')}>
          {linkProps && linkProps.href ? (
            <a {...searchClasses('link')} {...linkProps}>
              {contentTitle}
            </a>
          ) : (
            <Link {...searchClasses('link')} to={linkProps.to}>
              {contentTitle}
            </Link>
          )}
          {content.supportedLanguages.map(lang => (
            <SearchContentLanguage
              key={`${lang}_search_content`}
              language={lang}
              content={content}
              contentType={resourceType.contentType}
            />
          ))}
        </div>
        <HeaderStatusInformation
          statusText={statusType(resourceType)}
          published={
            content.status?.current === 'PUBLISHED' ||
            content.status?.other.includes('PUBLISHED')
          }
          noHelp
          indentLeft
        />
        <p {...searchClasses('description')}>
          {convertFieldWithFallback(content, 'metaDescription', '')}
        </p>
        <div {...searchClasses('breadcrumbs')}>
          {contexts && contexts.length > 0 && contexts[0].breadcrumbs ? (
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

export default injectT(SearchContent);
