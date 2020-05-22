/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { Copy } from '@ndla/icons/action';

import {
  fetchTopics,
  fetchSubjectTopics,
  fetchTopicResources,
  createTopicResource,
  fetchTopicFilters,
  addFilterToResource,
} from '../../../../modules/taxonomy';
import { Topic, Resource, TranslateType, Filter } from '../../../../interfaces';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';

type PathArray = Array<{
  name: string;
  id: string;
}>;

interface Props {
  t: TranslateType;
  locale: string;
  id: string;
  subjectId: string;
  structure: PathArray;
  onClose: Function;
  setResourcesUpdated: Function;
}

const iconCss = css`
  width: 8px;
  height: 8px;
`;

const CopyResources = ({
  t,
  id,
  locale,
  subjectId,
  structure,
  onClose,
  setResourcesUpdated,
}: Props) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    Promise.all([fetchTopics(locale || 'nb'), fetchSubjectTopics(subjectId)])
      .then(([topics, subjectTopics]: Array<Topic[]>) => {
        setTopics(
          topics
            .filter(topic => !subjectTopics.some(t => t.id === topic.id))
            .map(topic => ({
              ...topic,
              description: getTopicBreadcrumb(topic, topics),
            })),
        );
      })
      .catch((e: Error) => handleError(e));
  }, []);

  const getTopicBreadcrumb = (topic: Topic, topics: Topic[]) => {
    if (!topic.path) return undefined;
    const breadCrumbs: PathArray = retriveBreadCrumbs({
      topicPath: topic.path,
      structure,
      allTopics: topics,
      title: topic.name,
    });
    return breadCrumbs.map(crumb => crumb.name).join(' > ');
  };

  const addResourcesToTopic = async (resources: Resource[]) => {
    const promises = resources.map(resource =>
      createTopicResource({
        primary: resource.isPrimary,
        rank: resource.rank,
        resourceId: resource.id,
        topicid: id,
      }),
    );
    await Promise.all(promises);
    setResourcesUpdated(true);
  };

  const addTopicFiltersToResources = async (
    resources: Resource[],
    filters: Filter[],
  ) => {
    resources.forEach(resource =>
      filters.forEach(filter =>
        addFilterToResource({
          filterId: filter.id,
          resourceId: resource.id,
        }),
      ),
    );
  };

  const handleSubmit = async (topic: Topic) => {
    try {
      const resources: Resource[] = await fetchTopicResources(topic.id);
      addResourcesToTopic(resources);
      const filters: Filter[] = await fetchTopicFilters(id);
      addTopicFiltersToResources(resources, filters);
    } catch (e) {
      handleError(e);
    }
  };

  return showSearch ? (
    <MenuItemDropdown
      placeholder={t('taxonomy.existingTopic')}
      searchResult={topics}
      onClose={onClose}
      onSubmit={handleSubmit}
      icon={<Copy />}
      smallIcon
    />
  ) : (
    <MenuItemButton stripped onClick={() => setShowSearch(true)}>
      <RoundIcon small smallIcon icon={<Copy css={iconCss} />} />
      {t('taxonomy.copyResources')}
    </MenuItemButton>
  );
};

export default injectT(CopyResources);
