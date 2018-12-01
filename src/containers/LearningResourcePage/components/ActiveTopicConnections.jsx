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
} from '../../../style/LearningResourceTaxonomyStyles';

const ActiveTopicConnections = ({
  retriveBreadCrumbs,
  removeConnection,
  setPrimaryConnection,
  modelTopics,
  t,
}) => (
  <ConnectionsWrapper>
    {modelTopics.map(topic => {
      const breadCrumbs = retriveBreadCrumbs(topic);
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
        <Connections key={topic.id}>
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
      );
    })}
  </ConnectionsWrapper>
);

ActiveTopicConnections.propTypes = {
  retriveBreadCrumbs: PropTypes.func,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  modelTopics: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(ActiveTopicConnections);
