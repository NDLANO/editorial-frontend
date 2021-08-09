/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import {
  StyledConnections,
  StyledDuplicateConnectionLabel,
} from '../../style/LearningResourceTaxonomyStyles';
import Breadcrumb from './Breadcrumb';
import { ResourceWithTopicConnection } from '../../modules/taxonomy/taxonomyApiInterfaces';
import { PathArray } from '../../util/retriveBreadCrumbs';

interface Props {
  topic: ResourceWithTopicConnection;
  type?: string;
  retriveBreadCrumbs: (path: string) => PathArray;
}

export const SharedTopicConnections = ({ topic, retriveBreadCrumbs, type, t }: Props & tType) => {
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
              <Breadcrumb breadcrumb={retriveBreadCrumbs(path)} type={type} />
            </StyledConnections>
          );
        })}
    </>
  );
};

export default injectT(SharedTopicConnections);
