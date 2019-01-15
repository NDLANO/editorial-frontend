import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import {
  BreadCrumb,
  Connections,
  StyledDuplicateConnectionLabel,
} from '../../../style/LearningResourceTaxonomyStyles';

export const sharedTopicConnections = ({ topic, retriveBreadCrumbs, t }) =>
  topic.topicConnections.length > 0
    ? topic.topicConnections
        .filter(topicConnection => !topicConnection.isPrimary)
        .map(topicConnection => {
          const topicConnectionsBreadCrumbs = retriveBreadCrumbs(
            topicConnection.paths[0],
          );
          return (
            <Connections shared key={topicConnection.paths[0]}>
              <StyledDuplicateConnectionLabel>
                {t('form.topics.sharedTopic')}
              </StyledDuplicateConnectionLabel>
              <BreadCrumb>
                {topicConnectionsBreadCrumbs.map((path, index) => (
                  <Fragment key={`${topic.id}_${index}`}>
                    <span>{path.name}</span>
                    <ChevronRight />
                  </Fragment>
                ))}
                <span>{topic.name}</span>
                <ChevronRight />
              </BreadCrumb>
            </Connections>
          );
        })
    : null;

sharedTopicConnections.propTypes = {
  topic: PropTypes.object,
  retriveBreadCrumbs: PropTypes.func.isRequired,
};

export default injectT(sharedTopicConnections);
