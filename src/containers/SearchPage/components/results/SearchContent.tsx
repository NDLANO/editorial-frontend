/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import { fonts } from '@ndla/core';
import { ContentTypeBadge } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IMultiSearchSummary } from '@ndla/types-search-api';
import {
  getContentTypeFromResourceTypes,
  resourceToLinkProps,
} from '../../../../util/resourceHelpers';
import { isLearningpath, toEditMarkup } from '../../../../util/routeHelpers';
import { DRAFT_HTML_SCOPE, RESOURCE_TYPE_LEARNING_PATH } from '../../../../constants';
import SearchContentLanguage from './SearchContentLanguage';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import HeaderStatusInformation from '../../../../components/HeaderWithLanguage/HeaderStatusInformation';
import { EditMarkupLink } from '../../../../components/EditMarkupLink';
import SearchHighlight from './SearchHighlight';
import { useSession } from '../../../Session/SessionProvider';
import { getExpirationDate } from '../../../ArticlePage/articleTransformers';
import {
  NoShadowAnchor,
  StyledSearchBreadcrumb,
  StyledSearchBreadcrumbs,
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchResult,
  StyledSearchTitle,
} from '../form/StyledSearchComponents';

const FlexBoxWrapper = styled.div`
  display: flex;
  flex-flow: row;
  margin-right: 0.2rem;
  box-shadow: none;
  align-items: center;
`;

const ContentTypeWrapper = styled.div`
  margin-right: 0.2em;
  margin-top: 10px;
`;

const DescriptionTitle = styled.p`
  margin-bottom: 0;
  font-weight: ${fonts.weight.semibold};
`;

interface Props {
  content: IMultiSearchSummary;
  locale: string;
}

interface ContentType {
  contentType: string;
}

const Title = StyledSearchTitle.withComponent('h2');
const NoShadowLink = NoShadowAnchor.withComponent(Link);

const SearchContent = ({ content, locale }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { contexts, metaImage } = content;
  const { url, alt } = metaImage || {};
  const imageUrl = url ? `${url}?width=200` : '/placeholder.png';
  let resourceType: ContentType | undefined;
  if ((contexts[0]?.resourceTypes?.length ?? 0) > 0) {
    resourceType = getContentTypeFromResourceTypes(contexts[0].resourceTypes);
  } else if (isLearningpath(content.url)) {
    resourceType = getContentTypeFromResourceTypes([{ id: RESOURCE_TYPE_LEARNING_PATH, name: '' }]);
  }

  const linkProps = resourceToLinkProps(content, resourceType?.contentType, locale);

  const statusType = () => {
    const status = content.status?.current.toLowerCase();
    const isLearningpath = resourceType?.contentType === 'learning-path';
    return t(`form.status.${isLearningpath ? 'learningpath_statuses.' + status : status}`);
  };
  const EditMarkup = (
    <>
      {content.id && userPermissions?.includes(DRAFT_HTML_SCOPE) && (
        <EditMarkupLink
          to={toEditMarkup(
            content.id,
            content.supportedLanguages.includes(locale) ? locale : content.supportedLanguages[0],
          )}
          title={t('editMarkup.linkTitle')}
          inHeader={true}
        />
      )}
    </>
  );

  const ContentType = (
    <>
      {resourceType?.contentType && (
        <ContentTypeWrapper>
          <ContentTypeBadge background type={resourceType.contentType} />
        </ContentTypeWrapper>
      )}{' '}
    </>
  );

  const metaDescription = convertFieldWithFallback(content, 'metaDescription', '');
  const expirationDate = getExpirationDate(content);

  return (
    <StyledSearchResult>
      <StyledSearchImageContainer>
        <img src={imageUrl} alt={alt} />
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <div>
          <FlexBoxWrapper>
            {ContentType}
            <Title>
              {linkProps && linkProps.href ? (
                <NoShadowAnchor {...linkProps}>{content.title.title}</NoShadowAnchor>
              ) : (
                <NoShadowLink to={linkProps.to ?? ''}>{content.title.title}</NoShadowLink>
              )}
              {EditMarkup}
            </Title>
          </FlexBoxWrapper>
          {content.supportedLanguages.map(lang => (
            <SearchContentLanguage
              //@ts-ignore
              style={{ display: 'flex' }}
              key={`${lang}_search_content`}
              language={lang}
              content={content}
              contentType={resourceType?.contentType}
            />
          ))}
        </div>
        <SearchHighlight content={content} locale={locale} />
        {metaDescription !== '' && (
          <DescriptionTitle>{t('form.name.metaDescription')}</DescriptionTitle>
        )}
        <StyledSearchDescription>{metaDescription}</StyledSearchDescription>
        <StyledSearchBreadcrumbs style={{ marginTop: '-25px' }}>
          {contexts && contexts.length > 0 && contexts[0].breadcrumbs ? (
            contexts[0].breadcrumbs.map(breadcrumb => (
              <StyledSearchBreadcrumb
                key={breadcrumb}
                style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                {breadcrumb}
              </StyledSearchBreadcrumb>
            ))
          ) : (
            <StyledSearchBreadcrumb style={{ marginRight: 0 }} />
          )}
          <HeaderStatusInformation
            statusText={statusType()}
            published={
              !!(
                content.status?.current === 'PUBLISHED' ||
                content.status?.other.includes('PUBLISHED')
              )
            }
            indentLeft
            fontSize={10}
            expirationDate={expirationDate}
            type={content.learningResourceType}
          />
        </StyledSearchBreadcrumbs>
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchContent;
