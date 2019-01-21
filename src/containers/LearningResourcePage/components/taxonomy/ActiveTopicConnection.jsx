import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import {
  StyledBreadCrumb,
  StyledConnections,
  StyledErrorLabel,
  StyledRemoveConnectionButton,
  StyledPrimaryConnectionButton,
} from '../../../../style/LearningResourceTaxonomyStyles';
import SharedTopicConnections from './SharedTopicConnections';

const ActiveTopicConnection = ({
  retriveBreadCrumbs,
  removeConnection,
  setPrimaryConnection,
  t,
  topic,
}) => {
    console.log(topic);
  const breadCrumbs = retriveBreadCrumbs(topic.path);
  if (!breadCrumbs) {
    return (
      <StyledConnections key={topic.id} error>
        <StyledErrorLabel>
          {t('taxonomy.topics.disconnectedTaxonomyWarning')}
        </StyledErrorLabel>
        <StyledBreadCrumb>
          <span>{topic.path}</span>
        </StyledBreadCrumb>
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection(topic.id)}>
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
    );
  }

  return (
    <Fragment key={topic.id}>
      <StyledConnections>
        <StyledPrimaryConnectionButton
          primary={topic.primary}
          type="button"
          onClick={() => setPrimaryConnection(topic.id)}>
          {t('form.topics.primaryTopic')}
        </StyledPrimaryConnectionButton>
        <StyledBreadCrumb>
          {breadCrumbs.map(path => (
            <Fragment key={`${topic.id}${path.id}`}>
              <span>{path.name}</span>
              <ChevronRight />
            </Fragment>
          ))}
        </StyledBreadCrumb>
        <StyledRemoveConnectionButton
          type="button"
          onClick={() => removeConnection(topic.id)}>
          <Cross />
        </StyledRemoveConnectionButton>
      </StyledConnections>
      <SharedTopicConnections
        topic={topic}
        retriveBreadCrumbs={retriveBreadCrumbs}
      />
    </Fragment>
  );
};

ActiveTopicConnection.propTypes = {
  retriveBreadCrumbs: PropTypes.func,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
};

export default injectT(ActiveTopicConnection);
