/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useState } from 'react';

import Button from '@ndla/button';
import Url from 'url-parse';
import { useNavigate } from 'react-router-dom';
import { colors, misc, spacing, fonts } from '@ndla/core';
import { Search } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { isValidLocale } from '../../../i18n';
import { toEditArticle, to404 } from '../../../util/routeHelpers';
import { isNDLAFrontendUrl } from '../../../util/htmlHelpers';

import { fetchResource, fetchTopic } from '../../../modules/taxonomy';

import { fetchNewArticleId } from '../../../modules/draft/draftApi';
import { resolveUrls } from '../../../modules/taxonomy/taxonomyApi';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';

const formCSS = css`
  display: flex;
  background: ${colors.brand.greyLightest};
  border-radius: ${misc.borderRadius};
  border: 1px solid transparent;
  ${fonts.sizes(16, 1.2)} font-weight: ${fonts.weight.semibold};
  padding: ${spacing.xsmall};
  padding-left: ${spacing.small};
  transition: all 200ms ease;

  input {
    padding: ${spacing.xsmall};
    background: transparent;
    border: 0;
    outline: none;
    color: ${colors.brand.primary};
    transition: width 200ms ease 100ms;
    width: 200px;

    &:focus {
      width: 400px;
    }
  }

  & > button {
    color: ${colors.brand.grey};
  }

  .c-icon {
    margin: 0 ${spacing.small};
  }

  &:focus-within {
    border: 1px solid ${colors.brand.primary};

    .c-icon {
      color: ${colors.brand.primary};
    }
  }

  &:hover,
  &:focus {
    &:not(:focus-within) {
      cursor: pointer;
      background: ${colors.brand.greyLighter};
      border: 1px solid ${colors.brand.greyLight};
    }
  }
`;

interface Props {
  query?: string;
  onSearchQuerySubmit: (query: string) => void;
}

export const MastheadSearchForm = ({ query: initQuery = '', onSearchQuerySubmit }: Props) => {
  const [query, setQuery] = useState(initQuery);
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const navigate = useNavigate();

  const handleQueryChange = (evt: FormEvent<HTMLInputElement>) => setQuery(evt.currentTarget.value);

  const handleNodeId = async (nodeId: number) => {
    try {
      const newArticle = await fetchNewArticleId(nodeId);
      navigate(toEditArticle(newArticle.id, 'standard'));
    } catch (error) {
      navigate(to404());
    }
  };

  const handleTaxonomyId = async (taxId: string) => {
    const taxonomyFunction = taxId.includes('urn:resource:') ? fetchResource : fetchTopic;
    try {
      const taxElement = await taxonomyFunction({ id: taxId, taxonomyVersion });
      const arr = taxElement.contentUri?.split(':');
      if (arr) {
        const id = arr[arr.length - 1];
        navigate(toEditArticle(parseInt(id), 'standard'));
      }
    } catch (error) {
      navigate(to404());
    }
  };

  const handleUrlPaste = (frontendUrl: string) => {
    // Removes search queries before split
    const ndlaUrl = frontendUrl.split(/\?/)[0];
    // Strip / from end if topic
    const cleanUrl = ndlaUrl.endsWith('/')
      ? ndlaUrl.replace('/subjects', '').slice(0, -1)
      : ndlaUrl.replace('/subjects', '');
    const splittedNdlaUrl = cleanUrl.split('/');

    const urlId = splittedNdlaUrl[splittedNdlaUrl.length - 1];

    if (
      !urlId.includes('urn:topic') &&
      Number.isNaN(parseFloat(urlId)) &&
      !splittedNdlaUrl.find(e => e.match(/subject:*/)) === undefined
    ) {
      return;
    }
    setQuery('');
    if (urlId.includes('urn:topic')) {
      handleTopicUrl(urlId);
    } else if (splittedNdlaUrl.includes('node')) {
      handleNodeId(parseInt(urlId));
    } else if (splittedNdlaUrl.find(e => e.match(/subject:*/))) {
      handleFrontendUrl(cleanUrl);
    } else {
      navigate(toEditArticle(parseInt(urlId), 'standard'));
    }
  };

  const handleTopicUrl = async (urlId: string) => {
    try {
      const topicArticle = await fetchTopic({
        id: urlId,
        language: i18n.language,
        taxonomyVersion,
      });
      const arr = topicArticle.contentUri.split(':');
      const id = arr[arr.length - 1];
      navigate(toEditArticle(parseInt(id), 'topic-article'));
    } catch {
      navigate(to404());
    }
  };

  const handleFrontendUrl = async (url: string) => {
    const { pathname } = new Url(url);
    const paths = pathname.split('/');
    const path = isValidLocale(paths[1]) ? paths.slice(2).join('/') : pathname;

    try {
      const newArticle = await resolveUrls(path);
      const splittedUri = newArticle.contentUri.split(':');
      const articleId = splittedUri[splittedUri.length - 1];
      navigate(toEditArticle(parseInt(articleId), 'standard'));
    } catch {
      navigate(to404());
    }
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    const isNDLAUrl = isNDLAFrontendUrl(query);
    const isNodeId =
      query.length > 2 && /#\d+/g.test(query) && !Number.isNaN(parseFloat(query.substring(1)));

    const isTaxonomyId = query.length > 2 && /#urn:(resource|topic)[:\da-fA-F-]+/g.test(query);

    if (isNDLAUrl) {
      handleUrlPaste(query);
    } else if (isNodeId) {
      handleNodeId(parseInt(query.substring(1)));
    } else if (isTaxonomyId) {
      handleTaxonomyId(query.substring(1));
    } else {
      onSearchQuerySubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} css={formCSS}>
      <input
        type="text"
        onChange={handleQueryChange}
        value={query}
        placeholder={t('searchForm.placeholder')}
      />
      <Button submit stripped>
        <Search className="c-icon--medium" />
      </Button>
    </form>
  );
};

export default MastheadSearchForm;
