/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import {
  StyledConnections,
  StyledDuplicateConnectionLabel,
} from '../../style/LearningResourceTaxonomyStyles';
import { TopicShape } from '../../shapes';
import Breadcrumb from './Breadcrumb';

export const SharedTopicConnections = ({
  topic,
  retriveBreadCrumbs,
  type,
  t,
}) => {
  if (!topic.paths || topic.paths.length === 0) {
    return null;
  }

  return topic.paths
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
    });
};

SharedTopicConnections.propTypes = {
  topic: TopicShape,
  type: PropTypes.string,
  retriveBreadCrumbs: PropTypes.func.isRequired,
};

export default injectT(SharedTopicConnections);
