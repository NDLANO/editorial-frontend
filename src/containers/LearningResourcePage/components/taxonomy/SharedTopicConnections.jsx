import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import TopicConnectionBreadCrumbs from './TopicConnectionBreadCrumbs';
import {
  StyledConnections,
  StyledDuplicateConnectionLabel,
} from '../../../../style/LearningResourceTaxonomyStyles';

export const SharedTopicConnections = ({ topic, retriveBreadCrumbs, t }) => {
  if (topic.topicConnections.length === 0) {
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
  topic: PropTypes.object,
  retriveBreadCrumbs: PropTypes.func.isRequired,
};

export default injectT(SharedTopicConnections);
