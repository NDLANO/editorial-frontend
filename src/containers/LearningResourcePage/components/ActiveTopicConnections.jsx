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
} from '../../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';

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
          <SharedTopicConnections
            topic={topic}
            retriveBreadCrumbs={retriveBreadCrumbs}
          />
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
