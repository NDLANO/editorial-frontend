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
import styled from '@emotion/styled';
import { ContentResultShape } from '../../../../shapes';
import {
  getContentTypeFromResourceTypes,
  resourceToLinkProps,
} from '../../../../util/resourceHelpers';
import { isLearningpath, toEditMarkup } from '../../../../util/routeHelpers';
import {
  DRAFT_HTML_SCOPE,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../../constants';
import { searchClasses } from '../../SearchContainer';
import SearchContentLanguage from './SearchContentLanguage';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import HeaderStatusInformation from '../../../../components/HeaderWithLanguage/HeaderStatusInformation';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';

const StyledHeaderDiv = styled.div`
  display: flex;
  width: 100%;
  text-decoration: none;
`;

const SearchContent = ({ content, locale, t, userAccess }) => {
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

  const isContentTypeBadge = (
    <>
      {resourceType?.contentType && (
        <ContentTypeBadge background type={resourceType.contentType} />
      )}{' '}
    </>
  );

  const contentTitle = linkProps => (
    <h2 {...searchClasses('title')}>
      {linkProps && linkProps.href ? (
        <a {...searchClasses('link')} {...linkProps}>
          {isContentTypeBadge}
          {content.title.title}
        </a>
      ) : (
        <Link {...searchClasses('link')} to={linkProps.to}>
          {isContentTypeBadge}
          {content.title.title}
        </Link>
      )}
      {content.id && userAccess?.includes(DRAFT_HTML_SCOPE) && (
        <EditMarkupLink
          to={toEditMarkup(
            content.id,
            content.supportedLanguages.includes(locale)
              ? locale
              : content.supportedLanguages[0],
          )}
          title={t('editMarkup.linkTitle')}
          inHeader={true}
        />
      )}
    </h2>
  );

  const linkProps = resourceToLinkProps(
    content,
    resourceType.contentType,
    locale,
  );

  const statusType = () => {
    const status = content.status?.current.toLowerCase();
    const isLearningpath = resourceType.contentType === 'learning-path';
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
        <StyledHeaderDiv {...searchClasses('header')}>
          {contentTitle(linkProps)}
        </StyledHeaderDiv>
        {content.supportedLanguages.map(lang => (
          <SearchContentLanguage
            style={{ display: 'flex' }}
            key={`${lang}_search_content`}
            language={lang}
            content={content}
            contentType={resourceType.contentType}
          />
        ))}
        <p {...searchClasses('description')}>
          {convertFieldWithFallback(content, 'metaDescription', '')}
        </p>
        <div {...searchClasses('breadcrumbs')} style={{ marginTop: '-25px' }}>
          {contexts && contexts.length > 0 && contexts[0].breadcrumbs ? (
            contexts[0].breadcrumbs.map(breadcrumb => (
              <p
                key={breadcrumb}
                {...searchClasses('breadcrumb')}
                style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                {breadcrumb}
              </p>
            ))
          ) : (
            <p {...searchClasses('breadcrumb')} style={{ marginRight: 0 }} />
          )}
          <HeaderStatusInformation
            statusText={statusType()}
            published={
              content.status?.current === 'PUBLISHED' ||
              content.status?.other.includes('PUBLISHED')
            }
            noHelp
            indentLeft
            fontSize={10}
          />
        </div>
      </div>
    </div>
  );
};

SearchContent.propTypes = {
  content: ContentResultShape,
  locale: PropTypes.string.isRequired,
  userAccess: PropTypes.string,
};

export default injectT(SearchContent);
