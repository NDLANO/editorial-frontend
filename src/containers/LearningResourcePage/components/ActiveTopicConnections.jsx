import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import {
  BreadCrumb,
  Connections,
  ConnectionsWrapper,
  ErrorLabel,
  RemoveConnectionButton,
  StyledPrimaryConnectionButton,
  StyledDuplicateConnectionLabel,
} from '../../../style/LearningResourceTaxonomyStyles';

const renderTopic = ({ topic, retriveBreadCrumbs, sharedTopicLabel }) => (
  topic.topicConnections.length > 0 &&
    topic.topicConnections
      .filter(topicConnection => !topicConnection.isPrimary)
      .map(topicConnection => {
        const topicConnectionsBreadCrumbs = retriveBreadCrumbs(
          topicConnection.paths[0],
        );
        return (
          <Connections shared key={topicConnection.paths[0]}>
            <StyledDuplicateConnectionLabel>
              {sharedTopicLabel}
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
)

const ActiveTopicConnections = ({
  retriveBreadCrumbs,
  removeConnection,
  setPrimaryConnection,
  activeTopics,
  t,
}) => (
  <ConnectionsWrapper>
    {activeTopics.map(topic => {
      const breadCrumbs = retriveBreadCrumbs(topic.path);
      if (!breadCrumbs) {
        // No breadcrumbs means connection isnt available, show as error 
        return (
          <Connections key={topic.id} error>
            <ErrorLabel>
              {t('taxonomy.topics.disconnectedTaxonomyWarning')}
            </ErrorLabel>
            <BreadCrumb>
              <span>{topic.path}</span>
            </BreadCrumb>
            <RemoveConnectionButton
              type="button"
              onClick={() => removeConnection(topic.id)}>
              <Cross />
            </RemoveConnectionButton>
          </Connections>
        );
      }
      // Render connection
      return (
        <Fragment key={topic.id}>
          <Connections>
            <StyledPrimaryConnectionButton
              primary={topic.primary}
              type="button"
              onClick={() => setPrimaryConnection(topic.id)}>
              {t('form.topics.primaryTopic')}
            </StyledPrimaryConnectionButton>
            <BreadCrumb>
              {breadCrumbs.map(path => (
                <Fragment key={`${topic.id}${path.id}`}>
                  <span>{path.name}</span>
                  <ChevronRight />
                </Fragment>
              ))}
            </BreadCrumb>
            <RemoveConnectionButton
              type="button"
              onClick={() => removeConnection(topic.id)}>
              <Cross />
            </RemoveConnectionButton>
          </Connections>
          {renderTopic({ topic, retriveBreadCrumbs, sharedTopicLabel: t('form.topics.sharedTopic') })}
        </Fragment>
      );
    })}
  </ConnectionsWrapper>
);

ActiveTopicConnections.propTypes = {
  retriveBreadCrumbs: PropTypes.func,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  activeTopics: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(ActiveTopicConnections);
