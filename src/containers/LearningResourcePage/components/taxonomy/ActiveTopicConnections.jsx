import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import {
  StyledConnectionsWrapper,
} from '../../../../style/LearningResourceTaxonomyStyles';
import ActiveTopicConnection from './ActiveTopicConnection';

const ActiveTopicConnections = ({
  activeTopics,
  t,
  ...rest
}) => (
  <StyledConnectionsWrapper>
    {activeTopics.map(topic => <ActiveTopicConnection topic={topic} {...rest}/>)}
  </StyledConnectionsWrapper>
);

ActiveTopicConnections.propTypes = {
  retriveBreadCrumbs: PropTypes.func,
  removeConnection: PropTypes.func,
  setPrimaryConnection: PropTypes.func,
  activeTopics: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(ActiveTopicConnections);
