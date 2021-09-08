/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyledConnections,
  StyledDuplicateConnectionLabel,
} from '../../style/LearningResourceTaxonomyStyles';
import Breadcrumb from './Breadcrumb';
import { PathArray } from '../../util/retrieveBreadCrumbs';
import { StagedTopic } from '../../containers/ArticlePage/TopicArticlePage/components/TopicArticleTaxonomy';

interface Props {
  topic: StagedTopic;
  type?: string;
  retrieveBreadCrumbs: (path: string) => PathArray;
}

export const SharedTopicConnections = ({ topic, retrieveBreadCrumbs, type }: Props) => {
  const { t } = useTranslation();
  if (!topic.paths || topic.paths.length === 0) {
    return null;
  }

  return (
    <>
      {topic.paths
        .filter(path => path !== topic.path)
        .map(path => {
          return (
            <StyledConnections shared key={path}>
              <StyledDuplicateConnectionLabel>
                {t('form.topics.sharedTopic')}
              </StyledDuplicateConnectionLabel>
              <Breadcrumb breadcrumb={retrieveBreadCrumbs(path)} type={type} />
            </StyledConnections>
          );
        })}
    </>
  );
};

export default SharedTopicConnections;
