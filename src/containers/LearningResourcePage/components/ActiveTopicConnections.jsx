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
  PrimaryConnectionButton,
  DuplicateConnectionLabel,
} from './LearningResourceTaxonomyStyles';

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
        // Connection not available.
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
      return (
        <Fragment key={topic.id}>
          <Connections>
          <PrimaryConnectionButton
            primary={topic.primary}
            type="button"
            onClick={() => setPrimaryConnection(topic.id)}>
            {t('form.topics.primaryTopic')}
          </PrimaryConnectionButton>
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
        {topic.topicConnections.length > 0 && topic.topicConnections.filter(topicConnection => !topicConnection.isPrimary).map(topicConnection => {
          const topicConnectionsBreadCrumbs = retriveBreadCrumbs(topicConnection.paths[0]);
          return (<Connections shared key={topicConnection.paths[0]}>
            <DuplicateConnectionLabel>
              {t('form.topics.sharedTopic')}
            </DuplicateConnectionLabel>
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
          </Connections>);
        })}
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
