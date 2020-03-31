/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { injectT } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';

import {
  fetchTopics,
  fetchSubjectTopics,
} from '../../../../modules/taxonomy';
import {
  Topic,
  TranslateType
} from '../../../../interfaces';
import retriveBreadCrumbs from '../../../../util/retriveBreadCrumbs';
import MenuItemDropdown from './MenuItemDropdown';
import MenuItemButton from './MenuItemButton';
import RoundIcon from '../../../../components/RoundIcon';

type PathArray = Array<{
  name: string;
  id: string;
}>;

interface Props {
  t: TranslateType;
  locale: string;
  subjectId: string;
  structure: PathArray;
  onClose: Function;
}

const CopyResources = ({ t, locale, subjectId, structure, onClose }: Props) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchTopics(locale || 'nb'), 
      fetchSubjectTopics(subjectId),
    ])
      .then(([topics, subjectTopics]: Array<Topic[]>) => {
        setTopics(topics
          .filter(topic => !subjectTopics.some(t => t.id === topic.id))
          .map(topic => ({
            ...topic,
            description: getTopicBreadcrumb(topic, topics),
          })))
      })
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

  return (
    showSearch ? (
      <MenuItemDropdown
        placeholder={t('taxonomy.existingTopic')}
        searchResult={topics}
        onClose={onClose}
        onSubmit={() => {}}
        icon={<Plus />}
      />
    ) : (
      <MenuItemButton stripped onClick={() => setShowSearch(true)}>
        <RoundIcon small icon={<Plus />} />
        {'Kopier'}
      </MenuItemButton>
    ));
}

export default injectT(CopyResources);