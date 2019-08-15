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
import TopicConnectionBreadCrumbs from './TopicConnectionBreadCrumbs';
import {
  StyledConnections,
  StyledDuplicateConnectionLabel,
} from '../../style/LearningResourceTaxonomyStyles';
import { TopicShape } from '../../shapes';

export const SharedTopicConnections = ({ topic, retriveBreadCrumbs, t }) => {
  if (!topic.topicConnections || topic.topicConnections.length === 0) {
    return null;
  }

  return topic.topicConnections
    .filter(topicConnection => !topicConnection.isPrimary)
    .map(topicConnection => {
      return (
        <StyledConnections shared key={topicConnection.paths[0]}>
          <StyledDuplicateConnectionLabel>
            {t('form.topics.sharedTopic')}
          </StyledDuplicateConnectionLabel>
          <TopicConnectionBreadCrumbs
            topicConnection={topicConnection}
            topic={topic}
            retriveBreadCrumbs={retriveBreadCrumbs}
          />
        </StyledConnections>
      );
    });
};

SharedTopicConnections.propTypes = {
  topic: TopicShape,
  retriveBreadCrumbs: PropTypes.func.isRequired,
};

export default injectT(SharedTopicConnections);
